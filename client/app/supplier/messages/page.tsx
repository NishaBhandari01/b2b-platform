"use client";

import { Card } from "@/components/ui/card";
import { MessageSquare, Send } from "lucide-react";

export default function SupplierMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Supplier Messages</h1>
        <p className="text-muted-foreground mt-2">
          Keep buyer conversations moving with prompt replies and clear next
          steps.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold">Message center</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The buyer has requested a revised proposal. Use this message area
              to coordinate pricing, lead times, and shipping terms.
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <input
            className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm"
            placeholder="Type a response..."
          />
          <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </Card>
    </div>
  );
}
