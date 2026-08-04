"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  Package,
  PackageCheck,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ============================================================================
// CONFIG
// ============================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ============================================================================
// TYPES
// ============================================================================

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type StatusFilter = "all" | OrderStatus;

interface Buyer {
  _id: string;
  name: string;
  email: string;
}

interface RFQ {
  _id: string;
  title: string;
}

interface Quotation {
  _id: string;
  rfq: RFQ;
}

interface Supplier {
  _id: string;
  name: string;
}

interface Order {
  id: string;
  orderNumber: string;
  buyer: Buyer;
  quotation: Quotation;
  supplier?: Supplier;
  amount: number;
  status: OrderStatus;
  createdAt: string;
}

interface SupplierOrderStats {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// ============================================================================
// API HELPER
// ============================================================================

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(
      errorBody?.message || `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

// ============================================================================
// STATIC CONFIG — STATUS FILTERS, BADGES, ICONS
// ============================================================================

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const UPDATABLE_STATUSES: OrderStatus[] = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_BADGE_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  shipped: "bg-orange-50 text-orange-700 border-orange-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

interface StatCardConfig {
  key: keyof SupplierOrderStats;
  label: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const STAT_CARDS: StatCardConfig[] = [
  {
    key: "total",
    label: "Total Orders",
    icon: Package,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: CheckCircle2,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    key: "processing",
    label: "Processing",
    icon: RefreshCw,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    key: "shipped",
    label: "Shipped",
    icon: Truck,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: PackageCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
];

// ============================================================================
// FORMATTERS
// ============================================================================

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function formatAmount(amount: number): string {
  return currencyFormatter.format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

// ============================================================================
// DATA HOOKS
// ============================================================================

function useSupplierOrderStats() {
  return useQuery<SupplierOrderStats, Error>({
    queryKey: ["supplier-order-stats"],
    queryFn: async () => {
      const res = await request<ApiResponse<SupplierOrderStats>>(
        "/api/orders/supplier/stats",
      );
      return res.data;
    },
  });
}

function useSupplierOrders(status: StatusFilter) {
  return useQuery<Order[], Error>({
    queryKey: ["supplier-orders", status],
    queryFn: async () => {
      const query = status !== "all" ? `?status=${status}` : "";
      const res = await request<ApiResponse<Order[]>>(
        `/api/orders/supplier${query}`,
      );
      return res.data;
    },
  });
}

function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, { orderId: string; status: OrderStatus }>({
    mutationFn: async ({ orderId, status }) => {
      const res = await request<ApiResponse<Order>>(
        `/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-orders"] });
      queryClient.invalidateQueries({ queryKey: ["supplier-order-stats"] });
      toast.success("Order status updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order status");
    },
  });
}

// ============================================================================
// SMALL PRESENTATIONAL PIECES
// ============================================================================

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium capitalize", STATUS_BADGE_STYLES[status])}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {Array.from({ length: 7 }).map((_, i) => (
        <Card key={i} className="border-slate-200">
          <CardContent className="flex items-center gap-3 p-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <Package className="h-8 w-8 text-slate-400" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-900">
          No orders received yet
        </p>
        <p className="text-sm text-slate-500">
          New orders from buyers will show up here once they come in.
        </p>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <AlertCircle className="h-7 w-7 text-red-500" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-900">
          Couldn&apos;t load orders
        </p>
        <p className="text-sm text-slate-500">
          Something went wrong while fetching your orders.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function SupplierOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | "">("");

  const statsQuery = useSupplierOrderStats();
  const ordersQuery = useSupplierOrders(statusFilter);
  const updateStatusMutation = useUpdateOrderStatus();

  const isDialogOpen = selectedOrder !== null;

  const updatableStatusOptions = useMemo(() => {
    if (!selectedOrder) return [];
    // Never allow moving a delivered/cancelled order, and never allow "pending".
    if (
      selectedOrder.status === "delivered" ||
      selectedOrder.status === "cancelled"
    ) {
      return [];
    }
    return UPDATABLE_STATUSES;
  }, [selectedOrder]);

  function openOrderDialog(order: Order) {
    setSelectedOrder(order);
    setPendingStatus("");
  }

  function closeOrderDialog() {
    setSelectedOrder(null);
    setPendingStatus("");
  }

  function handleSaveStatus() {
    if (!selectedOrder || !pendingStatus) return;
    updateStatusMutation.mutate(
      { orderId: selectedOrder.id, status: pendingStatus },
      {
        onSuccess: (updatedOrder) => {
          setSelectedOrder(updatedOrder);
          setPendingStatus("");
        },
      },
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Supplier Orders
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage all customer orders, track fulfillment progress, and update
            order statuses.
          </p>
        </div>

        {/* Statistics */}
        {statsQuery.isLoading ? (
          <StatsGridSkeleton />
        ) : statsQuery.isError ? (
          <Card className="border-slate-200">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                Failed to load statistics
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => statsQuery.refetch()}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : statsQuery.data ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {STAT_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.key}
                  className="border-slate-200 shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        card.iconBg,
                      )}
                    >
                      <Icon className={cn("h-5 w-5", card.iconColor)} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        {card.label}
                      </p>
                      <p className="text-xl font-semibold text-slate-900">
                        {statsQuery.data[card.key]}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : null}

        {/* Filter tabs + Table */}
        <Card className="border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3">
            {STATUS_FILTERS.map((filter) => {
              const isActive = statusFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100",
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <CardContent className="p-0">
            {ordersQuery.isLoading ? (
              <TableSkeleton />
            ) : ordersQuery.isError ? (
              <ErrorState onRetry={() => ordersQuery.refetch()} />
            ) : !ordersQuery.data || ordersQuery.data.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Order Number</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Product / RFQ</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersQuery.data.map((order) => (
                      <TableRow key={order.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium text-slate-900">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                              {getInitial(order.buyer.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-900">
                                {order.buyer.name}
                              </p>
                              <p className="truncate text-xs text-slate-500">
                                {order.buyer.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[220px] truncate text-sm text-slate-700">
                          {order.quotation.rfq.title}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-slate-900">
                          {formatAmount(order.amount)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5"
                              onClick={() => openOrderDialog(order)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => openOrderDialog(order)}
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                              Update
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order details / update dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeOrderDialog();
        }}
      >
        <DialogContent className="sm:max-w-md">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order {selectedOrder.orderNumber}</DialogTitle>
                <DialogDescription>
                  Order details and status management.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <dl className="grid grid-cols-3 gap-y-3 text-sm">
                  <dt className="text-slate-500">Buyer</dt>
                  <dd className="col-span-2 font-medium text-slate-900">
                    {selectedOrder.buyer.name}
                  </dd>

                  <dt className="text-slate-500">Email</dt>
                  <dd className="col-span-2 text-slate-700">
                    {selectedOrder.buyer.email}
                  </dd>

                  <dt className="text-slate-500">RFQ</dt>
                  <dd className="col-span-2 text-slate-700">
                    {selectedOrder.quotation.rfq.title}
                  </dd>

                  <dt className="text-slate-500">Amount</dt>
                  <dd className="col-span-2 font-medium text-slate-900">
                    {formatAmount(selectedOrder.amount)}
                  </dd>

                  <dt className="text-slate-500">Created</dt>
                  <dd className="col-span-2 text-slate-700">
                    {formatDate(selectedOrder.createdAt)}
                  </dd>

                  <dt className="text-slate-500">Status</dt>
                  <dd className="col-span-2">
                    <StatusBadge status={selectedOrder.status} />
                  </dd>

                  {selectedOrder.supplier && (
                    <>
                      <dt className="text-slate-500">Supplier</dt>
                      <dd className="col-span-2 text-slate-700">
                        {selectedOrder.supplier.name}
                      </dd>
                    </>
                  )}
                </dl>

                {updatableStatusOptions.length > 0 && (
                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <label className="text-sm font-medium text-slate-700">
                      Update status
                    </label>
                    <Select
                      value={pendingStatus ?? ""}
                      onValueChange={(value) =>
                        setPendingStatus(value as OrderStatus)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a new status" />
                      </SelectTrigger>
                      <SelectContent>
                        {updatableStatusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeOrderDialog}>
                  Close
                </Button>
                {updatableStatusOptions.length > 0 && (
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={!pendingStatus || updateStatusMutation.isPending}
                    onClick={handleSaveStatus}
                  >
                    {updateStatusMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
