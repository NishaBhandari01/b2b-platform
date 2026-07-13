"use client";

import { useState, type ElementType, type ReactNode } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Globe2,
  FileCheck2,
  Star,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
  Building2,
  Truck,
  CreditCard,
  Headset,
  BarChart3,
  FileText,
  Target,
  Users,
  Package,
  Award,
  Sparkles,
  Quote,
  Calendar,
  ArrowUpRight,
  Factory,
  Wrench,
  Tractor,
  Sofa,
  Stethoscope,
  UtensilsCrossed,
  Car,
  Cpu,
  Box,
  Zap,
  Plug,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ------------------------------------------------------------------ */
/*  Shared types & mock data                                           */
/* ------------------------------------------------------------------ */

interface Category {
  name: string;
  icon: ElementType;
  image: string;
  products: string;
  suppliers: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  supplier: string;
  verified: boolean;
  rating: number;
  reviews: number;
  moq: string;
  price: string;
  country: string;
  image: string;
}

interface Supplier {
  name: string;
  country: string;
  years: number;
  products: number;
  responseRate: number;
  gold: boolean;
  iso: boolean;
  logo: string;
}

const POPULAR_SEARCHES = [
  "Steel",
  "Machinery",
  "Electronics",
  "Agriculture",
  "Furniture",
  "Construction",
];

const TRUSTED_COMPANIES = [
  "Samsung",
  "Bosch",
  "LG",
  "Nestlé",
  "Siemens",
  "Tata",
  "Mahindra",
  "Toyota",
];

const STATS = [
  { value: "2M+", label: "Products", icon: Package },
  { value: "50K+", label: "Suppliers", icon: Building2 },
  { value: "180+", label: "Countries", icon: Globe2 },
  { value: "350K+", label: "Monthly RFQs", icon: FileText },
  { value: "95%", label: "Buyer Satisfaction", icon: Star },
];

const CATEGORIES: Category[] = [
  {
    name: "Construction",
    icon: Building2,
    image: "https://picsum.photos/seed/cat-construction/480/360",
    products: "182,400",
    suppliers: "6,120",
  },
  {
    name: "Electrical",
    icon: Zap,
    image: "https://picsum.photos/seed/cat-electrical/480/360",
    products: "94,200",
    suppliers: "3,410",
  },
  {
    name: "Machinery",
    icon: Factory,
    image: "https://picsum.photos/seed/cat-machinery/480/360",
    products: "156,800",
    suppliers: "5,290",
  },
  {
    name: "Furniture",
    icon: Sofa,
    image: "https://picsum.photos/seed/cat-furniture/480/360",
    products: "68,500",
    suppliers: "2,830",
  },
  {
    name: "Agriculture",
    icon: Tractor,
    image: "https://picsum.photos/seed/cat-agri/480/360",
    products: "77,900",
    suppliers: "3,110",
  },
  {
    name: "Medical",
    icon: Stethoscope,
    image: "https://picsum.photos/seed/cat-medical/480/360",
    products: "52,300",
    suppliers: "1,940",
  },
  {
    name: "Food",
    icon: UtensilsCrossed,
    image: "https://picsum.photos/seed/cat-food/480/360",
    products: "121,700",
    suppliers: "4,560",
  },
  {
    name: "Automotive",
    icon: Car,
    image: "https://picsum.photos/seed/cat-auto/480/360",
    products: "143,900",
    suppliers: "4,980",
  },
  {
    name: "Electronics",
    icon: Cpu,
    image: "https://picsum.photos/seed/cat-electronics/480/360",
    products: "210,600",
    suppliers: "7,340",
  },
  {
    name: "Packaging",
    icon: Box,
    image: "https://picsum.photos/seed/cat-packaging/480/360",
    products: "63,100",
    suppliers: "2,410",
  },
];

const FEATURED_PRODUCTS: Product[] = [
  {
    id: "P-01",
    name: "Galvanized Steel I-Beams",
    category: "Steel & Metal",
    supplier: "Ahmedabad Steelworks",
    verified: true,
    rating: 4.8,
    reviews: 96,
    moq: "5 tons",
    price: "$620 – $840 / ton",
    country: "India",
    image: "https://picsum.photos/seed/prod-beam/480/380",
  },
  {
    id: "P-02",
    name: "3-Phase Induction Motors",
    category: "Electrical",
    supplier: "Volt Dynamics Pvt Ltd",
    verified: true,
    rating: 4.7,
    reviews: 61,
    moq: "10 units",
    price: "$310 – $1,450 / unit",
    country: "India",
    image: "https://picsum.photos/seed/prod-motor/480/380",
  },
  {
    id: "P-03",
    name: "CNC Precision Lathe Machine",
    category: "Machinery",
    supplier: "Meridian Machine Tools",
    verified: true,
    rating: 4.9,
    reviews: 34,
    moq: "1 unit",
    price: "$8,200 – $14,500",
    country: "Germany",
    image: "https://picsum.photos/seed/prod-cnc/480/380",
  },
  {
    id: "P-04",
    name: "Modular Office Workstations",
    category: "Furniture",
    supplier: "Formline Interiors",
    verified: false,
    rating: 4.4,
    reviews: 27,
    moq: "20 units",
    price: "$145 – $310 / unit",
    country: "Vietnam",
    image: "https://picsum.photos/seed/prod-desk/480/380",
  },
  {
    id: "P-05",
    name: "Solar Water Pump System",
    category: "Agriculture",
    supplier: "GreenField AgriTech",
    verified: true,
    rating: 4.6,
    reviews: 45,
    moq: "5 units",
    price: "$480 – $920 / unit",
    country: "India",
    image: "https://picsum.photos/seed/prod-solarpump/480/380",
  },
  {
    id: "P-06",
    name: "Surgical Grade Stainless Trays",
    category: "Medical",
    supplier: "MedSteel Instruments",
    verified: true,
    rating: 4.8,
    reviews: 52,
    moq: "100 units",
    price: "$6.50 – $12 / unit",
    country: "Pakistan",
    image: "https://picsum.photos/seed/prod-tray/480/380",
  },
  {
    id: "P-07",
    name: "Corrugated Shipping Cartons",
    category: "Packaging",
    supplier: "PackRight Industries",
    verified: true,
    rating: 4.5,
    reviews: 88,
    moq: "2,000 pieces",
    price: "$0.22 – $0.48 / piece",
    country: "China",
    image: "https://picsum.photos/seed/prod-carton/480/380",
  },
  {
    id: "P-08",
    name: 'Automotive Alloy Wheels 18"',
    category: "Automotive",
    supplier: "Apex Alloy Wheels",
    verified: true,
    rating: 4.7,
    reviews: 39,
    moq: "50 units",
    price: "$62 – $110 / unit",
    country: "South Korea",
    image: "https://picsum.photos/seed/prod-wheel/480/380",
  },
];

const LATEST_PRODUCTS: Product[] = [
  {
    id: "L-01",
    name: "Industrial Grade Conveyor Belts",
    category: "Machinery",
    supplier: "Beltline Systems",
    verified: true,
    rating: 4.6,
    reviews: 22,
    moq: "50 meters",
    price: "$4.10 / meter",
    country: "India",
    image: "https://picsum.photos/seed/prod-conveyor/480/380",
  },
  {
    id: "L-02",
    name: "LED High Bay Warehouse Lights",
    category: "Electrical",
    supplier: "Luminex Co.",
    verified: true,
    rating: 4.7,
    reviews: 31,
    moq: "100 units",
    price: "$18 – $34 / unit",
    country: "China",
    image: "https://picsum.photos/seed/prod-led/480/380",
  },
  {
    id: "L-03",
    name: "Commercial Kitchen Exhaust Hood",
    category: "Food",
    supplier: "Culinox Equipment",
    verified: false,
    rating: 4.3,
    reviews: 14,
    moq: "5 units",
    price: "$390 – $760 / unit",
    country: "Turkey",
    image: "https://picsum.photos/seed/prod-hood/480/380",
  },
  {
    id: "L-04",
    name: "Hydraulic Pallet Jack 2.5T",
    category: "Machinery",
    supplier: "LiftPro Equipment",
    verified: true,
    rating: 4.5,
    reviews: 47,
    moq: "10 units",
    price: "$95 – $140 / unit",
    country: "India",
    image: "https://picsum.photos/seed/prod-palletjack/480/380",
  },
  {
    id: "L-05",
    name: "Woven Polypropylene Bags",
    category: "Packaging",
    supplier: "SackTech Global",
    verified: true,
    rating: 4.4,
    reviews: 63,
    moq: "5,000 pieces",
    price: "$0.09 / piece",
    country: "Bangladesh",
    image: "https://picsum.photos/seed/prod-bags/480/380",
  },
  {
    id: "L-06",
    name: "Rotary Tiller Farm Attachment",
    category: "Agriculture",
    supplier: "GreenField AgriTech",
    verified: true,
    rating: 4.6,
    reviews: 19,
    moq: "5 units",
    price: "$680 – $1,120",
    country: "India",
    image: "https://picsum.photos/seed/prod-tiller/480/380",
  },
];

const SUPPLIERS: Supplier[] = [
  {
    name: "Ahmedabad Steelworks",
    country: "India",
    years: 18,
    products: 340,
    responseRate: 96,
    gold: true,
    iso: true,
    logo: "AS",
  },
  {
    name: "Meridian Machine Tools",
    country: "Germany",
    years: 24,
    products: 128,
    responseRate: 98,
    gold: true,
    iso: true,
    logo: "MM",
  },
  {
    name: "PackRight Industries",
    country: "China",
    years: 12,
    products: 512,
    responseRate: 91,
    gold: true,
    iso: false,
    logo: "PR",
  },
  {
    name: "GreenField AgriTech",
    country: "India",
    years: 9,
    products: 96,
    responseRate: 89,
    gold: false,
    iso: true,
    logo: "GA",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Register",
    desc: "Create a free buyer or supplier account in under two minutes.",
    icon: Users,
  },
  {
    step: "02",
    title: "Browse Products",
    desc: "Explore millions of listings across 10,000+ verified categories.",
    icon: Search,
  },
  {
    step: "03",
    title: "Send RFQ",
    desc: "Describe what you need and post a request for quotation.",
    icon: FileText,
  },
  {
    step: "04",
    title: "Receive Quotations",
    desc: "Compare offers from multiple suppliers within hours.",
    icon: Target,
  },
  {
    step: "05",
    title: "Choose Supplier",
    desc: "Review credentials, ratings, and certifications before deciding.",
    icon: ShieldCheck,
  },
  {
    step: "06",
    title: "Place Order",
    desc: "Finalize terms and complete the transaction with trade assurance.",
    icon: CheckCircle2,
  },
];

const WHY_CHOOSE_US = [
  {
    title: "Verified Suppliers",
    desc: "Every gold supplier passes a multi-point identity and business verification.",
    icon: ShieldCheck,
  },
  {
    title: "Trade Assurance",
    desc: "Order protection covering payment terms and product quality.",
    icon: FileCheck2,
  },
  {
    title: "Secure Payments",
    desc: "Escrow-backed transactions across 40+ currencies and gateways.",
    icon: CreditCard,
  },
  {
    title: "Global Shipping",
    desc: "Freight partners covering ocean, air, and cross-border trucking.",
    icon: Truck,
  },
  {
    title: "24/7 Support",
    desc: "Dedicated trade specialists available around the clock.",
    icon: Headset,
  },
  {
    title: "Analytics Dashboard",
    desc: "Track views, RFQs, and conversion across your entire catalog.",
    icon: BarChart3,
  },
  {
    title: "RFQ Management",
    desc: "Centralize incoming quote requests with automated routing.",
    icon: FileText,
  },
  {
    title: "Lead Generation",
    desc: "Get discovered by buyers actively sourcing in your category.",
    icon: Target,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We sourced three new steel suppliers within a week of posting our first RFQ. The verification badges made shortlisting painless.",
    name: "Priya Nair",
    role: "Head of Procurement, Vantage Infra",
    company: "https://picsum.photos/seed/company-1/120/120",
    avatar: "https://picsum.photos/seed/avatar-1/120/120",
    rating: 5,
  },
  {
    quote:
      "Our export volume doubled after switching our listings to the platform. The RFQ dashboard alone is worth the subscription.",
    name: "Marcus Weber",
    role: "Export Director, Meridian Machine Tools",
    company: "https://picsum.photos/seed/company-2/120/120",
    avatar: "https://picsum.photos/seed/avatar-2/120/120",
    rating: 5,
  },
  {
    quote:
      "Trade assurance gave our finance team the confidence to work with a first-time overseas supplier. Zero disputes so far.",
    name: "Aiko Tanaka",
    role: "COO, Tanaka Precision Parts",
    company: "https://picsum.photos/seed/company-3/120/120",
    avatar: "https://picsum.photos/seed/avatar-3/120/120",
    rating: 4,
  },
];

const NEWS = [
  {
    category: "Trade Policy",
    title:
      "Cross-border tariff shifts: what B2B exporters need to know in 2026",
    date: "Jul 2, 2026",
    image: "https://picsum.photos/seed/news-1/480/300",
  },
  {
    category: "Supply Chain",
    title: "How mid-size manufacturers are diversifying supplier networks",
    date: "Jun 24, 2026",
    image: "https://picsum.photos/seed/news-2/480/300",
  },
  {
    category: "Sourcing",
    title:
      "Inside the rise of verified-supplier marketplaces in industrial trade",
    date: "Jun 15, 2026",
    image: "https://picsum.photos/seed/news-3/480/300",
  },
];

const FAQS = [
  {
    q: "How do I know a supplier is legitimate?",
    a: "Every Gold Supplier completes business license verification, on-site or video audits, and ongoing performance monitoring before earning a verified badge.",
  },
  {
    q: "Is posting an RFQ free?",
    a: "Yes. Buyers can post unlimited RFQs at no cost and receive quotations from matched suppliers, typically within 24 hours.",
  },
  {
    q: "What does Trade Assurance cover?",
    a: "It protects your payment and covers agreed order terms — quality, quantity, and shipping timelines — for eligible transactions.",
  },
  {
    q: "Can I sell internationally as a new supplier?",
    a: "Yes. Once your storefront passes verification, your listings are indexed for buyers across all 180+ supported countries.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support wire transfer, major credit cards, and escrow-backed trade financing across 40+ currencies.",
  },
];

const PRICING = [
  {
    name: "Basic",
    price: "$0",
    period: "/month",
    desc: "For buyers exploring the marketplace.",
    features: [
      "Unlimited product browsing",
      "5 RFQs per month",
      "Standard support",
      "Basic company profile",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    desc: "For growing suppliers and active buyers.",
    features: [
      "Unlimited RFQs",
      "Verified Supplier badge",
      "Priority placement in search",
      "Analytics dashboard",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large manufacturers and trading houses.",
    features: [
      "Dedicated account manager",
      "Gold Supplier + ISO showcase",
      "API access & bulk catalog tools",
      "Custom trade assurance limits",
      "24/7 white-glove support",
    ],
    highlighted: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Small shared components                                            */
/* ------------------------------------------------------------------ */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-100">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function VerifiedBadge({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-blue-50 font-semibold text-blue-700 ring-1 ring-inset ring-blue-100 ${
        small ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]"
      }`}
    >
      <ShieldCheck className={small ? "h-2.5 w-2.5" : "h-3 w-3"} />
      Verified
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex w-[290px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.18)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.verified && (
          <div className="absolute left-3 top-3">
            <VerifiedBadge />
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
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-600">
          {product.category}
        </p>
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900">
          {product.name}
        </h3>
        <p className="text-[13px] text-slate-500">{product.supplier}</p>
        <div className="flex items-center gap-1 text-[12px] text-slate-400">
          <MapPin className="h-3.5 w-3.5" />
          {product.country}
        </div>
        <div className="mt-1 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Price
            </p>
            <p className="text-[14px] font-bold tabular-nums text-slate-900">
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
        <div className="mt-2 flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 flex-1 bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Request Quote
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 flex-1 border-slate-200 text-xs font-semibold text-slate-600"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-emerald-100/60 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-24 top-40 h-[420px] w-[420px] rounded-full bg-blue-100/60 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        {/* Left */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Trusted by 10,000+ companies worldwide
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
            Connecting Businesses{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-slate-500">
            Source verified suppliers, request quotations, and manage global
            trade — all from one enterprise-grade B2B marketplace built for
            procurement teams.
          </p>

          {/* Search */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/5">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search products, suppliers, or categories..."
                  className="h-12 border-none pl-10 text-sm shadow-none focus-visible:ring-0"
                />
              </div>
              <Button className="h-12 shrink-0 gap-1.5 bg-emerald-600 px-6 text-sm font-semibold text-white hover:bg-emerald-700">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px]">
            <span className="text-slate-400">Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {term}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button className="h-11 gap-1.5 bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800">
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-11 gap-1.5 border-slate-200 px-5 text-sm font-semibold text-slate-700"
            >
              Become a Supplier
            </Button>
          </div>
        </div>

        {/* Right — dashboard mockup with floating cards */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600" />
                <span className="text-sm font-semibold text-slate-800">
                  Trade Dashboard
                </span>
              </div>
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-300" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-400">Active RFQs</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">
                  1,284
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-400">Global Reach</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">
                  180+
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {[62, 88, 45, 74].map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                      style={{ width: `${w}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] tabular-nums text-slate-400">
                    {w}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating cards */}
          <div className="absolute -left-8 top-6 hidden animate-[float_5s_ease-in-out_infinite] rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-lg sm:flex sm:items-center sm:gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-800">
                Verified Supplier
              </p>
              <p className="text-[10px] text-slate-400">ISO 9001 Certified</p>
            </div>
          </div>

          <div className="absolute -right-6 top-1/2 hidden animate-[float_6s_ease-in-out_infinite_0.5s] rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-lg sm:flex sm:items-center sm:gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
              <FileCheck2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-800">
                RFQ Sent
              </p>
              <p className="text-[10px] text-slate-400">3 quotes received</p>
            </div>
          </div>

          <div className="absolute -bottom-6 left-1/4 hidden animate-[float_5.5s_ease-in-out_infinite_1s] rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-lg sm:flex sm:items-center sm:gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
              <Globe2 className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-800">
                Global Trade
              </p>
              <p className="text-[10px] text-slate-400">180+ countries</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Trusted by                                                          */
/* ------------------------------------------------------------------ */

function TrustedBy() {
  return (
    <section className="border-y border-slate-100 bg-slate-50/60 py-10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[13px] font-medium uppercase tracking-wide text-slate-400">
          Trusted by 10,000+ companies worldwide
        </p>
        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
          {TRUSTED_COMPANIES.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center text-lg font-bold tracking-tight text-slate-300 transition-colors hover:text-slate-500"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Statistics                                                         */
/* ------------------------------------------------------------------ */

function Statistics() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <s.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="mt-4 text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-[13px] font-medium text-slate-500">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Categories                                                          */
/* ------------------------------------------------------------------ */

function Categories() {
  return (
    <section className="bg-slate-50/60 py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Categories"
            title="Popular categories"
            subtitle="Explore millions of listings across industrial, commercial, and consumer sourcing categories."
          />
          <Button
            variant="outline"
            className="gap-1.5 border-slate-200 text-slate-700"
          >
            View all categories
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur">
                  <cat.icon className="h-4 w-4 text-emerald-700" />
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-sm font-semibold text-white">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-white/70">
                    {cat.products} products · {cat.suppliers} suppliers
                  </p>
                </div>
              </div>
              <button className="flex w-full items-center justify-center gap-1 py-2.5 text-[12px] font-semibold text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700">
                Browse
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Featured Products                                                   */
/* ------------------------------------------------------------------ */

function FeaturedProducts() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Marketplace"
            title="Featured products"
            subtitle="Hand-picked listings from top-performing verified suppliers across the network."
          />
          <Button
            variant="outline"
            className="gap-1.5 border-slate-200 text-slate-700"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Top Verified Suppliers                                              */
/* ------------------------------------------------------------------ */

function TopSuppliers() {
  return (
    <section className="bg-slate-50/60 py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Suppliers"
          title="Top verified suppliers"
          subtitle="Companies that have passed identity verification, quality audits, and consistent performance review."
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SUPPLIERS.map((s) => (
            <div
              key={s.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 text-sm font-bold text-white">
                  {s.logo}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-slate-900">
                    {s.name}
                  </h3>
                  <p className="flex items-center gap-1 text-[12px] text-slate-400">
                    <MapPin className="h-3 w-3" />
                    {s.country} · {s.years} yrs
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <VerifiedBadge small />
                {s.gold && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-100">
                    <Award className="h-2.5 w-2.5" />
                    Gold Supplier
                  </span>
                )}
                {s.iso && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                    <FileCheck2 className="h-2.5 w-2.5" />
                    ISO Certified
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Products
                  </p>
                  <p className="text-sm font-semibold tabular-nums text-slate-800">
                    {s.products}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Response Rate
                  </p>
                  <p className="text-sm font-semibold tabular-nums text-emerald-600">
                    {s.responseRate}%
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 flex-1 border-slate-200 text-xs font-semibold text-slate-600"
                >
                  View Company
                </Button>
                <Button
                  size="sm"
                  className="h-8 flex-1 bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Contact
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How It Works                                                        */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Process"
          title="How it works"
          subtitle="From registration to delivery — six steps designed to move procurement forward fast."
          align="center"
        />

        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-slate-200 lg:block" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-white shadow-md">
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="mt-3 text-[11px] font-bold tracking-wide text-emerald-600">
                  STEP {step.step}
                </span>
                <h3 className="mt-1 text-sm font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Why Choose Us                                                       */
/* ------------------------------------------------------------------ */

function WhyChooseUs() {
  return (
    <section className="bg-slate-50/60 py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Platform"
          title="Why choose us"
          subtitle="Everything a modern procurement or sales team needs to trade with confidence."
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50">
                <f.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                {f.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  RFQ Banner                                                          */
/* ------------------------------------------------------------------ */

function RfqBanner() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-14 sm:px-14">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
          />
          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-emerald-300">
                <FileText className="h-3.5 w-3.5" />
                Request for Quotation
              </span>
              <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                Need custom products? Post your RFQ.
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
                Receive quotations from multiple verified suppliers within
                hours, and compare pricing, MOQ, and lead times side by side.
              </p>
            </div>
            <Button className="h-12 shrink-0 gap-1.5 bg-emerald-500 px-6 text-sm font-semibold text-white hover:bg-emerald-400">
              Post RFQ
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Success Stories                                                     */
/* ------------------------------------------------------------------ */

function SuccessStories() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Success stories"
          subtitle="Procurement and sales teams that scaled global trade through the platform."
          align="center"
        />

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <Quote className="h-6 w-6 text-emerald-200" />
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-slate-600">
                {t.quote}
              </p>
              <div className="mt-5 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < t.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-slate-900">
                    {t.name}
                  </p>
                  <p className="truncate text-[12px] text-slate-400">
                    {t.role}
                  </p>
                </div>
                <img
                  src={t.company}
                  alt=""
                  className="ml-auto h-8 w-8 rounded-lg object-cover opacity-70"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Latest Products (carousel)                                          */
/* ------------------------------------------------------------------ */

function LatestProducts() {
  const [offset, setOffset] = useState(0);
  const maxOffset = Math.max(0, LATEST_PRODUCTS.length - 4);

  return (
    <section className="bg-slate-50/60 py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Just listed"
            title="Latest products"
            subtitle="Freshly listed products from suppliers actively expanding their catalog."
          />
          <div className="flex gap-2">
            <button
              onClick={() => setOffset((o) => Math.max(0, o - 1))}
              disabled={offset === 0}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))}
              disabled={offset === maxOffset}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-10 overflow-hidden">
          <div
            className="flex gap-5 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${offset * (290 + 20)}px)` }}
          >
            {LATEST_PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  News                                                                 */
/* ------------------------------------------------------------------ */

function News() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Insights"
          title="Latest industry news"
          subtitle="Sourcing trends, trade policy, and supply chain analysis from our editorial desk."
        />

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {NEWS.map((n) => (
            <article
              key={n.title}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={n.image}
                  alt={n.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
                  {n.category}
                </span>
                <h3 className="mt-2 text-[15px] font-semibold leading-snug text-slate-900">
                  {n.title}
                </h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[12px] text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {n.date}
                  </span>
                  <Link
                    href="#"
                    className="flex items-center gap-1 text-[12px] font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Read more
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  World map                                                           */
/* ------------------------------------------------------------------ */

function WorldMapSection() {
  const points = [
    { top: "28%", left: "18%" },
    { top: "22%", left: "48%" },
    { top: "38%", left: "52%" },
    { top: "55%", left: "22%" },
    { top: "62%", left: "72%" },
    { top: "35%", left: "80%" },
    { top: "48%", left: "60%" },
  ];

  return (
    <section className="bg-slate-900 py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-emerald-300">
              <Globe2 className="h-3.5 w-3.5" />
              Global network
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              Trade across 180+ countries
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-slate-300">
              A worldwide network of verified suppliers and active buyers,
              connected through real-time RFQs and cross-border logistics
              partners.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xl font-bold tabular-nums text-white">
                  180+
                </p>
                <p className="text-[12px] text-slate-400">Countries</p>
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums text-white">
                  50K+
                </p>
                <p className="text-[12px] text-slate-400">Global suppliers</p>
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums text-white">
                  1.2M+
                </p>
                <p className="text-[12px] text-slate-400">Worldwide buyers</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-slate-800/60">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />
            {points.map((p, i) => (
              <span
                key={i}
                className="absolute flex h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ top: p.top, left: p.left }}
              >
                <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400/60" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                  */
/* ------------------------------------------------------------------ */

function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Everything you need to know about sourcing, verification, and trade protection."
          align="center"
        />

        <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {FAQS.map((item, i) => (
            <div key={item.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-[14px] font-semibold text-slate-800">
                  {item.q}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  open === i
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-[13px] leading-relaxed text-slate-500">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing                                                              */
/* ------------------------------------------------------------------ */

function Pricing() {
  return (
    <section className="bg-slate-50/60 py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Plans for every stage of trade"
          subtitle="Start free as a buyer, or scale your storefront as a growing supplier."
          align="center"
        />

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
          {PRICING.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-7 ${
                tier.highlighted
                  ? "border-emerald-500 bg-slate-900 text-white shadow-xl shadow-emerald-900/10 lg:-translate-y-3"
                  : "border-slate-200 bg-white shadow-sm"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3
                className={`text-sm font-semibold ${tier.highlighted ? "text-emerald-300" : "text-slate-500"}`}
              >
                {tier.name}
              </h3>
              <div className="mt-2 flex items-end gap-1">
                <span
                  className={`text-3xl font-bold tabular-nums ${tier.highlighted ? "text-white" : "text-slate-900"}`}
                >
                  {tier.price}
                </span>
                <span
                  className={`pb-1 text-sm ${tier.highlighted ? "text-slate-400" : "text-slate-400"}`}
                >
                  {tier.period}
                </span>
              </div>
              <p
                className={`mt-2 text-[13px] ${tier.highlighted ? "text-slate-300" : "text-slate-500"}`}
              >
                {tier.desc}
              </p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px]">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        tier.highlighted
                          ? "text-emerald-400"
                          : "text-emerald-600"
                      }`}
                    />
                    <span
                      className={
                        tier.highlighted ? "text-slate-200" : "text-slate-600"
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`mt-7 h-11 w-full text-sm font-semibold ${
                  tier.highlighted
                    ? "bg-emerald-500 text-white hover:bg-emerald-400"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {tier.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Final CTA                                                           */
/* ------------------------------------------------------------------ */

function FinalCta() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-blue-700 px-8 py-16 text-center sm:px-16">
          <div
            aria-hidden
            className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />
          <h2 className="relative text-3xl font-bold text-white sm:text-4xl">
            Ready to grow your business?
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-emerald-50">
            Join thousands of verified buyers and suppliers trading globally on
            one platform.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button className="h-12 gap-1.5 bg-white px-6 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
              Register Now
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-12 gap-1.5 border-white/40 bg-transparent px-6 text-sm font-semibold text-white hover:bg-white/10"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <TrustedBy />
      <Statistics />
      <Categories />
      <FeaturedProducts />
      <TopSuppliers />
      <HowItWorks />
      <WhyChooseUs />
      <RfqBanner />
      <SuccessStories />
      <LatestProducts />
      <News />
      <WorldMapSection />
      <Faq />
      <Pricing />
      <FinalCta />
    </main>
  );
}
