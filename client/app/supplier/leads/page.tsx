"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, TrendingUp } from "lucide-react";
import { LEADS } from "@/lib/utils/mockData";

export default function SupplierLeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Active Leads</h1>
        <p className="text-muted-foreground mt-2">
          Monitor incoming buyer interest and follow up quickly to convert
          prospects.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {LEADS.map((lead) => (
          <Card key={lead.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Lead
                </p>
                <h2 className="mt-1 text-xl font-semibold">{lead.id}</h2>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                {lead.status}
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{lead.notes}</p>
            <div className="mt-6 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                High intent buyer
              </div>
              <Button variant="outline" className="gap-2">
                Follow up <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold">Smart reminders</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Buyer conversations are prioritized automatically so your team
              never misses a hot lead.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
