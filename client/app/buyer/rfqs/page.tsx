"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import RFQChat from "@/components/RFQChat";
import { Badge } from "@/components/shared/Badge";
import { useToast } from "@/lib/hooks/useToast";
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  Send,
  X,
  FileText,
  Clock,
  Package,
  DollarSign,
  MessageSquare,
  Inbox,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
// Types are imported from the shared types file
import { RFQRecord, RFQFormState } from "@/types/rfq";

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
async function acceptQuotation(quotationId: string) {
  const response = await fetch(
    `${API_URL}/api/quotations/${quotationId}/accept`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to accept quotation");
  }

  return data;
}

async function rejectQuotation(quotationId: string) {
  const response = await fetch(
    `${API_URL}/api/quotations/${quotationId}/reject`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reject quotation");
  }

  return data;
}
// Shared input styling so every field in both forms looks identical
const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";
const labelClass = "mb-1.5 block text-xs font-semibold text-slate-700";

export default function BuyerRFQs() {
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const [showCannotDeleteModal, setShowCannotDeleteModal] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  // State for controlling the "Create RFQ" form visibility
  const [showForm, setShowForm] = useState(false);
  const [selectedRFQId, setSelectedRFQId] = useState<string | null>(null);
  const [editingRFQId, setEditingRFQId] = useState<string | null>(null);
  // Which supplier's 1:1 chat thread is currently open for the selected RFQ
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null,
  );
  const [form, setForm] = useState<RFQFormState>(initialForm);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rfqIdToDelete, setRfqIdToDelete] = useState<string | null>(null);

  const { data: rfqs = [], isLoading } = useQuery<RFQRecord[]>({
    queryKey: ["rfqs", "buyer"],
    queryFn: async () => {
      const response = await request<{ success: boolean; data: RFQRecord[] }>(
        "/",
      );
      return response.data;
    },
  });

  const { data: selectedRFQ, isLoading: isLoadingSelectedRFQ } =
    useQuery<RFQRecord | null>({
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

  const createMutation = useMutation({
    mutationFn: async (payload: {
      title: string;
      category: string;
      quantity: number;
      budget: number;
      deadline: string;
      description: string;
    }) => {
      const response = await request<{
        success: boolean;
        data: RFQRecord;
      }>(`/`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfqs", "buyer"] });
      queryClient.invalidateQueries({ queryKey: ["rfqs", "seller"] });
      success(
        "RFQ posted",
        "Your request is live and suppliers can respond now.",
      );
      setForm(initialForm);
      setShowForm(false);
    },
    onError: (err) => {
      error("RFQ failed", (err as Error).message);
    },
  });

  // Edit RFQ mutation
  const editRFQMutation = useMutation({
    mutationFn: async ({
      rfqId,
      payload,
    }: {
      rfqId: string;
      payload: Partial<RFQRecord>;
    }) => {
      const response = await request<{ success: boolean; data: RFQRecord }>(
        `/${rfqId}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfqs", "buyer"] });
      queryClient.invalidateQueries({ queryKey: ["rfqs", "seller"] });
      success("RFQ updated", "Your changes have been saved.");
      setEditingRFQId(null);
      setForm(initialForm);
    },
    onError: (err) => {
      error("Update failed", (err as Error).message);
    },
  });

  // Delete RFQ mutation
  const deleteRFQMutation = useMutation({
    mutationFn: async (rfqId: string) => {
      return await request<void>(`/${rfqId}`, {
        method: "DELETE",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rfqs", "buyer"],
      });

      queryClient.invalidateQueries({
        queryKey: ["rfqs", "seller"],
      });

      success("RFQ deleted", "The RFQ has been removed successfully.");
    },

    onError: (err) => {
      const message = (err as Error).message;

      if (
        message.toLowerCase().includes("order") ||
        message.toLowerCase().includes("active")
      ) {
        setDeleteErrorMessage(
          "This RFQ cannot be deleted because it has an active order associated with it.",
        );

        setShowCannotDeleteModal(true);
        return;
      }

      error("Delete failed", message);
    },
  });

  // ✅ ADD HERE
  const rejectQuotationMutation = useMutation({
    mutationFn: (quotationId: string) => rejectQuotation(quotationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rfq", selectedRFQId],
      });

      toast.success("Quotation rejected");
    },

    onError: (error: any) => {
      toast.error(error.message || "Reject failed");
    },
  });

  const acceptQuotationMutation = useMutation({
    mutationFn: (quotationId: string) => acceptQuotation(quotationId),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["rfq", selectedRFQId],
      });

      queryClient.invalidateQueries({
        queryKey: ["rfqs", "buyer"],
      });

      toast.success(
        `Order ${data.data.order.orderNumber} created successfully`,
      );
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to accept quotation");
    },
  });

  const handleViewRFQ = async (rfqId: string) => {
    setSelectedRFQId(rfqId);
    // Reset any previously open chat thread when switching RFQs
    setSelectedSupplierId(null);
  };

  const handleCreateRFQ = () => {
    setEditingRFQId(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const handleEditRFQ = (rfq: RFQRecord) => {
    setShowForm(false);
    setEditingRFQId(rfq.id);
    setForm({
      title: rfq.title,
      category: rfq.category,
      quantity: rfq.quantity.toString(),
      budget: rfq.budget.toString(),
      deadline: rfq.deadline.split("T")[0],
      notes: rfq.description,
    });
  };

  const openDeleteModal = (id: string) => {
    setRfqIdToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setRfqIdToDelete(null);
  };

  const confirmDelete = async () => {
    if (!rfqIdToDelete) return;
    try {
      await deleteRFQMutation.mutateAsync(rfqIdToDelete);
      toast.success("RFQ deleted successfully");
    } catch (e) {
      toast.error((e as Error).message || "Delete failed");
    } finally {
      closeDeleteModal();
    }
  };

  const handleDeleteRFQ = (rfqId: string) => {
    openDeleteModal(rfqId);
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
    } catch (err) {
      error("RFQ failed", (err as Error).message);
    }
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingRFQId) return;
    try {
      await editRFQMutation.mutateAsync({
        rfqId: editingRFQId,
        payload: {
          title: form.title.trim(),
          category: form.category.trim(),
          quantity: Number(form.quantity),
          budget: Number(form.budget),
          deadline: new Date(form.deadline).toISOString(),
          description: form.notes,
        },
      });
    } catch {
      // error toast already handled in mutation's onError
    }
  };

  // ---- Derived stats for the summary row ----
  const totalRFQs = rfqs.length;
  const totalQuotations = rfqs.reduce(
    (sum, rfq) => sum + (rfq._count?.quotations ?? 0),
    0,
  );
  const rfqsAwaitingResponse = rfqs.filter(
    (rfq) => (rfq._count?.quotations ?? 0) === 0,
  ).length;
  const totalBudget = rfqs.reduce((sum, rfq) => sum + (rfq.budget || 0), 0);

  const statCards = [
    {
      label: "Open RFQs",
      value: totalRFQs,
      icon: FileText,
      tint: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Quotations received",
      value: totalQuotations,
      icon: MessageSquare,
      tint: "bg-blue-50 text-blue-600",
    },
    {
      label: "Awaiting response",
      value: rfqsAwaitingResponse,
      icon: Clock,
      tint: "bg-amber-50 text-amber-600",
    },
    {
      label: "Combined budget",
      value: `$${totalBudget.toLocaleString()}`,
      icon: DollarSign,
      tint: "bg-slate-100 text-slate-700",
    },
  ];

  // Delete Confirmation Dialog
  const deleteDialog = (
    <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete RFQ</DialogTitle>

          <DialogDescription className="space-y-2 pt-2">
            <span className="block text-sm text-slate-700">
              Are you sure you want to delete this RFQ?
            </span>

            <span className="block text-sm text-slate-500">
              This action cannot be undone. RFQs linked to active orders cannot
              be deleted.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>

          <Button
            className="bg-rose-600 text-white hover:bg-rose-700"
            onClick={confirmDelete}
          >
            Delete RFQ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const cannotDeleteDialog = (
    <Dialog
      open={showCannotDeleteModal}
      onOpenChange={setShowCannotDeleteModal}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            Unable to delete RFQ
          </DialogTitle>

          <DialogDescription className="mt-2 text-sm leading-relaxed">
            {deleteErrorMessage}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            onClick={() => setShowCannotDeleteModal(false)}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Shared form body used by both the create and edit dialogs
  const renderRFQFields = () => (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className={labelClass}>What do you need?</label>
        <input
          value={form.title}
          onChange={(event) =>
            setForm((current) => ({ ...current, title: event.target.value }))
          }
          className={fieldClass}
          placeholder="e.g. Industrial pumps for production line"
        />
      </div>
      <div>
        <label className={labelClass}>Category</label>
        <input
          value={form.category}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              category: event.target.value,
            }))
          }
          className={fieldClass}
          placeholder="e.g. Machinery"
        />
      </div>
      <div>
        <label className={labelClass}>Quantity</label>
        <input
          type="number"
          min={1}
          value={form.quantity}
          onKeyDown={(e) => {
            if (e.key === "-") e.preventDefault();
          }}
          onChange={(event) => {
            const value = event.target.value;
            if (value === "" || Number(value) >= 1) {
              setForm((current) => ({ ...current, quantity: value }));
            }
          }}
          className={fieldClass}
          placeholder="50 units"
        />
      </div>
      <div>
        <label className={labelClass}>Budget (USD)</label>
        <input
          type="number"
          min={1}
          value={form.budget}
          onKeyDown={(e) => {
            if (e.key === "-") e.preventDefault();
          }}
          onChange={(event) =>
            setForm((current) => ({ ...current, budget: event.target.value }))
          }
          className={fieldClass}
          placeholder="25,000"
        />
      </div>
      <div>
        <label className={labelClass}>Deadline</label>
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={form.deadline}
          onChange={(event) => {
            const selectedDate = event.target.value;
            const today = new Date().toISOString().split("T")[0];
            if (selectedDate >= today) {
              setForm((current) => ({ ...current, deadline: selectedDate }));
            }
          }}
          className={fieldClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass}>What should suppliers know?</label>
        <textarea
          value={form.notes}
          onChange={(event) =>
            setForm((current) => ({ ...current, notes: event.target.value }))
          }
          className={`${fieldClass} min-h-24 resize-none`}
          placeholder="Include quality standards, delivery expectations, and any required certifications."
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {deleteDialog}
      {cannotDeleteDialog}

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Requests for Quotation
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Post sourcing requests and manage supplier responses in one place.
          </p>
        </div>
        <button
          onClick={handleCreateRFQ}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Create RFQ
        </button>
      </div>

      {/* Stat summary row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, tint }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${tint}`}
            >
              <Icon className="h-4.5 w-4.5" />
            </div>
            <p className="mt-3 text-xl font-bold tracking-tight text-slate-900">
              {value}
            </p>
            <p className="text-xs font-medium text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Selected RFQ detail panel */}
      {selectedRFQ ? (
        <Card className="overflow-hidden border border-slate-200 p-0">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                RFQ Detail
              </p>
              <h2 className="mt-0.5 text-lg font-semibold text-slate-900">
                {selectedRFQ.title}
              </h2>
              <p className="text-sm text-slate-500">{selectedRFQ.category}</p>
            </div>
            <button
              onClick={() => setSelectedRFQId(null)}
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-6 px-6 py-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <DollarSign className="h-3.5 w-3.5" /> Budget
                </div>
                <p className="mt-1.5 text-lg font-bold text-slate-900">
                  ${selectedRFQ.budget.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Package className="h-3.5 w-3.5" /> Quantity
                </div>
                <p className="mt-1.5 text-lg font-bold text-slate-900">
                  {selectedRFQ.quantity}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Clock className="h-3.5 w-3.5" /> Deadline
                </div>
                <p className="mt-1.5 text-lg font-bold text-slate-900">
                  {new Date(selectedRFQ.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {selectedRFQ.description}
              </p>
            </div>

            {/* Supplier quotations */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Supplier Quotations
              </h3>

              {isLoadingSelectedRFQ ? (
                <div className="space-y-2">
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className="h-20 animate-pulse rounded-lg bg-slate-100"
                    />
                  ))}
                </div>
              ) : !selectedRFQ.quotations ||
                selectedRFQ.quotations.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 py-10 text-center">
                  <Inbox className="h-6 w-6 text-slate-300" />
                  <p className="text-sm text-slate-500">
                    No quotations yet. You'll be able to message suppliers here
                    once they respond.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {selectedRFQ.quotations.map((quotation) => (
                    <div
                      key={quotation.id}
                      className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">
                            {quotation.supplier.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {quotation.supplier.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {quotation.supplier.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 sm:text-right">
                          <div>
                            <p className="text-xs text-slate-500">Price</p>
                            <p className="text-sm font-bold text-emerald-700">
                              ${quotation.price.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Lead time</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {quotation.leadTime}
                            </p>
                          </div>
                          <Badge
                            variant={
                              quotation.status === "accepted"
                                ? "success"
                                : quotation.status === "rejected"
                                  ? "danger"
                                  : "default"
                            }
                          >
                            {quotation.status}
                          </Badge>
                          {quotation.status === "pending" && (
                            <div className="flex gap-2">
                              {/* Accept Button */}
                              <button
                                onClick={() =>
                                  acceptQuotationMutation.mutate(quotation.id)
                                }
                                disabled={
                                  acceptQuotationMutation.isPending ||
                                  rejectQuotationMutation.isPending
                                }
                                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                              >
                                {acceptQuotationMutation.isPending
                                  ? "Accepting..."
                                  : "Accept"}
                              </button>

                              {/* Reject Button */}
                              <button
                                onClick={() =>
                                  rejectQuotationMutation.mutate(quotation.id)
                                }
                                disabled={
                                  acceptQuotationMutation.isPending ||
                                  rejectQuotationMutation.isPending
                                }
                                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                              >
                                {rejectQuotationMutation.isPending
                                  ? "Rejecting..."
                                  : "Reject"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {quotation.message ? (
                        <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600">
                          {quotation.message}
                        </p>
                      ) : null}

                      <button
                        onClick={() =>
                          setSelectedSupplierId(quotation.supplier.id)
                        }
                        className={`mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                          selectedSupplierId === quotation.supplier.id
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        {selectedSupplierId === quotation.supplier.id
                          ? "Chat open"
                          : "Message supplier"}
                      </button>

                      {selectedSupplierId === quotation.supplier.id ? (
                        <div className="mt-4 border-t border-slate-100 pt-4">
                          <RFQChat
                            conversationId={quotation.conversation?.id || ""}
                            currentUserId={selectedRFQ.userId}
                            currentUserRole="buyer"
                            rfqId={selectedRFQ.id}
                            supplierId={quotation.supplier.id}
                            otherPartyName={quotation.supplier.name}
                          />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : null}

      {/* Create RFQ modal */}
      <Dialog open={showForm && !editingRFQId} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create a new RFQ</DialogTitle>
            <DialogDescription>
              Share what you need and suppliers will respond with quotes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            {renderRFQFields()}
            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Send className="h-4 w-4" />
                {createMutation.isPending ? "Posting..." : "Post RFQ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit RFQ modal */}
      <Dialog
        open={Boolean(editingRFQId)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingRFQId(null);
            setForm(initialForm);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit RFQ</DialogTitle>
            <DialogDescription>
              Update the details of your RFQ.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            {renderRFQFields()}
            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingRFQId(null);
                  setForm(initialForm);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editRFQMutation.isPending}
                className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Send className="h-4 w-4" />
                {editRFQMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* RFQ table */}
      <Card className="overflow-hidden border border-slate-200 p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  RFQ
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Budget
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Responses
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [0, 1, 2].map((i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-5 w-full animate-pulse rounded bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : rfqs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                        <FileText className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        No RFQs yet
                      </p>
                      <p className="max-w-xs text-xs text-slate-500">
                        Post your first request for quotation and suppliers will
                        start sending offers.
                      </p>
                      <button
                        onClick={handleCreateRFQ}
                        className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Create RFQ
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                rfqs.map((rfq) => (
                  <tr
                    key={rfq.id}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{rfq.title}</p>
                      <p className="text-xs text-slate-400">
                        #{rfq.id.slice(0, 8)}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{rfq.category}</td>
                    <td className="px-5 py-4 font-medium text-slate-900">
                      ${rfq.budget.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="success">Active</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {rfq._count?.quotations ?? 0}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewRFQ(rfq.id)}
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditRFQ(rfq)}
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRFQ(rfq.id)}
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
