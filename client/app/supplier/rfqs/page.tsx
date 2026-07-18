"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/hooks/useToast";
import {
  FileText,
  Send,
  ArrowRight,
  X,
  Clock,
  Package,
  DollarSign,
  CheckCircle2,
  Search,
  Loader2,
  Inbox,
  SearchX,
  AlertTriangle,
} from "lucide-react";

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
  hasQuoted?: boolean;
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

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function daysUntil(deadline: string): number {
  return Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

/* ------------------------------------------------------------------ */
/*  Skeleton / empty states                                             */
/* ------------------------------------------------------------------ */

function RFQCardSkeleton() {
  return (
    <Card className="animate-pulse p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="h-3 w-1/4 rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-4 h-3 w-full rounded bg-slate-100" />
      <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="h-10 rounded-lg bg-slate-50" />
        <div className="h-10 rounded-lg bg-slate-50" />
        <div className="h-10 rounded-lg bg-slate-50" />
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center border-dashed px-6 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
        <Inbox className="h-8 w-8 text-emerald-600" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">
        No RFQs available yet
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        New buyer requests will appear here as they're posted. Keep your product
        catalog current to match more incoming RFQs.
      </p>
    </Card>
  );
}

function NoResultsState({ onClear }: { onClear: () => void }) {
  return (
    <Card className="flex flex-col items-center justify-center border-dashed px-6 py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <SearchX className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">
        No RFQs match your search
      </h3>
      <Button variant="outline" size="sm" className="mt-4" onClick={onClear}>
        Clear search
      </Button>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function SupplierRFQsPage() {
  const { success, error } = useToast();
  const queryClient = useQueryClient();
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQRecord | null>(null);
  const [search, setSearch] = useState("");
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
    staleTime: 60 * 1000,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rfqs;
    return rfqs.filter((r) =>
      `${r.title} ${r.category}`.toLowerCase().includes(q),
    );
  }, [rfqs, search]);

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

  const closeQuoteForm = () => {
    setShowQuoteForm(false);
    setSelectedRFQ(null);
    setForm({ price: "", leadTime: "", message: "" });
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

  const openCount = rfqs.length;
  const quotedCount = rfqs.filter((r) => r.hasQuoted).length;
  const closingSoonCount = rfqs.filter((r) => {
    const d = daysUntil(r.deadline);
    return d > 0 && d <= 3;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            RFQ Requests
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Stay on top of incoming buyer requests and respond quickly.
          </p>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-2xl font-bold text-slate-900">
            {isLoading ? "–" : openCount}
          </p>
          <p className="mt-0.5 text-[13px] font-medium text-slate-500">
            Open RFQs
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-slate-900">
            {isLoading ? "–" : closingSoonCount}
          </p>
          <p className="mt-0.5 text-[13px] font-medium text-slate-500">
            Closing in 3 days
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-slate-900">
            {isLoading ? "–" : quotedCount}
          </p>
          <p className="mt-0.5 text-[13px] font-medium text-slate-500">
            You've quoted
          </p>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search RFQs by title or category..."
          className="h-10 max-w-md border-slate-200 pl-9 text-sm focus-visible:ring-emerald-200"
        />
      </div>

      {/* Quote form */}
      {showQuoteForm && selectedRFQ ? (
        <Card className="space-y-4 border border-emerald-200 bg-emerald-50/30 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Respond to RFQ
              </h2>
              <p className="mt-0.5 text-sm text-slate-600">
                {selectedRFQ.title} · {selectedRFQ.category}
              </p>
            </div>
            <button
              onClick={closeQuoteForm}
              className="rounded-full p-2 text-slate-500 transition-colors hover:bg-white hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Price offer (USD)
              </label>
              <input
                value={form.price}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    price: event.target.value,
                  }))
                }
                type="number"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="e.g. 12500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
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
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="e.g. 3 weeks"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
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
                className="min-h-30 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Tell them about pricing, delivery, and any value-added services."
              />
            </div>
            <div className="flex justify-end gap-3 md:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeQuoteForm}
                className="border-slate-200 text-slate-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={quoteMutation.isPending}
                className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {quoteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Submit Quotation
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {/* RFQ list */}
      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <RFQCardSkeleton key={i} />)
        ) : rfqs.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <NoResultsState onClear={() => setSearch("")} />
        ) : (
          filtered.map((rfq) => {
            const days = daysUntil(rfq.deadline);
            const isExpired = days <= 0;
            const closingSoon = !isExpired && days <= 3;

            return (
              <Card
                key={rfq.id}
                className="p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-slate-900">
                          {rfq.title}
                        </h2>
                        {rfq.hasQuoted && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Quoted
                          </span>
                        )}
                        {isExpired && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                            Expired
                          </span>
                        )}
                        {closingSoon && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                            <AlertTriangle className="h-3 w-3" />
                            Closing soon
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {rfq.id.slice(0, 8)} ·{" "}
                        {new Date(rfq.deadline).toLocaleDateString()}
                      </p>
                      <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-slate-500">
                        {rfq.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {rfq.category}
                    </span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {rfq._count?.quotations ?? 0} responses
                    </span>
                    <Button
                      size="sm"
                      variant={rfq.hasQuoted ? "outline" : "default"}
                      disabled={isExpired || rfq.hasQuoted}
                      className={
                        rfq.hasQuoted
                          ? "gap-1.5 border-slate-200 text-slate-500"
                          : "gap-1.5 bg-slate-900 text-white hover:bg-slate-800"
                      }
                      onClick={() => openQuoteForm(rfq)}
                    >
                      {rfq.hasQuoted ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5" />
                      )}
                      {rfq.hasQuoted
                        ? "Quoted"
                        : isExpired
                          ? "Expired"
                          : "Respond"}
                    </Button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        Budget
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatCurrency(rfq.budget)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Package className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        Quantity
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {rfq.quantity.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        Deadline
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          isExpired ? "text-rose-500" : "text-slate-900"
                        }`}
                      >
                        {isExpired
                          ? "Expired"
                          : `${days} day${days > 1 ? "s" : ""} left`}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
