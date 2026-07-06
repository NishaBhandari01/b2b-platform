"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2 } from "lucide-react";

const rfqs = [
  {
    id: "RFQ-101",
    title: "Bulk lighting components",
    status: "Awaiting response",
    deadline: "2 days left",
  },
  {
    id: "RFQ-102",
    title: "Automation sensors",
    status: "Quoted",
    deadline: "5 days left",
  },
];

export default function SupplierRFQsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">RFQ Requests</h1>
        <p className="text-muted-foreground mt-2">
          Stay on top of incoming buyer requests and respond quickly.
        </p>
      </div>

      <div className="grid gap-4">
        {rfqs.map((rfq) => (
          <Card key={rfq.id} className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold">{rfq.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {rfq.id} • {rfq.deadline}
                </p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <CheckCircle2 className="w-4 h-4" /> {rfq.status}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
