import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { useToast } from "@/lib/hooks/useToast";

interface SupplierInfo {
  id: string;
  name: string;
  email: string;
}

export interface QuotationRecord {
  id: string;
  price: number;
  leadTime: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  supplier: SupplierInfo;
  conversationId?: string;
  createdAt: string;
}

interface Props {
  quotation: QuotationRecord;
  rfqId: string;
  onOpenChat: (conversationId: string) => void;
}

export function QuotationCard({ quotation, rfqId, onOpenChat }: Props) {
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: async () => {
      await api<any>("PATCH", `/api/quotations/${quotation.id}/accept`);
    },
    onSuccess: () => {
      success("Quotation accepted");
      queryClient.invalidateQueries({ queryKey: ["rfqs", "buyer"] });
      queryClient.invalidateQueries({ queryKey: ["rfq", rfqId] });
    },
    onError: (err: any) => error(err.message ?? "Accept failed"),
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      await api<any>("PATCH", `/api/quotations/${quotation.id}/reject`);
    },
    onSuccess: () => {
      success("Quotation rejected");
      queryClient.invalidateQueries({ queryKey: ["rfqs", "buyer"] });
      queryClient.invalidateQueries({ queryKey: ["rfq", rfqId] });
    },
    onError: (err: any) => error(err.message ?? "Reject failed"),
  });

  const handleAccept = async () => {
    await acceptMutation.mutateAsync();
  };

  const handleReject = async () => {
    await rejectMutation.mutateAsync();
  };

  const openChat = async () => {
    // Ensure a conversation exists, create if needed via API
    const conv = await api<any>("GET", `/api/conversations/${rfqId}/${quotation.supplier.id}`);
    onOpenChat(conv.id);
  };

  return (
    <Card className="p-4 mb-4 shadow-md">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Supplier</p>
          <CardTitle>{quotation.supplier.name}</CardTitle>
          <p className="text-sm text-slate-500">{quotation.supplier.email}</p>
        </div>
        <div className="grid gap-2 sm:text-right">
          <span className="text-sm text-slate-500">Price</span>
          <p className="font-semibold text-slate-900">${quotation.price}</p>
        </div>
        <div className="grid gap-2 sm:text-right">
          <span className="text-sm text-slate-500">Lead time</span>
          <p className="font-semibold text-slate-900">{quotation.leadTime}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">{quotation.message}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between">
        <Badge
          variant={
            quotation.status === "accepted"
              ? "success"
              : quotation.status === "rejected"
              ? "danger"
              : "secondary"
          }
        >
          {quotation.status}
        </Badge>
        {quotation.status === "pending" && (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAccept} disabled={acceptMutation.isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Check className="w-4 h-4" /> Accept
            </Button>
            <Button size="sm" variant="outline" onClick={handleReject} disabled={rejectMutation.isLoading} className="border-red-600 text-red-600 hover:bg-red-100">
              <X className="w-4 h-4" /> Reject
            </Button>
          </div>
        )}
        <Button size="sm" variant="secondary" onClick={openChat}>
          Message Supplier
        </Button>
      </CardFooter>
    </Card>
  );
}
