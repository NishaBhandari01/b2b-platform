"use client";

import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card } from "@/components/ui/card";
import { Package, Zap, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getMyProducts } from "@/lib/api/product.api";
import { getMyRFQs } from "@/lib/api/rfq.api";
import type { RFQRecord } from "@/types/rfq";

function daysUntil(deadline: string): number {
  const diffMs = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function isNew(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
}

export default function SupplierDashboard() {
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["my-products"],
    queryFn: getMyProducts,
    staleTime: 60 * 1000,
  });

  const { data: rfqData, isLoading: rfqsLoading } = useQuery({
    queryKey: ["my-rfqs"],
    queryFn: getMyRFQs,
    staleTime: 60 * 1000,
  });

  const activeProductCount =
    productsData?.data.filter((p) => p.status === "Active").length ?? 0;

  const recentRFQs: RFQRecord[] = (rfqData?.data ?? []).slice(0, 3);

  const stats = [
    {
      label: "Active Products",
      value: productsLoading ? "—" : String(activeProductCount),
      icon: <Package className="w-6 h-6 text-white" />,
      color: "bg-emerald-600",
    },
    {
      label: "Open RFQs",
      value: rfqsLoading ? "—" : String(rfqData?.data.length ?? 0),
      icon: <Zap className="w-6 h-6 text-white" />,
      color: "bg-orange-600",
    },
    {
      label: "Monthly Revenue",
      value: "—",
      icon: <DollarSign className="w-6 h-6 text-white" />,
      color: "bg-green-600",
    },
    {
      label: "Profile Rating",
      value: "—",
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: "bg-blue-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Supplier Dashboard
          </h1>
          <p className="text-slate-600 mt-2">
            Manage your business on TradeHub
          </p>
        </div>
        <Link href="/supplier/products">
          <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
            + Add Product
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent RFQs */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Recent RFQ Requests
          </h2>

          {rfqsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          ) : recentRFQs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-12 text-center">
              <p className="text-sm font-medium text-slate-500">
                No open RFQs right now
              </p>
              <p className="mt-1 max-w-xs text-xs text-slate-400">
                New buyer requests matching your categories will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRFQs.map((rfq) => {
                const days = daysUntil(rfq.deadline);
                const quotationCount = rfq._count?.quotations ?? 0;
                return (
                  <div
                    key={rfq.id}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-slate-900">
                        {rfq.title}
                      </p>
                      {isNew(rfq.createdAt) && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      {rfq.category} · {rfq.quantity} units · Budget $
                      {rfq.budget.toLocaleString()}
                      {quotationCount > 0 &&
                        ` · ${quotationCount} quote${quotationCount > 1 ? "s" : ""} so far`}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {days > 0
                          ? `Expires in ${days} day${days > 1 ? "s" : ""}`
                          : "Expired"}
                      </span>
                      <Link href={`/supplier/rfqs/${rfq.id}`}>
                        <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                          View Details →
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Performance Overview — still not connected */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Performance Metrics
          </h2>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-8 text-center">
            <p className="text-sm font-medium text-slate-500">
              Not connected yet
            </p>
            <p className="mt-1 max-w-xs text-xs text-slate-400">
              Response rate, conversion, and completion rate need an analytics
              endpoint.
            </p>
          </div>
        </Card>
      </div>

      {/* Featured Section */}
      <Card className="p-6 bg-linear-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <h2 className="text-lg font-bold text-slate-900 mb-3">
          Upgrade to Premium
        </h2>
        <p className="text-slate-600 mb-4">
          Get featured placement, advanced analytics, and priority support
        </p>
        <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm">
          Learn More
        </button>
      </Card>
    </div>
  );
}
