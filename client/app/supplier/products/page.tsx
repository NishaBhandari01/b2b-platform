"use client";

import { useMemo, useState, type ElementType, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyProducts } from "../../../lib/api/product.api";
import type { Product, ProductStatus } from "@/types/product";
import {
  Plus,
  Search,
  ChevronDown,
  Grid3x3,
  List,
  Download,
  CheckSquare,
  Star,
  Eye,
  MessageSquare,
  MousePointerClick,
  MapPin,
  Clock,
  Pencil,
  Copy,
  Share2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Layers,
  PackageSearch,
  Flame,
  BadgeCheck,
  Globe2,
  FileCheck2,
  Boxes,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "All Categories",
  "Steel & Metal",
  "Industrial Components",
  "Electrical Equipment",
  "Fasteners",
];

const STATUSES: ("All Statuses" | ProductStatus)[] = [
  "All Statuses",
  "Active",
  "Draft",
  "Pending Approval",
  "Out of Stock",
];

const SORT_OPTIONS = [
  "Recently Updated",
  "Most Viewed",
  "Most RFQs",
  "Price: Low to High",
  "Price: High to Low",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const statusStyles: Record<ProductStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  Draft: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
  "Pending Approval":
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  "Out of Stock": "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
};

const statusDot: Record<ProductStatus, string> = {
  Active: "bg-emerald-500",
  Draft: "bg-slate-400",
  "Pending Approval": "bg-amber-500",
  "Out of Stock": "bg-rose-500",
};

function formatNumber(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

/* ------------------------------------------------------------------ */
/*  Reusable bits                                                       */
/* ------------------------------------------------------------------ */

function NativeSelect({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3.5 pr-9 text-sm font-medium text-slate-700 shadow-sm outline-none transition-colors hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-slate-100 py-1.5 text-[13px] last:border-none">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium tabular-nums text-slate-700">{value}</span>
    </div>
  );
}

function MetricPill({
  icon: Icon,
  value,
  label,
}: {
  icon: ElementType;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-md py-2">
      <div className="flex items-center gap-1 text-slate-500">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <span className="text-[13px] font-semibold tabular-nums text-slate-800">
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Product Card                                                        */
/* ------------------------------------------------------------------ */

function ProductCard({ product }: { product: Product }) {
  const router = useRouter();

  return (
    // <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.18)]">
    <div
      onClick={() => router.push(`/supplier/products/${product.id}`)}
      className="group cursor-pointer flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={product.image ?? undefined}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[product.status]}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${statusDot[product.status]}`}
            />
            {product.status}
          </span>
        </div>
        {product.featuredTag && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              {product.featuredTag === "Best Seller" && (
                <Flame className="h-3 w-3 text-amber-400" />
              )}
              {product.featuredTag === "Most Viewed" && (
                <Eye className="h-3 w-3 text-blue-400" />
              )}
              {product.featuredTag === "Most RFQs" && (
                <Award className="h-3 w-3 text-emerald-400" />
              )}
              {product.featuredTag}
            </span>
          </div>
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {product.rating}
          <span className="font-normal text-slate-400">
            ({product.reviews})
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-600">
            {product.category}
          </p>
          <h3 className="mt-0.5 text-[15px] font-semibold leading-snug text-slate-900">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
            {product.description}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Price
            </p>
            <p className="text-[15px] font-bold tabular-nums text-slate-900">
              {product.price}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              MOQ
            </p>
            <p className="text-[13px] font-semibold tabular-nums text-slate-700">
              {product.moq}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 px-3 py-1.5">
          <SpecRow label="SKU" value={product.sku} />
          <SpecRow
            label="Stock"
            value={
              product.stock > 0
                ? `${formatNumber(product.stock)} units`
                : "0 units"
            }
          />
          <SpecRow label="Updated" value={product.updatedAt} />
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          {product.location}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-100"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-5 divide-x divide-slate-100 rounded-lg border border-slate-100">
          <MetricPill
            icon={Eye}
            value={formatNumber(product.views)}
            label="Views"
          />
          <MetricPill icon={FileCheck2} value={product.rfqs} label="RFQs" />
          <MetricPill
            icon={MessageSquare}
            value={product.inquiries}
            label="Inquiry"
          />
          <MetricPill
            icon={MousePointerClick}
            value={formatNumber(product.clicks)}
            label="Clicks"
          />
          <MetricPill
            icon={ArrowUpRight}
            value={`${product.conversion}%`}
            label="Conv."
          />
        </div>

        <div className="mt-auto flex items-center gap-2 pt-1">
          <Button
            size="sm"
            className="h-8 flex-1 bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Preview as Buyer
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 border-slate-200 text-slate-500 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 border-slate-200 text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            title="Duplicate"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
            title="Share"
          >
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 border-slate-200 text-slate-500 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  List row                                                            */
/* ------------------------------------------------------------------ */

function ProductRow({ product }: { product: Product }) {
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-slate-300 hover:shadow-md">
      <img
        src={product.image ?? undefined}
        alt={product.name}
        className="h-16 w-20 shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate text-sm font-semibold text-slate-900">
            {product.name}
          </h4>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[product.status]}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${statusDot[product.status]}`}
            />
            {product.status}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-slate-500">
          {product.category} · SKU {product.sku} · {product.location}
        </p>
      </div>
      <div className="hidden shrink-0 text-right md:block">
        <p className="text-sm font-bold tabular-nums text-slate-900">
          {product.price}
        </p>
        <p className="text-xs text-slate-400">MOQ {product.moq}</p>
      </div>
      <div className="hidden shrink-0 items-center gap-4 text-xs text-slate-500 lg:flex">
        <span className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" /> {formatNumber(product.views)}
        </span>
        <span className="flex items-center gap-1">
          <FileCheck2 className="h-3.5 w-3.5" /> {product.rfqs}
        </span>
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{" "}
          {product.rating}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-slate-500 hover:text-emerald-700"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-slate-500 hover:text-blue-700"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-slate-500 hover:text-rose-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading skeletons                                                   */
/* ------------------------------------------------------------------ */

function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="aspect-4/3 w-full bg-slate-100" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-3 w-20 rounded bg-slate-100" />
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-10 w-full rounded-lg bg-slate-100" />
        <div className="h-16 w-full rounded-lg bg-slate-50" />
      </div>
    </div>
  );
}

function ProductRowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 rounded-xl border border-slate-200 bg-white p-3">
      <div className="h-16 w-20 shrink-0 rounded-lg bg-slate-100" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty & error states                                                */
/* ------------------------------------------------------------------ */

function EmptyState() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
        <PackageSearch className="h-8 w-8 text-emerald-600" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">
        No products added yet
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        Add your first product to start receiving RFQs and connect with verified
        buyers worldwide.
      </p>
      <Button
        onClick={() => router.push("/supplier/products/add")}
        className="mt-5 bg-emerald-600 text-white hover:bg-emerald-700"
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Add Product
      </Button>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-rose-50/40 px-6 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50">
        <AlertTriangle className="h-8 w-8 text-rose-500" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">
        Couldn't load your products
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        Something went wrong while fetching your catalog. Check your connection
        and try again.
      </p>
      <Button
        onClick={onRetry}
        variant="outline"
        className="mt-5 gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                             */
/* ------------------------------------------------------------------ */

function SidebarCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ElementType;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-400" />
        <h4 className="text-[13px] font-semibold text-slate-800">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function Sidebar({ products }: { products: Product[] }) {
  const lowStock = products.filter((p) => p.stock === 0).slice(0, 5);
  const pendingApproval = products
    .filter((p) => p.status === "Pending Approval")
    .slice(0, 5);
  const recentlyUpdated = [...products]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 3);
  const mostViewed = products.length
    ? [...products].sort((a, b) => b.views - a.views)[0]
    : null;
  const topPerforming = products.length
    ? [...products].sort((a, b) => b.conversion - a.conversion)[0]
    : null;

  return (
    <aside className="hidden w-80 shrink-0 flex-col gap-4 xl:flex">
      <SidebarCard title="Recently Updated" icon={Clock}>
        {recentlyUpdated.length === 0 ? (
          <p className="text-[13px] text-slate-400">No products yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentlyUpdated.map((p) => (
              <li
                key={p.id}
                className="flex items-start justify-between gap-2 text-[13px]"
              >
                <p className="truncate font-medium text-slate-700">{p.name}</p>
                <span className="whitespace-nowrap text-[11px] text-slate-400">
                  {p.updatedAt}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SidebarCard>

      <SidebarCard title="Low Stock Alerts" icon={AlertTriangle}>
        {lowStock.length === 0 ? (
          <p className="text-[13px] text-slate-400">
            All products are well stocked.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {lowStock.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg bg-rose-50 px-2.5 py-2 text-[13px]"
              >
                <span className="truncate font-medium text-rose-700">
                  {p.name}
                </span>
                <span className="ml-2 whitespace-nowrap text-[11px] font-semibold text-rose-600">
                  0 left
                </span>
              </li>
            ))}
          </ul>
        )}
      </SidebarCard>

      <SidebarCard title="Pending Approval" icon={ShieldCheck}>
        {pendingApproval.length === 0 ? (
          <p className="text-[13px] text-slate-400">Nothing awaiting review.</p>
        ) : (
          <ul className="space-y-2.5">
            {pendingApproval.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg bg-amber-50 px-2.5 py-2 text-[13px]"
              >
                <span className="truncate font-medium text-amber-700">
                  {p.name}
                </span>
                <span className="ml-2 whitespace-nowrap text-[11px] text-amber-600">
                  {p.updatedAt}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SidebarCard>

      {mostViewed && (
        <SidebarCard title="Most Viewed Product" icon={Eye}>
          <div className="flex items-center gap-3">
            <img
              // src={mostViewed.image}
              src={mostViewed.image ?? "/placeholder-product.png"}
              alt={mostViewed.name}
              className="h-12 w-14 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-slate-700">
                {mostViewed.name}
              </p>
              <p className="text-[12px] text-slate-400">
                {formatNumber(mostViewed.views)} views
              </p>
            </div>
          </div>
        </SidebarCard>
      )}

      {topPerforming && (
        <SidebarCard title="Top Performing Product" icon={Award}>
          <div className="flex items-center gap-3">
            <img
              src={topPerforming.image ?? undefined}
              alt={topPerforming.name}
              className="h-12 w-14 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-slate-700">
                {topPerforming.name}
              </p>
              <p className="text-[12px] font-semibold text-emerald-600">
                {topPerforming.conversion}% conversion
              </p>
            </div>
          </div>
        </SidebarCard>
      )}

      <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-4">
        <div className="mb-2 flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-emerald-600" />
          <h4 className="text-[13px] font-semibold text-slate-800">
            Tips to improve visibility
          </h4>
        </div>
        <ul className="space-y-1.5 text-[13px] text-slate-600">
          {[
            "Upload more product images",
            "Add detailed specifications",
            "Keep prices up to date",
            "Add certifications",
            "Complete your company profile",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2">
              <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                           */
/* ------------------------------------------------------------------ */

export default function SupplierProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState<string>("All Statuses");
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const router = useRouter();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["products"],
    queryFn: getMyProducts,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
  });

  const products: Product[] = data?.data ?? [];

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchesSearch =
        search.trim() === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "All Categories" || p.category === category;
      const matchesStatus = status === "All Statuses" || p.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    switch (sort) {
      case "Most Viewed":
        list = [...list].sort((a, b) => b.views - a.views);
        break;
      case "Most RFQs":
        list = [...list].sort((a, b) => b.rfqs - a.rfqs);
        break;
      case "Price: Low to High":
        list = [...list].sort(
          (a, b) =>
            parseFloat(a.price.replace(/[^0-9.]/g, "")) -
            parseFloat(b.price.replace(/[^0-9.]/g, "")),
        );
        break;
      case "Price: High to Low":
        list = [...list].sort(
          (a, b) =>
            parseFloat(b.price.replace(/[^0-9.]/g, "")) -
            parseFloat(a.price.replace(/[^0-9.]/g, "")),
        );
        break;
      default:
        break;
    }
    return list;
  }, [products, search, category, status, sort]);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "Active").length;
  const draftProducts = products.filter((p) => p.status === "Draft").length;
  const categoryCount = new Set(products.map((p) => p.category)).size;
  const featured = products.find((p) => p.featuredTag === "Best Seller");

  const statCards = [
    { label: "Total Products", value: totalProducts, icon: Boxes },
    { label: "Active Products", value: activeProducts, icon: BadgeCheck },
    { label: "Draft Products", value: draftProducts, icon: PackageSearch },
    { label: "Categories", value: categoryCount, icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              My Products
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-500">
              Manage your product catalog and showcase your products to buyers
              around the world.
            </p>
          </div>
          <Button
            onClick={() => router.push("/supplier/products/add")}
            className="h-10 gap-1.5 bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <stat.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="mt-4 text-3xl font-bold tabular-nums text-slate-900">
                {isLoading ? "–" : stat.value}
              </p>
              <p className="mt-0.5 text-[13px] font-medium text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Featured product strip */}
        {featured && (
          <div className="mt-6 flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-900 bg-slate-900 p-5 sm:flex-row sm:items-center">
            <img
              src={featured.image ?? undefined}
              alt={featured.name}
              className="h-24 w-32 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                <Flame className="h-3 w-3" />
                Best Seller
              </span>
              <h3 className="mt-1.5 truncate text-lg font-semibold text-white">
                {featured.name}
              </h3>
              <p className="mt-0.5 text-sm text-slate-400">
                {formatNumber(featured.views)} views · {featured.rfqs} RFQs ·{" "}
                {featured.conversion}% conversion rate
              </p>
            </div>
            <Button className="shrink-0 bg-white text-slate-900 hover:bg-slate-100">
              View Insights
            </Button>
          </div>
        )}

        {/* Filter bar */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name or SKU..."
              className="h-10 border-slate-200 pl-9 text-sm focus-visible:ring-emerald-200"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <NativeSelect
              value={category}
              onChange={setCategory}
              options={CATEGORIES}
              className="w-44"
            />
            <NativeSelect
              value={status}
              onChange={setStatus}
              options={STATUSES}
              className="w-40"
            />
            <NativeSelect
              value={sort}
              onChange={setSort}
              options={SORT_OPTIONS}
              className="w-44"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-slate-200 p-0.5">
              <button
                onClick={() => setView("grid")}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                  view === "grid"
                    ? "bg-slate-900 text-white"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title="Grid view"
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                  view === "list"
                    ? "bg-slate-900 text-white"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-1.5 border-slate-200 text-slate-600"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-1.5 border-slate-200 text-slate-600"
            >
              <CheckSquare className="h-4 w-4" />
              Bulk Actions
            </Button>
            {isFetching && !isLoading && (
              <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
            )}
          </div>
        </div>

        {/* Content: grid + sidebar */}
        <div className="mt-6 flex gap-6">
          <div className="flex-1">
            {isError ? (
              <ErrorState onRetry={() => refetch()} />
            ) : isLoading ? (
              view === "grid" ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ProductRowSkeleton key={i} />
                  ))}
                </div>
              )
            ) : filtered.length === 0 ? (
              <EmptyState />
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((p) => (
                  <ProductRow key={p.id} product={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !isError && filtered.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                      page === n
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(3, p + 1))}
                  className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                  disabled={page === 3}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <Sidebar products={products} />
        </div>
      </div>
    </div>
  );
}
