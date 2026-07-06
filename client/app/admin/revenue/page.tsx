"use client";

import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, CreditCard } from "lucide-react";

export default function AdminRevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Revenue & Payouts</h1>
        <p className="text-muted-foreground mt-2">
          Track premium plans, ad monetization, and payout health.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-semibold">$345K</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Growth</p>
              <p className="text-2xl font-semibold">+18.4%</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">Payouts</p>
              <p className="text-2xl font-semibold">$84K</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
