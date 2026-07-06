"use client";

import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";

export default function SupplierAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Performance</h1>
        <p className="text-muted-foreground mt-2">
          Review your marketplace performance, response metrics, and growth
          trends.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h2 className="font-semibold">Response rate</h2>
          </div>
          <p className="mt-4 text-3xl font-semibold">95%</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Fast and reliable response times help improve lead quality.
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold">Monthly growth</h2>
          </div>
          <p className="mt-4 text-3xl font-semibold">+18%</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Buyer engagement and RFQ volume are trending upward.
          </p>
        </Card>
      </div>
    </div>
  );
}
