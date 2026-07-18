"use client";

import { useState } from "react";
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

/* -------- mock data — replace with your API response -------- */

const kpis = [
  { label: "RFQs responded", value: "412", change: 15.1, icon: Inbox },
  { label: "Quotations sent", value: "156", change: 9.1, icon: FileText },
  { label: "Win rate", value: "34%", change: 6.1, icon: Trophy },
  { label: "Avg. response time", value: "2.4 hrs", change: -22.6, icon: Clock },
];

const revenue = [
  { month: "Feb", value: 98000 },
  { month: "Mar", value: 112000 },
  { month: "Apr", value: 125000 },
  { month: "May", value: 138000 },
  { month: "Jun", value: 152000 },
  { month: "Jul", value: 184500 },
];

const rfqVolume = [
  { week: "Wk 1", responded: 46, won: 12 },
  { week: "Wk 2", responded: 52, won: 15 },
  { week: "Wk 3", responded: 50, won: 14 },
  { week: "Wk 4", responded: 61, won: 19 },
  { week: "Wk 5", responded: 58, won: 17 },
  { week: "Wk 6", responded: 71, won: 24 },
];

const topProducts = [
  { name: "SS304 Seamless Pipes", views: 842, rfqs: 46, winRate: 39 },
  { name: 'Gate Valves 2"-12"', views: 611, rfqs: 38, winRate: 29 },
  { name: "Hex Bolts & Nuts Set", views: 590, rfqs: 27, winRate: 18 },
  { name: "Flexible Hose Couplings", views: 402, rfqs: 19, winRate: 33 },
];

/* -------------------------------------------------------------- */

export default function SupplierAnalyticsPage() {
  const [range, setRange] = useState("30d");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
          <p className="text-muted-foreground mt-1">
            Response metrics, revenue, and RFQ trends.
          </p>
        </div>
        <Select value={range} onValueChange={setRange}>
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

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-5">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-emerald-50">
                <kpi.icon className="w-4 h-4 text-emerald-600" />
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
        ))}
      </div>

      {/* Revenue + RFQ charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Revenue</h2>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity={0.25} />
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
                  formatter={(v: number) => [
                    `$${v.toLocaleString()}`,
                    "Revenue",
                  ]}
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
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-4">RFQs responded vs. won</h2>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rfqVolume}>
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
          </div>
        </Card>
      </div>

      {/* Top products */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Top performing products</h2>
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
            {topProducts.map((p) => (
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
      </Card>
    </div>
  );
}
