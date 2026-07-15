"use client";

import { useMemo, useState, type ElementType, type ReactNode } from "react";
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
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  PackageSearch,
  Flame,
  BadgeCheck,
  Globe2,
  FileCheck2,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ProductStatus = "Active" | "Draft" | "Pending Approval" | "Out of Stock";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  status: ProductStatus;
  price: string;
  moq: string;
  sku: string;
  stock: number;
  location: string;
  updatedAt: string;
  rating: number;
  reviews: number;
  views: number;
  rfqs: number;
  inquiries: number;
  clicks: number;
  conversion: number;
  tags: string[];
  featuredTag?: "Best Seller" | "Most Viewed" | "Most RFQs";
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const PRODUCTS: Product[] = [
  {
    id: "PRD-1001",
    name: "Galvanized Steel I-Beams",
    category: "Steel & Metal",
    description:
      "Hot-rolled structural I-beams, corrosion-resistant coating, custom lengths for industrial and commercial construction.",
    image: "https://picsum.photos/seed/steelbeam/640/480",
    status: "Active",
    price: "$620 – $840 / ton",
    moq: "5 tons",
    sku: "GSB-4402",
    stock: 1280,
    location: "Ahmedabad, IN",
    updatedAt: "2 days ago",
    rating: 4.8,
    reviews: 96,
    views: 12400,
    rfqs: 58,
    inquiries: 142,
    clicks: 3210,
    conversion: 4.6,
    tags: ["Steel", "Construction", "Certified", "Export Ready"],
    featuredTag: "Best Seller",
  },
  {
    id: "PRD-1002",
    name: "Industrial Ball Bearings Set",
    category: "Industrial Components",
    description:
      "Precision-machined chrome steel bearings rated for high-load rotary equipment. Sold in bulk cartons.",
    image: "https://picsum.photos/seed/bearings/640/480",
    status: "Active",
    price: "$1.20 – $2.75 / unit",
    moq: "500 units",
    sku: "IBB-7719",
    stock: 42000,
    location: "Coimbatore, IN",
    updatedAt: "6 hours ago",
    rating: 4.6,
    reviews: 71,
    views: 9800,
    rfqs: 34,
    inquiries: 88,
    clicks: 2210,
    conversion: 3.9,
    tags: ["Industrial", "Certified"],
  },
  {
    id: "PRD-1003",
    name: "3-Phase Copper Wound Motors",
    category: "Electrical Equipment",
    description:
      "IE3-efficiency induction motors, 5HP–50HP range, TEFC enclosure, suitable for pumps, compressors and conveyors.",
    image: "https://picsum.photos/seed/motorwind/640/480",
    status: "Pending Approval",
    price: "$310 – $1,450 / unit",
    moq: "10 units",
    sku: "TPM-3355",
    stock: 640,
    location: "Pune, IN",
    updatedAt: "1 day ago",
    rating: 4.7,
    reviews: 54,
    views: 7600,
    rfqs: 61,
    inquiries: 133,
    clicks: 2680,
    conversion: 5.1,
    tags: ["Electrical", "Industrial", "Certified"],
    featuredTag: "Most RFQs",
  },
  {
    id: "PRD-1004",
    name: "PVC Insulated Armoured Cable",
    category: "Electrical Equipment",
    description:
      "Multi-core copper conductor cable, XLPE insulated, armoured for underground and industrial installations.",
    image: "https://picsum.photos/seed/armouredcable/640/480",
    status: "Active",
    price: "$1.85 / meter",
    moq: "1000 meters",
    sku: "PIA-2290",
    stock: 58000,
    location: "Vadodara, IN",
    updatedAt: "3 days ago",
    rating: 4.5,
    reviews: 39,
    views: 15200,
    rfqs: 27,
    inquiries: 76,
    clicks: 4110,
    conversion: 2.8,
    tags: ["Electrical", "Export Ready"],
    featuredTag: "Most Viewed",
  },
  {
    id: "PRD-1005",
    name: "Hex Head Structural Bolts",
    category: "Fasteners",
    description:
      "Grade 8.8 high-tensile hex bolts with matching nuts and washers, zinc-plated for structural steel assembly.",
    image: "https://picsum.photos/seed/hexbolts/640/480",
    status: "Draft",
    price: "$0.08 – $0.32 / piece",
    moq: "10,000 pieces",
    sku: "HSB-6604",
    stock: 0,
    location: "Rajkot, IN",
    updatedAt: "5 days ago",
    rating: 4.3,
    reviews: 21,
    views: 3100,
    rfqs: 9,
    inquiries: 24,
    clicks: 890,
    conversion: 1.9,
    tags: ["Construction", "Steel"],
  },
  {
    id: "PRD-1006",
    name: "Hydraulic Cylinder Assembly",
    category: "Industrial Components",
    description:
      "Double-acting hydraulic cylinders, forged steel body, custom bore and stroke lengths for heavy machinery.",
    image: "https://picsum.photos/seed/hydraulic/640/480",
    status: "Out of Stock",
    price: "$180 – $960 / unit",
    moq: "20 units",
    sku: "HCA-8841",
    stock: 0,
    location: "Faridabad, IN",
    updatedAt: "1 week ago",
    rating: 4.4,
    reviews: 28,
    views: 5400,
    rfqs: 18,
    inquiries: 41,
    clicks: 1240,
    conversion: 2.2,
    tags: ["Industrial", "Certified"],
  },
];

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

const STAT_CARDS = [
  {
    label: "Total Products",
    value: "124",
    trend: "+12 this month",
    up: true,
    icon: Boxes,
  },
  {
    label: "Active Products",
    value: "98",
    trend: "+8 this month",
    up: true,
    icon: BadgeCheck,
  },
  {
    label: "Draft Products",
    value: "14",
    trend: "-3 this month",
    up: false,
    icon: PackageSearch,
  },
  {
    label: "Categories",
    value: "9",
    trend: "+1 this month",
    up: true,
    icon: Layers,
  },
];

const RECENT_UPDATES = [
  { name: "Galvanized Steel I-Beams", action: "Price updated", time: "2h ago" },
  {
    name: "3-Phase Copper Wound Motors",
    action: "Specs edited",
    time: "5h ago",
  },
  {
    name: "PVC Insulated Armoured Cable",
    action: "Image added",
    time: "1d ago",
  },
];

const LOW_STOCK = [
  { name: "Hex Head Structural Bolts", stock: 0 },
  { name: "Hydraulic Cylinder Assembly", stock: 0 },
];

const PENDING_APPROVAL = [
  { name: "3-Phase Copper Wound Motors", submitted: "1 day ago" },
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
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.18)]">
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
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

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
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

        {/* Spec sheet block */}
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

        {/* Tags */}
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

        {/* Performance */}
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
            icon={TrendingUp}
            value={`${product.conversion}%`}
            label="Conv."
          />
        </div>

        {/* Actions */}
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
/*  List row (for list view)                                            */
/* ------------------------------------------------------------------ */

function ProductRow({ product }: { product: Product }) {
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-slate-300 hover:shadow-md">
      <img
        src={product.image}
        alt={product.name}
        className="h-16 w-20 flex-shrink-0 rounded-lg object-cover"
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
/*  Empty state                                                         */
/* ------------------------------------------------------------------ */

function EmptyState() {
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
      <Button className="mt-5 bg-emerald-600 text-white hover:bg-emerald-700">
        <Plus className="mr-1.5 h-4 w-4" />
        Add Product
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

function Sidebar() {
  const mostViewed = [...PRODUCTS].sort((a, b) => b.views - a.views)[0];
  const topPerforming = [...PRODUCTS].sort(
    (a, b) => b.conversion - a.conversion,
  )[0];

  return (
    <aside className="hidden w-80 shrink-0 flex-col gap-4 xl:flex">
      <SidebarCard title="Recent Product Updates" icon={Clock}>
        <ul className="space-y-3">
          {RECENT_UPDATES.map((u) => (
            <li
              key={u.name}
              className="flex items-start justify-between gap-2 text-[13px]"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-700">{u.name}</p>
                <p className="text-[12px] text-slate-400">{u.action}</p>
              </div>
              <span className="whitespace-nowrap text-[11px] text-slate-400">
                {u.time}
              </span>
            </li>
          ))}
        </ul>
      </SidebarCard>

      <SidebarCard title="Low Stock Alerts" icon={AlertTriangle}>
        {LOW_STOCK.length === 0 ? (
          <p className="text-[13px] text-slate-400">
            All products are well stocked.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {LOW_STOCK.map((p) => (
              <li
                key={p.name}
                className="flex items-center justify-between rounded-lg bg-rose-50 px-2.5 py-2 text-[13px]"
              >
                <span className="truncate font-medium text-rose-700">
                  {p.name}
                </span>
                <span className="ml-2 whitespace-nowrap text-[11px] font-semibold text-rose-600">
                  {p.stock} left
                </span>
              </li>
            ))}
          </ul>
        )}
      </SidebarCard>

      <SidebarCard title="Pending Approval" icon={ShieldCheck}>
        {PENDING_APPROVAL.length === 0 ? (
          <p className="text-[13px] text-slate-400">Nothing awaiting review.</p>
        ) : (
          <ul className="space-y-2.5">
            {PENDING_APPROVAL.map((p) => (
              <li
                key={p.name}
                className="flex items-center justify-between rounded-lg bg-amber-50 px-2.5 py-2 text-[13px]"
              >
                <span className="truncate font-medium text-amber-700">
                  {p.name}
                </span>
                <span className="ml-2 whitespace-nowrap text-[11px] text-amber-600">
                  {p.submitted}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SidebarCard>

      <SidebarCard title="Most Viewed Product" icon={Eye}>
        <div className="flex items-center gap-3">
          <img
            src={mostViewed.image}
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

      <SidebarCard title="Top Performing Product" icon={Award}>
        <div className="flex items-center gap-3">
          <img
            src={topPerforming.image}
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

      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4">
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
  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
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
  }, [search, category, status, sort]);

  const featured = PRODUCTS.find((p) => p.featuredTag === "Best Seller");

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
          {STAT_CARDS.map((stat) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <stat.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <span
                  className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    stat.up
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {stat.up ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.trend}
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold tabular-nums text-slate-900">
                {stat.value}
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
              src={featured.image}
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
              onChange={(e: any) => setSearch(e.target.value)}
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
          </div>
        </div>

        {/* Content: grid + sidebar */}
        <div className="mt-6 flex gap-6">
          <div className="flex-1">
            {filtered.length === 0 ? (
              <EmptyState />
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
            {filtered.length > 0 && (
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

          <Sidebar />
        </div>
      </div>
    </div>
  );
}
