"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Package,
  Zap,
  DollarSign,
  TrendingUp,
  Clock,
  Eye,
  MessageSquare,
  ArrowRight,
  Star,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
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
  const openRfqCount = rfqData?.data.length ?? 0;
  const recentRFQs: RFQRecord[] = (rfqData?.data ?? []).slice(0, 4);

  // Mock metrics (replace when analytics API is ready)
  const mockMetrics = {
    monthlyRevenue: 12840,
    rating: 4.8,
    responseRate: 92,
    conversionRate: 34,
    completedDeals: 18,
    avgResponseTime: "2.4h",
  };

  const stats = [
    {
      label: "Active Products",
      value: productsLoading ? "—" : String(activeProductCount),
      sub: "Listed & live",
      icon: Package,
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
    },
    {
      label: "Open RFQs",
      value: rfqsLoading ? "—" : String(openRfqCount),
      sub: "Need your quote",
      icon: Zap,
      color: "from-orange-500 to-amber-600",
      bg: "bg-orange-50",
      text: "text-orange-700",
    },
    {
      label: "Monthly Revenue",
      value: `$${mockMetrics.monthlyRevenue.toLocaleString()}`,
      sub: "+12% vs last month",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      bg: "bg-green-50",
      text: "text-green-700",
    },
    {
      label: "Profile Rating",
      value: mockMetrics.rating.toFixed(1),
      sub: "Based on 47 reviews",
      icon: Star,
      color: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Supplier Dashboard
          </h1>
          <p className="text-slate-500 mt-1.5">
            Overview of your products, RFQs, and performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/supplier/rfqs">
            <button className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
              View all RFQs
            </button>
          </Link>
          <Link href="/supplier/products">
            <button className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
              + Add Product
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                      {stat.value}
                    </p>
                    <p className={`text-xs font-medium mt-1.5 ${stat.text}`}>
                      {stat.sub}
                    </p>
                  </div>
                  <div
                    className={`w-11 h-11 rounded-2xl bg-linear-to-br ${stat.color} flex items-center justify-center shadow-inner`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent RFQs */}
        <Card className="lg:col-span-2 border-0 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Recent RFQ Requests
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Latest buyer requests matching your catalog
              </p>
            </div>
            <Link
              href="/supplier/rfqs"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-5">
            {rfqsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-2xl bg-slate-100"
                  />
                ))}
              </div>
            ) : recentRFQs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-14 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600">
                  No open RFQs right now
                </p>
                <p className="mt-1 max-w-xs text-xs text-slate-400">
                  New buyer requests matching your categories will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRFQs.map((rfq) => {
                  const days = daysUntil(rfq.deadline);
                  const quotationCount = rfq._count?.quotations ?? 0;
                  const urgent = days > 0 && days <= 3;

                  return (
                    <Link
                      key={rfq.id}
                      href={`/supplier/rfqs/${rfq.id}`}
                      className="block group"
                    >
                      <div className="p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                                {rfq.title}
                              </p>
                              {isNew(rfq.createdAt) && (
                                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[11px] font-semibold">
                                  New
                                </span>
                              )}
                              {urgent && (
                                <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[11px] font-semibold flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  Urgent
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                              {rfq.category} · {rfq.quantity} units · Budget $
                              {rfq.budget.toLocaleString()}
                              {quotationCount > 0 &&
                                ` · ${quotationCount} quote${quotationCount > 1 ? "s" : ""}`}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0 mt-1" />
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {days > 0
                              ? `Expires in ${days} day${days > 1 ? "s" : ""}`
                              : "Expired"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        {/* Performance + Quick actions */}
        <div className="space-y-6">
          {/* Performance */}
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                Performance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Last 30 days</p>
            </div>
            <div className="p-5 space-y-5">
              {[
                {
                  label: "Response rate",
                  value: `${mockMetrics.responseRate}%`,
                  icon: MessageSquare,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
                {
                  label: "Conversion rate",
                  value: `${mockMetrics.conversionRate}%`,
                  icon: TrendingUp,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Completed deals",
                  value: String(mockMetrics.completedDeals),
                  icon: CheckCircle2,
                  color: "text-green-600",
                  bg: "bg-green-50",
                },
                {
                  label: "Avg. response time",
                  value: mockMetrics.avgResponseTime,
                  icon: Clock,
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl ${m.bg} flex items-center justify-center`}
                    >
                      <Icon className={`w-4 h-4 ${m.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-500">{m.label}</p>
                      <p className="text-base font-semibold text-slate-900">
                        {m.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick actions */}
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                Quick actions
              </h2>
            </div>
            <div className="p-3 space-y-1">
              {[
                {
                  href: "/supplier/products",
                  label: "Manage products",
                  icon: Package,
                },
                {
                  href: "/supplier/rfqs",
                  label: "Browse RFQs",
                  icon: Zap,
                },
                {
                  href: "/supplier/quotations",
                  label: "My quotations",
                  icon: Eye,
                },
                {
                  href: "/supplier/messages",
                  label: "Messages",
                  icon: MessageSquare,
                },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    {a.label}
                    <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-300" />
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Premium CTA */}
      <Card className="relative overflow-hidden border-0 shadow-sm `bg-linear-to-r from-emerald-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <h2 className="text-xl font-bold">Upgrade to Premium</h2>
            <p className="text-emerald-100 mt-1.5 max-w-md text-sm">
              Featured placement, advanced analytics, priority support, and
              higher RFQ visibility.
            </p>
          </div>
          <button className="px-6 py-2.5 bg-white text-emerald-700 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition-colors shadow-sm whitespace-nowrap">
            Learn more
          </button>
        </div>
      </Card>
    </div>
  );
}
