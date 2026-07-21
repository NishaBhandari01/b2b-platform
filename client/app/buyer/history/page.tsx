"use client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/shared/Badge";
import { Clock, Package, MessageSquare, Eye } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getBuyerOrders() {
  const response = await fetch(`${API_URL}/api/orders/buyer`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data.data;
}

export default function BuyerHistory() {
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["buyer-orders"],
    queryFn: getBuyerOrders,
  });

  {
    error && (
      <Card className="p-6">
        <p className="text-sm text-red-500">Failed to load order history.</p>
      </Card>
    );
  }

  const activities = orders.map((order: any) => ({
    id: order.id,

    type: "order",

    title: order.status === "delivered" ? "Order Delivered" : "Order Placed",

    description: `Ordered from ${order.supplier.name}`,

    amount: `$${order.amount.toLocaleString()}`,

    timestamp: new Date(order.createdAt).toLocaleString(),

    status: order.status,
  }));
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="w-5 h-5" />;
      case "rfq":
        return <Eye className="w-5 h-5" />;
      case "message":
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-600";
      case "rfq":
        return "bg-purple-100 text-purple-600";
      case "message":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Activity History</h1>
        <p className="text-slate-600 mt-1">
          Complete timeline of your activities and transactions
        </p>
      </div>

      <div className="space-y-4">
        {isLoading && (
          <p className="text-sm text-slate-500">Loading history...</p>
        )}

        {!isLoading && activities.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-sm text-slate-500">No order history found.</p>
          </Card>
        )}
        {activities.map((activity: any) => (
          <Card key={activity.id} className="p-6">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${getActivityColor(activity.type)}`}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {activity.description}
                    </p>
                  </div>
                  <Badge
                    variant={
                      activity.status === "delivered"
                        ? "success"
                        : activity.status === "pending"
                          ? "warning"
                          : "default"
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                  <p className="text-sm text-slate-600 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {activity.timestamp}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {activity.amount}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
