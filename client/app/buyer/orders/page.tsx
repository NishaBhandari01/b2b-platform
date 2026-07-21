"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/shared/Badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Download,
  Truck,
  Search,
  PackageSearch,
  Wallet,
  ClipboardList,
  RotateCcw,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Order {
  id: string;
  supplier: string;
  amount: number;
  status: string;
  date: string;
  items: number;
}

async function getBuyerOrders(): Promise<Order[]> {
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

  return data.data.map((order: any) => ({
    id: order.orderNumber,

    supplier: order.supplier?.name || "Unknown Supplier",

    amount: Number(order.amount) || 0,

    status:
      order.status === "pending"
        ? "Processing"
        : order.status === "processing"
          ? "Processing"
          : order.status === "shipped"
            ? "In Transit"
            : order.status === "delivered"
              ? "Delivered"
              : order.status,

    date: new Date(order.createdAt).toLocaleDateString(),

    items: order.rfq?.quantity || 0,
  }));
}

const STATUS_BADGE: Record<
  string,
  "success" | "default" | "warning" | "danger" | "info"
> = {
  Delivered: "success",
  "In Transit": "info",
  Processing: "warning",
  Cancelled: "danger",
};

function handleViewDetails(orderId: string) {
  alert(`Opening order details: ${orderId}`);
}

function handleDownloadInvoice(orderId: string) {
  alert(`Downloading invoice: ${orderId}`);
}

function handleTrackOrder(orderId: string) {
  alert(`Tracking order: ${orderId}`);
}

function handleReorder(orderId: string) {
  alert(`Creating reorder for: ${orderId}`);
}

export default function BuyerOrders() {
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["buyer-orders"],
    queryFn: getBuyerOrders,
  });

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesQuery =
        query.trim() === "" ||
        order.id.toLowerCase().includes(query.toLowerCase()) ||
        order.supplier.toLowerCase().includes(query.toLowerCase());

      const matchesStatus = status === "all" || order.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [orders, query, status]);

  const totalSpend = orders.reduce((sum, order) => sum + order.amount, 0);

  const inTransit = orders.filter(
    (order) => order.status === "In Transit",
  ).length;

  const processing = orders.filter(
    (order) => order.status === "Processing",
  ).length;

  const stats = [
    {
      label: "Total orders",
      value: orders.length,
      icon: ClipboardList,
    },
    {
      label: "Total spend",
      value: `$${totalSpend.toLocaleString()}`,
      icon: Wallet,
    },
    {
      label: "In transit",
      value: inTransit,
      icon: Truck,
    },
    {
      label: "Processing",
      value: processing,
      icon: PackageSearch,
    },
  ];

  if (isLoading) {
    return <div className="p-10 text-center">Loading orders...</div>;
  }

  if (isError) {
    return (
      <Card className="p-10 text-center text-red-500">
        {(error as Error).message}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>

        <p className="text-slate-600 mt-1">Track and manage your purchases</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex justify-between">
              <p className="text-sm text-slate-500">{stat.label}</p>

              <stat.icon className="w-4 h-4 text-slate-400" />
            </div>

            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <Input
            placeholder="Search order ID or supplier"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>

            <SelectItem value="Delivered">Delivered</SelectItem>

            <SelectItem value="In Transit">In Transit</SelectItem>

            <SelectItem value="Processing">Processing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <PackageSearch className="mx-auto w-10 h-10 text-slate-300" />

            <p className="mt-3 font-medium">No orders found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                {[
                  "Order ID",
                  "Supplier",
                  "Amount",
                  "Items",
                  "Status",
                  "Date",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="text-left px-4 py-4">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-4 font-semibold">{order.id}</td>

                  <td className="px-4 py-4">{order.supplier}</td>

                  <td className="px-4 py-4 font-medium">
                    ${order.amount.toLocaleString()}
                  </td>

                  <td className="px-4 py-4">{order.items} units</td>

                  <td className="px-4 py-4">
                    <Badge variant={STATUS_BADGE[order.status]}>
                      {order.status}
                    </Badge>
                  </td>

                  <td className="px-4 py-4">{order.date}</td>

                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleViewDetails(order.id)}>
                        <Eye className="w-4 h-4" />
                      </button>

                      <button onClick={() => handleDownloadInvoice(order.id)}>
                        <Download className="w-4 h-4" />
                      </button>

                      {order.status !== "Delivered" ? (
                        <button onClick={() => handleTrackOrder(order.id)}>
                          <Truck className="w-4 h-4 text-blue-600" />
                        </button>
                      ) : (
                        <button onClick={() => handleReorder(order.id)}>
                          <RotateCcw className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
