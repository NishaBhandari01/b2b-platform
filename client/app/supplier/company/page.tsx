"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, BadgeCheck } from "lucide-react";

export default function SupplierCompanyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Store Profile</h1>
          <p className="text-muted-foreground mt-2">
            Present your company profile professionally to buyers and partners.
          </p>
        </div>
        <Button>Publish profile</Button>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold">Northstar Manufacturing</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Manufacturer of industrial components and connected automation
              systems.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
              <BadgeCheck className="w-4 h-4" /> Verified supplier
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
