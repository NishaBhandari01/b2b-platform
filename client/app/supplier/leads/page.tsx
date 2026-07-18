"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Search,
  RefreshCw,
  Inbox,
  SearchX,
  TriangleAlert,
  Clock,
  Package,
  DollarSign,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMyRFQs } from "@/lib/api/rfq.api";
import type { RFQRecord } from "@/types/rfq";

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function daysUntil(deadline: string): number {
  return Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
}

function isNew(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

type SortOption = "newest" | "highest_budget" | "closing_soon" | "most_quotes";

/* ------------------------------------------------------------------ */
/*  Filter + sort                                                       */
/* ------------------------------------------------------------------ */

function filterAndSort(
  rfqs: RFQRecord[],
  search: string,
  category: string,
  sort: SortOption,
): RFQRecord[] {
  const q = search.trim().toLowerCase();

  let list = rfqs.filter((r) => {
    if (q && !`${r.title} ${r.category}`.toLowerCase().includes(q))
      return false;
    if (category !== "All Categories" && r.category !== category) return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    switch (sort) {
      case "highest_budget":
        return b.budget - a.budget;
      case "closing_soon":
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case "most_quotes":
        return (b._count?.quotations ?? 0) - (a._count?.quotations ?? 0);
      case "newest":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  return list;
}

/* ------------------------------------------------------------------ */
/*  Lead card                                                           */
/* ------------------------------------------------------------------ */

function LeadCard({ rfq }: { rfq: RFQRecord }) {
  const days = daysUntil(rfq.deadline);
  const quotationCount = rfq._count?.quotations ?? 0;
  const expired = days <= 0;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-600">
            {rfq.category}
          </p>
          <h3 className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">
            {rfq.title}
          </h3>
        </div>
        {isNew(rfq.createdAt) && (
          <span className="shrink-0 rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-semibold text-orange-700">
            New
          </span>
        )}
      </div>

      <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-500">
        {rfq.description}
      </p>

      <div className="grid grid-cols-3 gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
        <div className="flex flex-col items-center gap-0.5">
          <Package className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[13px] font-semibold text-slate-800">
            {rfq.quantity}
          </span>
          <span className="text-[10px] uppercase text-slate-400">Qty</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <DollarSign className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[13px] font-semibold text-slate-800">
            {formatCurrency(rfq.budget)}
          </span>
          <span className="text-[10px] uppercase text-slate-400">Budget</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <FileText className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[13px] font-semibold text-slate-800">
            {quotationCount}
          </span>
          <span className="text-[10px] uppercase text-slate-400">Quotes</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <span
          className={`flex items-center gap-1 text-[12px] font-medium ${
            expired ? "text-rose-500" : "text-slate-500"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          {expired ? "Expired" : `${days} day${days > 1 ? "s" : ""} left`}
        </span>
        <Link href={`/supplier/rfqs/${rfq.id}`}>
          <Button
            size="sm"
            disabled={expired}
            className="h-8 bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
          >
            {expired ? "Closed" : "View & Quote"}
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton / empty / error states                                     */
/* ------------------------------------------------------------------ */

function LeadCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="h-3 w-20 rounded bg-slate-100" />
      <div className="mt-2 h-4 w-3/4 rounded bg-slate-200" />
      <div className="mt-3 h-3 w-full rounded bg-slate-100" />
      <div className="mt-4 h-16 w-full rounded-lg bg-slate-50" />
      <div className="mt-4 h-8 w-full rounded bg-slate-100" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
        <Inbox className="h-8 w-8 text-emerald-600" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">
        No open RFQs right now
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        New buyer requests will show up here as they're posted. Add more
        products in your active categories to increase your chances of matching
        an RFQ.
      </p>
    </div>
  );
}

function NoResultsState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <SearchX className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">
        No RFQs match your filters
      </h3>
      <Button variant="outline" size="sm" className="mt-4" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-rose-50/40 px-6 py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
        <TriangleAlert className="h-6 w-6 text-rose-500" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">
        Couldn't load your leads
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Check your connection and try again.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 gap-1.5"
        onClick={onRetry}
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function SupplierLeadsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sort, setSort] = useState<SortOption>("newest");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["my-rfqs"],
    queryFn: getMyRFQs,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
  });

  const rfqs = data?.data ?? [];

  const categories = useMemo(
    () => [
      "All Categories",
      ...Array.from(new Set(rfqs.map((r) => r.category))),
    ],
    [rfqs],
  );

  const filtered = useMemo(
    () => filterAndSort(rfqs, search, category, sort),
    [rfqs, search, category, sort],
  );

  const expiringSoon = rfqs.filter((r) => {
    const d = daysUntil(r.deadline);
    return d > 0 && d <= 3;
  }).length;

  const totalBudget = rfqs.reduce((sum, r) => sum + r.budget, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-350 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              My Leads
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Open buyer RFQs you can quote on.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-slate-200 text-slate-600"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Mini stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-slate-900">
              {isLoading ? "–" : rfqs.length}
            </p>
            <p className="mt-0.5 text-[13px] font-medium text-slate-500">
              Open RFQs
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-slate-900">
              {isLoading ? "–" : expiringSoon}
            </p>
            <p className="mt-0.5 text-[13px] font-medium text-slate-500">
              Closing in 3 days
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-slate-900">
              {isLoading ? "–" : formatCurrency(totalBudget)}
            </p>
            <p className="mt-0.5 text-[13px] font-medium text-slate-500">
              Combined budget
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search RFQs by title or category..."
              className="h-10 border-slate-200 pl-9 text-sm focus-visible:ring-emerald-200"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-48"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="h-10 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-48"
            >
              <option value="newest">Newest</option>
              <option value="closing_soon">Closing Soon</option>
              <option value="highest_budget">Highest Budget</option>
              <option value="most_quotes">Most Quotes</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          {isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <LeadCardSkeleton key={i} />
              ))}
            </div>
          ) : rfqs.length === 0 ? (
            <EmptyState />
          ) : filtered.length === 0 ? (
            <NoResultsState
              onClear={() => {
                setSearch("");
                setCategory("All Categories");
              }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((rfq) => (
                <LeadCard key={rfq.id} rfq={rfq} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
