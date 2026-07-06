"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldAlert } from "lucide-react";

const verifications = [
  { company: "Northstar Manufacturing", status: "Pending", priority: "High" },
  { company: "Innova Supplies", status: "Approved", priority: "Medium" },
  { company: "Bright Build Co.", status: "Needs Review", priority: "High" },
];

export default function AdminVerificationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Supplier Verification</h1>
        <p className="text-muted-foreground mt-2">
          Review supplier credentials, certificates, and business legitimacy.
        </p>
      </div>

      <div className="grid gap-4">
        {verifications.map((item) => (
          <Card
            key={item.company}
            className="flex items-center justify-between p-6"
          >
            <div className="flex items-center gap-3">
              {item.status === "Approved" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-amber-600" />
              )}
              <div>
                <h2 className="font-semibold">{item.company}</h2>
                <p className="text-sm text-muted-foreground">
                  {item.priority} priority
                </p>
              </div>
            </div>
            <Button variant="outline">Review</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
