"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const issues = [
  { title: "Suspicious product listing", severity: "High", date: "2 hrs ago" },
  {
    title: "Duplicate supplier profile",
    severity: "Medium",
    date: "5 hrs ago",
  },
];

export default function AdminModerationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Moderation</h1>
        <p className="text-muted-foreground mt-2">
          Screen content and protect the integrity of the marketplace.
        </p>
      </div>

      <div className="grid gap-4">
        {issues.map((issue) => (
          <Card
            key={issue.title}
            className="flex items-center justify-between p-6"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <h2 className="font-semibold">{issue.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Reported {issue.date}
                </p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <CheckCircle2 className="w-4 h-4" /> Resolve
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
