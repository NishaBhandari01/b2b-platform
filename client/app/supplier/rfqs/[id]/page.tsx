"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Package,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getRFQById, submitQuotation } from "@/lib/api/rfq.api";

function daysUntil(deadline: string): number {
  const diffMs = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default function SupplierRFQDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [price, setPrice] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [message, setMessage] = useState("");

  const {
    data: rfq,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["rfq", params.id],
    queryFn: () => getRFQById(params.id),
    enabled: !!params.id,
  });

  const quoteMutation = useMutation({
    mutationFn: () =>
      submitQuotation(params.id, {
        price: Number(price),
        leadTime,
        message,
      }),
    onSuccess: () => {
      toast.success("Quotation submitted", {
        description: "The buyer will be notified of your offer.",
      });
      queryClient.invalidateQueries({ queryKey: ["my-rfqs"] });
      setPrice("");
      setLeadTime("");
      setMessage("");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ?? "Couldn't submit your quotation.";
      toast.error("Something went wrong", { description: msg });
    },
  });

  function handleSubmitQuote(e: React.FormEvent) {
    e.preventDefault();
    if (!price || !leadTime || !message) {
      toast.error("Fill in price, lead time, and a message before submitting.");
      return;
    }
    quoteMutation.mutate();
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-100" />
      </div>
    );
  }

  if (isError || !rfq) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-base font-semibold text-slate-900">RFQ not found</p>
        <p className="mt-1 text-sm text-slate-500">
          It may have been closed or removed.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/supplier/dashboard")}
        >
          Back to dashboard
        </Button>
      </div>
    );
  }

  const days = daysUntil(rfq.deadline);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <Card className="mt-4 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-600">
              {rfq.category}
            </p>
            <h1 className="mt-0.5 text-2xl font-bold text-slate-900">
              {rfq.title}
            </h1>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              days > 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {days > 0 ? `${days} day${days > 1 ? "s" : ""} left` : "Expired"}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          {rfq.description}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-slate-50 p-4">
          <div className="flex flex-col items-center gap-1">
            <Package className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-900">
              {rfq.quantity}
            </span>
            <span className="text-[11px] text-slate-500">Quantity</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <DollarSign className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-900">
              ${rfq.budget.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">Budget</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-900">
              {new Date(rfq.deadline).toLocaleDateString()}
            </span>
            <span className="text-[11px] text-slate-500">Deadline</span>
          </div>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Submit a Quotation
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          You can only submit one quotation per RFQ.
        </p>

        <form onSubmit={handleSubmitQuote} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Your Price (USD)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="4800"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Lead Time
            </label>
            <input
              type="text"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="10 business days"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Message to Buyer
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="We can meet this spec with certified stock on hand..."
            />
          </div>
          <Button
            type="submit"
            disabled={quoteMutation.isPending}
            className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {quoteMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Submit Quotation
          </Button>
        </form>
      </Card>
    </div>
  );
}
