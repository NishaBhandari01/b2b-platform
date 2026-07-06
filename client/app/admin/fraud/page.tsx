"use client";

import { Card } from "@/components/ui/card";
import { ShieldAlert, CheckCircle2 } from "lucide-react";

const alerts = [
  { title: "Unusual transaction pattern", status: "Investigating" },
  { title: "Duplicate company registration", status: "Resolved" },
];

export default function AdminFraudPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fraud Detection</h1>
        <p className="text-muted-foreground mt-2">
          Watch for suspicious behavior and unusual activity on the platform.
        </p>
      </div>

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <Card
            key={alert.title}
            className="flex items-center justify-between p-6"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <div>
                <h2 className="font-semibold">{alert.title}</h2>
                <p className="text-sm text-muted-foreground">{alert.status}</p>
              </div>
            </div>
            <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
              {alert.status === "Resolved" ? (
                <CheckCircle2 className="mr-1 inline w-4 h-4" />
              ) : null}
              {alert.status}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
