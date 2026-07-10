"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/useToast";
import { FileText, Send, ArrowRight, X } from "lucide-react";

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
  status: string;
  _count?: {
    quotations: number;
  };
}

interface CreateQuotationForm {
  price: string;
  leadTime: string;
  message: string;
}

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

export default function SupplierRFQsPage() {
  const { success, error } = useToast();
  const queryClient = useQueryClient();
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQRecord | null>(null);
  const [form, setForm] = useState<CreateQuotationForm>({
    price: "",
    leadTime: "",
    message: "",
  });

  const { data: rfqs = [], isLoading } = useQuery<RFQRecord[]>({
    queryKey: ["rfqs", "seller"],
    queryFn: async () => {
      const response = await request<{ success: boolean; data: RFQRecord[] }>(
        "/",
      );
      return response.data;
    },
  });

  const quoteMutation = useMutation({
    mutationFn: async (payload: {
      rfqId: string;
      price: number;
      leadTime: string;
      message: string;
    }) => {
      const response = await request<{
        success: boolean;
        data: Record<string, unknown>;
      }>(`/${payload.rfqId}/quotations`, {
        method: "POST",
        body: JSON.stringify({
          price: payload.price,
          leadTime: payload.leadTime,
          message: payload.message,
        }),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfqs", "seller"] });
      queryClient.invalidateQueries({ queryKey: ["rfqs", "buyer"] });
      success("Quotation sent", "Your quote has been submitted to the buyer.");
      setShowQuoteForm(false);
      setSelectedRFQ(null);
      setForm({ price: "", leadTime: "", message: "" });
    },
    onError: (err) => {
      error("Quotation failed", (err as Error).message);
    },
  });

  const openQuoteForm = (rfq: RFQRecord) => {
    setSelectedRFQ(rfq);
    setShowQuoteForm(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedRFQ) return;

    const price = Number(form.price);
    if (!price || price <= 0 || !form.leadTime.trim() || !form.message.trim()) {
      error("Invalid quote", "Please complete price, lead time, and message.");
      return;
    }

    await quoteMutation.mutateAsync({
      rfqId: selectedRFQ.id,
      price,
      leadTime: form.leadTime.trim(),
      message: form.message.trim(),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">RFQ Requests</h1>
        <p className="text-muted-foreground mt-2">
          Stay on top of incoming buyer requests and respond quickly.
        </p>
      </div>

      {showQuoteForm && selectedRFQ ? (
        <Card className="p-6 space-y-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Respond to RFQ</h2>
              <p className="text-sm text-slate-600">
                {selectedRFQ.title} — {selectedRFQ.category}
              </p>
            </div>
            <button
              onClick={() => {
                setShowQuoteForm(false);
                setSelectedRFQ(null);
              }}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Price offer
              </label>
              <input
                value={form.price}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    price: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
                placeholder="e.g. 12500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Lead time
              </label>
              <input
                value={form.leadTime}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    leadTime: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
                placeholder="e.g. 3 weeks"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Message to buyer
              </label>
              <textarea
                value={form.message}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    message: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none min-h-[120px]"
                placeholder="Tell them about pricing, delivery, and any value-added services."
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowQuoteForm(false);
                  setSelectedRFQ(null);
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
                Submit Quotation
              </button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {isLoading ? (
          <Card className="p-6 text-center text-muted-foreground">
            Loading RFQs...
          </Card>
        ) : rfqs.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No RFQs available yet.
          </Card>
        ) : (
          rfqs.map((rfq) => (
            <Card key={rfq.id} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{rfq.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {rfq.id.slice(0, 8)} •{" "}
                      {new Date(rfq.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    {rfq.category}
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {rfq._count?.quotations ?? 0} responses
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() => openQuoteForm(rfq)}
                  >
                    <ArrowRight className="w-4 h-4" /> Respond
                  </Button>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-500">Budget</p>
                  <p className="font-medium text-slate-900">${rfq.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Quantity</p>
                  <p className="font-medium text-slate-900">{rfq.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Deadline</p>
                  <p className="font-medium text-slate-900">
                    {new Date(rfq.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
