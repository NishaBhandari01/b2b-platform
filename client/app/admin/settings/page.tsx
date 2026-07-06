"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-muted-foreground mt-2">
          Tune marketplace behavior, security controls, and notifications.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
            <Settings2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold">Operational controls</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Security policies, email notifications, and supplier verification
              thresholds are ready to be adjusted from this workspace.
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button>Save Settings</Button>
          <Button variant="outline">Reset</Button>
        </div>
      </Card>
    </div>
  );
}
