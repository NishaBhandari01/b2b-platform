"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/shared/Badge";
import { useToast } from "@/lib/hooks/useToast";
import { Plus, Eye, Edit2, Trash2, Send, Check, X } from "lucide-react";

interface RFQFormState {
  title: string;
  category: string;
  quantity: string;
  budget: string;
  deadline: string;
  notes: string;
}

interface QuotationRecord {
  id: string;
  price: number;
  leadTime: string;
  message: string;
  status: string;
  supplier: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface RFQRecord {
  id: string;
  title: string;
  category: string;
  quantity: number;
  budget: number;
  deadline: string;
  description: string;
  userId: string;
  createdAt: string;
  status?: string;
  quotations?: QuotationRecord[];
}

const initialForm: RFQFormState = {
  title: "",
  category: "",
  quantity: "",
  budget: "",
  deadline: "",
  notes: "",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}/api/rfq${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data as T;
}

export default function BuyerRFQs() {
  const { success, error, info } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [selectedRFQId, setSelectedRFQId] = useState<string | null>(null);

  const { data: rfqs = [], isLoading } = useQuery<RFQRecord[]>({
    queryKey: ["rfqs", "buyer"],
    queryFn: async () => {
      const response = await request<{ success: boolean; data: RFQRecord[] }>(
        "/",
      );
      return response.data;
    },
  });

  const {
    data: selectedRFQ,
    isLoading: isLoadingSelectedRFQ,
    refetch: refetchSelectedRFQ,
  } = useQuery<RFQRecord | null>({
    queryKey: ["rfq", selectedRFQId],
    queryFn: async () => {
      if (!selectedRFQId) {
        return null;
      }
      const response = await request<{ success: boolean; data: RFQRecord }>(
        `/${selectedRFQId}`,
      );
      return response.data;
    },
    enabled: Boolean(selectedRFQId),
    staleTime: 1000 * 60 * 2,
  });

  const acceptRejectMutation = useMutation({
    mutationFn: async (payload: { quotationId: string; status: string }) => {
      const response = await fetch(
        `${API_URL}/api/rfq/quotations/${payload.quotationId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: payload.status }),
        },
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Request failed");
      }
      return data as { success: boolean; data: QuotationRecord };
    },
    onSuccess: () => {
      success("Quotation updated", "The quotation status has been saved.");
      queryClient.invalidateQueries({ queryKey: ["rfqs", "buyer"] });
      queryClient.invalidateQueries({ queryKey: ["rfq", selectedRFQId] });
      refetchSelectedRFQ();
    },
    onError: (err) => {
      error("Update failed", (err as Error).message);
    },
  });

  const handleViewRFQ = async (rfqId: string) => {
    setSelectedRFQId(rfqId);
  };

  const createMutation = useMutation({
    mutationFn: async (payload: {
      title: string;
      category: string;
      quantity: number;
      budget: number;
      deadline: string;
      description: string;
    }) => {
      const response = await request<{ success: boolean; data: RFQRecord }>(
        "/",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfqs", "buyer"] });
      queryClient.invalidateQueries({ queryKey: ["rfqs", "seller"] });
    },
  });

  const handleEditRFQ = (rfqId: string) => {
    info("Edit flow", `Opening edit experience for ${rfqId}.`);
  };

  const handleDeleteRFQ = (rfqId: string) => {
    if (window.confirm(`Delete RFQ ${rfqId}?`)) {
      success("RFQ removed", `${rfqId} was removed from your list.`);
    }
  };

  const handleCreateRFQ = () => {
    setShowForm(true);
  };

  const handleAcceptReject = async (
    quotationId: string,
    status: "accepted" | "rejected",
  ) => {
    await acceptRejectMutation.mutateAsync({ quotationId, status });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const quantity = Number(form.quantity);
    const budget = Number(form.budget);

    if (
      !form.title.trim() ||
      !form.category.trim() ||
      !form.deadline ||
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !Number.isFinite(budget) ||
      budget <= 0
    ) {
      error(
        "Missing details",
        "Please complete the required fields before posting your RFQ.",
      );
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: form.title.trim(),
        category: form.category.trim(),
        quantity,
        budget,
        deadline: new Date(form.deadline).toISOString(),
        description: form.notes || `RFQ for ${form.title}`,
      });
      setForm(initialForm);
      setShowForm(false);
      success(
        "RFQ posted",
        `Your request is live and suppliers can respond now.`,
      );
    } catch (err) {
      error("RFQ failed", (err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Requests for Quotation
          </h1>
          <p className="text-slate-600 mt-1">Manage and track your RFQs</p>
        </div>
        <button
          onClick={handleCreateRFQ}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Create RFQ
        </button>
      </div>

      {selectedRFQ ? (
        <Card className="p-6 space-y-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                RFQ Details
              </h2>
              <p className="text-sm text-slate-600">
                {selectedRFQ.title} • {selectedRFQ.category}
              </p>
            </div>
            <button
              onClick={() => setSelectedRFQId(null)}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">Budget</p>
              <p className="font-semibold text-slate-900">
                ${selectedRFQ.budget}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Quantity</p>
              <p className="font-semibold text-slate-900">
                {selectedRFQ.quantity}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Deadline</p>
              <p className="font-semibold text-slate-900">
                {new Date(selectedRFQ.deadline).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-500">Description</p>
            <p className="mt-2 text-slate-800">{selectedRFQ.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Supplier Quotations
            </h3>
            {isLoadingSelectedRFQ ? (
              <div className="py-6 text-center text-slate-500">
                Loading supplier responses...
              </div>
            ) : !selectedRFQ.quotations ||
              selectedRFQ.quotations.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500">
                No quotations have been submitted for this RFQ yet.
              </div>
            ) : (
              <div className="grid gap-4">
                {selectedRFQ.quotations.map((quotation) => (
                  <Card key={quotation.id} className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Supplier</p>
                        <p className="font-semibold text-slate-900">
                          {quotation.supplier.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {quotation.supplier.email}
                        </p>
                      </div>
                      <div className="grid gap-2 sm:text-right">
                        <span className="text-sm text-slate-500">Price</span>
                        <p className="font-semibold text-slate-900">
                          ${quotation.price}
                        </p>
                      </div>
                      <div className="grid gap-2 sm:text-right">
                        <span className="text-sm text-slate-500">
                          Lead time
                        </span>
                        <p className="font-semibold text-slate-900">
                          {quotation.leadTime}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-slate-600">
                        {quotation.message}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant={
                            quotation.status === "accepted"
                              ? "success"
                              : quotation.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {quotation.status}
                        </Badge>
                        {quotation.status === "pending" ? (
                          <>
                            <button
                              onClick={() =>
                                handleAcceptReject(quotation.id, "accepted")
                              }
                              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                              <Check className="w-4 h-4" /> Accept
                            </button>
                            <button
                              onClick={() =>
                                handleAcceptReject(quotation.id, "rejected")
                              }
                              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                            >
                              <X className="w-4 h-4" /> Reject
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      ) : null}

      {showForm ? (
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Create a new RFQ
            </h2>
            <p className="text-sm text-slate-600">
              Share what you need and suppliers will respond with quotes.
            </p>
          </div>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                What do you need?
              </label>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0"
                placeholder="e.g. Industrial pumps for production line"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Category
              </label>
              <input
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0"
                placeholder="Category"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Quantity
              </label>
              <input
                value={form.quantity}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    quantity: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0"
                placeholder="50 units"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Budget
              </label>
              <input
                value={form.budget}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    budget: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0"
                placeholder="$25,000 - $35,000"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Deadline
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    deadline: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                What should suppliers know?
              </label>
              <textarea
                value={form.notes}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
                className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0"
                placeholder="Include quality standards, delivery expectations, and any required certifications."
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
                Post RFQ
              </button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4">
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  RFQ ID
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Title
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Category
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Budget
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Status
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Responses
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">
                    Loading RFQs...
                  </td>
                </tr>
              ) : rfqs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">
                    No RFQs yet. Create the first one.
                  </td>
                </tr>
              ) : (
                rfqs.map((rfq) => (
                  <tr
                    key={rfq.id}
                    className="border-t hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-900">
                        {rfq.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-slate-900">{rfq.title}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-slate-600">{rfq.category}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-slate-900 font-medium">
                        ${rfq.budget}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={"success"}>Active</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        0
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewRFQ(rfq.id)}
                          className="p-2 hover:bg-slate-200 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => handleEditRFQ(rfq.id)}
                          className="p-2 hover:bg-slate-200 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteRFQ(rfq.id)}
                          className="p-2 hover:bg-red-100 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
