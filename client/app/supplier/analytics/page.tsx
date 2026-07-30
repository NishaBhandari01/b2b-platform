"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Inbox,
  FileText,
  Trophy,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* -------- types (match backend response) -------- */

type KpiIcon = "Inbox" | "FileText" | "Trophy" | "Clock";

interface AnalyticsKpi {
  label: string;
  value: string;
  change: number;
  icon: KpiIcon;
}

interface RevenuePoint {
  month: string;
  value: number;
}

interface RfqVolumePoint {
  week: string;
  responded: number;
  won: number;
}

interface TopProduct {
  name: string;
  views: number;
  rfqs: number;
  winRate: number;
}

interface SupplierAnalyticsResponse {
  kpis: AnalyticsKpi[];
  revenue: RevenuePoint[];
  rfqVolume: RfqVolumePoint[];
  topProducts: TopProduct[];
}

const iconMap = {
  Inbox,
  FileText,
  Trophy,
  Clock,
};

/* -------------------------------------------------------------- */

export default function SupplierAnalyticsPage() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const [data, setData] = useState<SupplierAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAnalytics() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:5000/api/supplier/analytics?range=${range}`,
          {
            credentials: "include",
          },
        );

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Request failed (${res.status})`);
        }

        const json: SupplierAnalyticsResponse = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load analytics",
          );
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAnalytics();

    return () => {
      cancelled = true;
    };
  }, [range]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
          <p className="text-muted-foreground mt-1">
            Response metrics, revenue, and RFQ trends.
          </p>
        </div>

        <Select
          value={range}
          onValueChange={(v) => setRange(v as "7d" | "30d" | "90d")}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error */}
      {error && (
        <Card className="p-5 border-red-200 bg-red-50 text-red-700">
          {error}
        </Card>
      )}

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading || !data
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card
                key={i}
                className="p-5 h-[118px] animate-pulse bg-muted/40"
              />
            ))
          : data.kpis.map((kpi) => {
              const Icon = iconMap[kpi.icon];

              return (
                <Card key={kpi.label} className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-emerald-50">
                      <Icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <Badge
                      variant="secondary"
                      className={`gap-0.5 text-xs ${
                        kpi.change >= 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {kpi.change >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {Math.abs(kpi.change)}%
                    </Badge>
                  </div>
                  <p className="mt-3 text-2xl font-semibold">{kpi.value}</p>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                </Card>
              );
            })}
      </div>

      {/* Revenue + RFQ charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Revenue</h2>
          <div className="h-[220px] relative">
            {loading || !data ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenue}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#059669"
                        stopOpacity={0.25}
                      />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v / 1000}k`}
                    width={44}
                  />
                  <Tooltip
                    formatter={(value) => {
                      if (value === undefined || value === null)
                        return ["—", "Revenue"];
                      return [`$${Number(value).toLocaleString()}`, "Revenue"];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#059669"
                    strokeWidth={2}
                    fill="url(#rev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* RFQ Volume */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">RFQs responded vs. won</h2>
          <div className="h-[220px] relative">
            {loading || !data ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.rfqVolume}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="responded"
                    fill="#93c5fd"
                    radius={[4, 4, 0, 0]}
                    name="Responded"
                  />
                  <Bar
                    dataKey="won"
                    fill="#059669"
                    radius={[4, 4, 0, 0]}
                    name="Won"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Top products */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Top performing products</h2>

        {loading || !data ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">RFQs</TableHead>
                <TableHead className="text-right">Win rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topProducts.map((p) => (
                <TableRow key={p.name}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {p.views}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {p.rfqs}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {p.winRate}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

{
  {
    console.log(
      "  aiteha dsiadtheu agags iaoi oyiu uuyjcjjuyfh  kiuytevvhk liuyrvcyo iuytf yuk  ",
    );
  }
}
