// "use client";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, MessageSquare, TrendingUp } from "lucide-react";
// import { LEADS } from "@/lib/utils/mockData";

// export default function SupplierLeadsPage() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Active Leads</h1>
//         <p className="text-muted-foreground mt-2">
//           Monitor incoming buyer interest and follow up quickly to convert
//           prospects.
//         </p>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-2">
//         {LEADS.map((lead) => (
//           <Card key={lead.id} className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
//                   Lead
//                 </p>
//                 <h2 className="mt-1 text-xl font-semibold">{lead.id}</h2>
//               </div>
//               <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
//                 {lead.status}
//               </span>
//             </div>
//             <p className="mt-4 text-sm text-muted-foreground">{lead.notes}</p>
//             <div className="mt-6 flex items-center justify-between text-sm">
//               <div className="flex items-center gap-2 text-muted-foreground">
//                 <TrendingUp className="w-4 h-4" />
//                 High intent buyer
//               </div>
//               <Button variant="outline" className="gap-2">
//                 Follow up <ArrowRight className="w-4 h-4" />
//               </Button>
//             </div>
//           </Card>
//         ))}
//       </div>

//       <Card className="p-6">
//         <div className="flex items-start gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
//             <MessageSquare className="w-5 h-5" />
//           </div>
//           <div>
//             <h2 className="font-semibold">Smart reminders</h2>
//             <p className="mt-1 text-sm text-muted-foreground">
//               Buyer conversations are prioritized automatically so your team
//               never misses a hot lead.
//             </p>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }

// app/(dashboard)/leads/page.tsx
//
// Supplier Leads — Enterprise CRM Dashboard (single-file build)
// Everything custom (types, config, mock data, badges, cards, filter bar,
// table, kanban, states, and the page itself) lives in this one file.
// Only shadcn/ui primitives, lucide-react, framer-motion, and
// @tanstack/react-query are imported from outside — those already live in
// your project. See the "SETUP" comment block at the bottom for wiring notes.
"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Archive,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  Flame,
  Inbox,
  KanbanSquare,
  LayoutGrid,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Package,
  Paperclip,
  Percent,
  Phone,
  RefreshCw,
  Search,
  Send,
  SearchX,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Table2,
  Target,
  TrendingUp,
  TriangleAlert,
  Trophy,
  UserCog,
  Wallet,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

/* ============================================================================
 * TYPES
 * ==========================================================================*/

type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "quotation_sent"
  | "negotiation"
  | "won"
  | "lost"
  | "inactive";

type LeadPriority = "urgent" | "high" | "normal" | "low";

type LeadSource =
  | "marketplace_search"
  | "rfq_broadcast"
  | "direct_inquiry"
  | "referral"
  | "trade_show"
  | "returning_buyer";

interface Attachment {
  id: string;
  name: string;
  sizeKb: number;
}

interface ActivityEvent {
  id: string;
  label: string;
  timestamp: string; // ISO
  actor: "buyer" | "you" | "system";
}

interface Lead {
  id: string;
  rfqNumber: string;

  companyName: string;
  verified: boolean;
  country: string;
  countryFlag: string;
  industry: string;
  companySize: string;

  contactName: string;
  contactDesignation: string;
  contactEmail: string;
  contactPhone: string;

  product: string;
  productCategory: string;
  quantity: string;
  budget: string;
  estimatedDealValue: number;
  probabilityToClose: number;
  expectedRevenue: number;
  potentialUpsell?: string;

  leadScore: number;
  priority: LeadPriority;
  status: LeadStatus;
  source: LeadSource;

  createdDate: string;
  lastActivity: string;
  rfqDeadline: string;

  assignedSalesperson: { name: string };

  unreadMessages: number;
  attachments: Attachment[];
  lastMessagePreview?: string;
  buyerResponseTime?: string;
  nextMeeting?: string;
  internalNotesPreview?: string;
  activity: ActivityEvent[];

  repeatBuyer: boolean;
  topBuyer: boolean;
  urgentRfq: boolean;
}

type ViewMode = "grid" | "table" | "kanban";
type SortOption =
  | "newest"
  | "highest_value"
  | "highest_score"
  | "recent_activity";

interface LeadFilters {
  search: string;
  status: LeadStatus | "all";
  country: string | "all";
  industry: string | "all";
  scoreBand: "Hot" | "High" | "Medium" | "Low" | "all";
  priority: LeadPriority | "all";
  productCategory: string | "all";
  assignedSalesperson: string | "all";
  sort: SortOption;
}

const DEFAULT_FILTERS: LeadFilters = {
  search: "",
  status: "all",
  country: "all",
  industry: "all",
  scoreBand: "all",
  priority: "all",
  productCategory: "all",
  assignedSalesperson: "all",
  sort: "newest",
};

const KANBAN_STAGES: LeadStatus[] = [
  "new",
  "qualified",
  "quotation_sent",
  "negotiation",
  "won",
  "lost",
];

/* ============================================================================
 * CONFIG — labels, colors, formatters
 * ==========================================================================*/

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; dot: string; badge: string }
> = {
  new: {
    label: "New",
    dot: "bg-sky-500",
    badge:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20",
  },
  contacted: {
    label: "Contacted",
    dot: "bg-amber-500",
    badge:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  qualified: {
    label: "Qualified",
    dot: "bg-violet-500",
    badge:
      "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  },
  quotation_sent: {
    label: "Quotation Sent",
    dot: "bg-blue-500",
    badge:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  negotiation: {
    label: "Negotiation",
    dot: "bg-orange-500",
    badge:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
  },
  won: {
    label: "Won",
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  lost: {
    label: "Lost",
    dot: "bg-rose-500",
    badge:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  },
  inactive: {
    label: "Inactive",
    dot: "bg-slate-400",
    badge:
      "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20",
  },
};

const PRIORITY_CONFIG: Record<LeadPriority, { label: string; badge: string }> =
  {
    urgent: { label: "Urgent", badge: "bg-rose-600 text-white" },
    high: {
      label: "High",
      badge:
        "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
    },
    normal: {
      label: "Normal",
      badge:
        "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400",
    },
    low: {
      label: "Low",
      badge:
        "bg-slate-50 text-slate-500 dark:bg-slate-500/10 dark:text-slate-500",
    },
  };

function getScoreBand(score: number): {
  label: "Hot" | "High" | "Medium" | "Low";
  badge: string;
} {
  if (score >= 95)
    return {
      label: "Hot",
      badge:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    };
  if (score >= 80)
    return {
      label: "High",
      badge:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    };
  if (score >= 60)
    return {
      label: "Medium",
      badge:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    };
  return {
    label: "Low",
    badge:
      "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20",
  };
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value}`;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

/* ============================================================================
 * MOCK DATA — swap getMockLeads() for a real fetch, see SETUP notes below
 * ==========================================================================*/

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();
const daysFromNow = (d: number) => new Date(now + d * 86_400_000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString();

const MOCK_LEADS: Lead[] = [
  {
    id: "ld_001",
    rfqNumber: "RFQ-2026-4471",
    companyName: "Meridian Steel Works",
    verified: true,
    country: "Germany",
    countryFlag: "🇩🇪",
    industry: "Metal Fabrication",
    companySize: "201-500 employees",
    contactName: "Lukas Weber",
    contactDesignation: "Head of Procurement",
    contactEmail: "l.weber@meridiansteel.de",
    contactPhone: "+49 30 5550 1123",
    product: "Cold Rolled Steel Coils",
    productCategory: "Metals & Alloys",
    quantity: "500 MT",
    budget: "$420,000 – $460,000",
    estimatedDealValue: 440000,
    probabilityToClose: 78,
    expectedRevenue: 343200,
    potentialUpsell: "Annual supply contract",
    leadScore: 97,
    priority: "urgent",
    status: "negotiation",
    source: "rfq_broadcast",
    createdDate: daysAgo(6),
    lastActivity: hoursAgo(1),
    rfqDeadline: daysFromNow(2),
    assignedSalesperson: { name: "Priya Nair" },
    unreadMessages: 3,
    attachments: [
      { id: "a1", name: "technical-spec.pdf", sizeKb: 812 },
      { id: "a2", name: "sample-photos.zip", sizeKb: 4300 },
    ],
    lastMessagePreview:
      "Can you hold this price if we commit to a 12-month contract?",
    buyerResponseTime: "~45 min",
    nextMeeting: daysFromNow(1),
    internalNotesPreview:
      "Price-sensitive but high volume. Loop in finance for contract terms.",
    activity: [
      {
        id: "e1",
        label: "Sent revised quotation",
        timestamp: hoursAgo(20),
        actor: "you",
      },
      {
        id: "e2",
        label: "Buyer requested bulk discount",
        timestamp: hoursAgo(3),
        actor: "buyer",
      },
    ],
    repeatBuyer: true,
    topBuyer: true,
    urgentRfq: true,
  },
  {
    id: "ld_002",
    rfqNumber: "RFQ-2026-4488",
    companyName: "Sunrise Textile Traders",
    verified: true,
    country: "Bangladesh",
    countryFlag: "🇧🇩",
    industry: "Textiles",
    companySize: "51-200 employees",
    contactName: "Farhan Rahman",
    contactDesignation: "Sourcing Manager",
    contactEmail: "farhan@sunrisetextile.com",
    contactPhone: "+880 1711 223344",
    product: "Organic Cotton Yarn",
    productCategory: "Textiles & Fabrics",
    quantity: "12,000 kg",
    budget: "$58,000 – $65,000",
    estimatedDealValue: 61000,
    probabilityToClose: 55,
    expectedRevenue: 33550,
    leadScore: 84,
    priority: "high",
    status: "quotation_sent",
    source: "marketplace_search",
    createdDate: daysAgo(3),
    lastActivity: hoursAgo(5),
    rfqDeadline: daysFromNow(5),
    assignedSalesperson: { name: "Arjun Mehta" },
    unreadMessages: 0,
    attachments: [{ id: "a3", name: "quotation-v2.pdf", sizeKb: 220 }],
    lastMessagePreview: "Reviewing internally, will confirm by Thursday.",
    buyerResponseTime: "~3 hrs",
    internalNotesPreview:
      "First-time buyer, verify certifications before shipping.",
    activity: [
      {
        id: "e3",
        label: "Quotation sent",
        timestamp: hoursAgo(30),
        actor: "you",
      },
    ],
    repeatBuyer: false,
    topBuyer: false,
    urgentRfq: false,
  },
  {
    id: "ld_003",
    rfqNumber: "RFQ-2026-4502",
    companyName: "Pacific Rim Electronics",
    verified: false,
    country: "Vietnam",
    countryFlag: "🇻🇳",
    industry: "Electronics",
    companySize: "11-50 employees",
    contactName: "Mai Tran",
    contactDesignation: "Founder",
    contactEmail: "mai@pacificrimelec.vn",
    contactPhone: "+84 28 3822 9911",
    product: "PCB Connectors (Type-C)",
    productCategory: "Electronic Components",
    quantity: "80,000 units",
    budget: "$21,000 – $25,000",
    estimatedDealValue: 23000,
    probabilityToClose: 30,
    expectedRevenue: 6900,
    leadScore: 62,
    priority: "normal",
    status: "contacted",
    source: "direct_inquiry",
    createdDate: daysAgo(2),
    lastActivity: hoursAgo(28),
    rfqDeadline: daysFromNow(9),
    assignedSalesperson: { name: "Priya Nair" },
    unreadMessages: 1,
    attachments: [],
    lastMessagePreview: "Could you share MOQ pricing tiers?",
    buyerResponseTime: "~1 day",
    internalNotesPreview: "Unverified company — request business license.",
    activity: [
      {
        id: "e4",
        label: "Initial contact made",
        timestamp: hoursAgo(29),
        actor: "you",
      },
    ],
    repeatBuyer: false,
    topBuyer: false,
    urgentRfq: false,
  },
  {
    id: "ld_004",
    rfqNumber: "RFQ-2026-4510",
    companyName: "Atlas Industrial Supply Co.",
    verified: true,
    country: "United States",
    countryFlag: "🇺🇸",
    industry: "Industrial Equipment",
    companySize: "500+ employees",
    contactName: "Diane Coleman",
    contactDesignation: "VP of Global Sourcing",
    contactEmail: "dcoleman@atlasindustrial.com",
    contactPhone: "+1 312 555 0199",
    product: "Hydraulic Cylinders",
    productCategory: "Machinery & Parts",
    quantity: "1,200 units",
    budget: "$680,000 – $720,000",
    estimatedDealValue: 705000,
    probabilityToClose: 92,
    expectedRevenue: 648600,
    potentialUpsell: "Maintenance service contract",
    leadScore: 99,
    priority: "urgent",
    status: "won",
    source: "returning_buyer",
    createdDate: daysAgo(14),
    lastActivity: hoursAgo(2),
    rfqDeadline: daysAgo(1),
    assignedSalesperson: { name: "Arjun Mehta" },
    unreadMessages: 0,
    attachments: [
      { id: "a4", name: "signed-po.pdf", sizeKb: 156 },
      { id: "a5", name: "delivery-schedule.xlsx", sizeKb: 98 },
    ],
    lastMessagePreview: "PO confirmed, looking forward to the shipment.",
    buyerResponseTime: "~30 min",
    internalNotesPreview: "Long-term account. Prioritize white-glove handling.",
    activity: [
      {
        id: "e5",
        label: "Deal marked won",
        timestamp: hoursAgo(2),
        actor: "you",
      },
      {
        id: "e6",
        label: "PO received",
        timestamp: hoursAgo(6),
        actor: "buyer",
      },
    ],
    repeatBuyer: true,
    topBuyer: true,
    urgentRfq: false,
  },
  {
    id: "ld_005",
    rfqNumber: "RFQ-2026-4519",
    companyName: "Nordic Timber Alliance",
    verified: true,
    country: "Sweden",
    countryFlag: "🇸🇪",
    industry: "Timber & Wood Products",
    companySize: "201-500 employees",
    contactName: "Erik Lindqvist",
    contactDesignation: "Procurement Lead",
    contactEmail: "erik@nordictimber.se",
    contactPhone: "+46 8 555 0142",
    product: "Kiln-Dried Pine Lumber",
    productCategory: "Timber & Raw Materials",
    quantity: "300 m³",
    budget: "$95,000 – $110,000",
    estimatedDealValue: 102000,
    probabilityToClose: 15,
    expectedRevenue: 15300,
    leadScore: 41,
    priority: "low",
    status: "lost",
    source: "marketplace_search",
    createdDate: daysAgo(20),
    lastActivity: daysAgo(8),
    rfqDeadline: daysAgo(3),
    assignedSalesperson: { name: "Priya Nair" },
    unreadMessages: 0,
    attachments: [],
    lastMessagePreview: "Went with a local supplier for logistics reasons.",
    internalNotesPreview:
      "Lost on shipping cost. Re-engage if freight rates drop.",
    activity: [
      {
        id: "e7",
        label: "Marked as lost",
        timestamp: daysAgo(8),
        actor: "you",
      },
    ],
    repeatBuyer: false,
    topBuyer: false,
    urgentRfq: false,
  },
  {
    id: "ld_006",
    rfqNumber: "RFQ-2026-4527",
    companyName: "Delta Agro Exports",
    verified: true,
    country: "India",
    countryFlag: "🇮🇳",
    industry: "Agriculture",
    companySize: "51-200 employees",
    contactName: "Sanjay Iyer",
    contactDesignation: "Export Manager",
    contactEmail: "sanjay@deltaagro.in",
    contactPhone: "+91 98200 11223",
    product: "Basmati Rice (Grade A)",
    productCategory: "Food & Agriculture",
    quantity: "40 MT",
    budget: "$38,000 – $42,000",
    estimatedDealValue: 40000,
    probabilityToClose: 65,
    expectedRevenue: 26000,
    leadScore: 88,
    priority: "high",
    status: "qualified",
    source: "trade_show",
    createdDate: daysAgo(1),
    lastActivity: hoursAgo(4),
    rfqDeadline: daysFromNow(7),
    assignedSalesperson: { name: "Arjun Mehta" },
    unreadMessages: 2,
    attachments: [{ id: "a6", name: "product-certification.pdf", sizeKb: 340 }],
    lastMessagePreview:
      "Met at the Mumbai trade show — following up as promised.",
    buyerResponseTime: "~2 hrs",
    internalNotesPreview: "Warm lead from trade show, very responsive.",
    activity: [
      {
        id: "e8",
        label: "Qualified after discovery call",
        timestamp: hoursAgo(10),
        actor: "you",
      },
    ],
    repeatBuyer: false,
    topBuyer: false,
    urgentRfq: false,
  },
  {
    id: "ld_007",
    rfqNumber: "RFQ-2026-4533",
    companyName: "Horizon Plastics Ltd.",
    verified: false,
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    industry: "Plastics & Polymers",
    companySize: "11-50 employees",
    contactName: "Olivia Bennett",
    contactDesignation: "Operations Director",
    contactEmail: "olivia@horizonplastics.co.uk",
    contactPhone: "+44 20 7946 0958",
    product: "HDPE Resin Pellets",
    productCategory: "Plastics & Raw Materials",
    quantity: "25 MT",
    budget: "$29,000 – $33,000",
    estimatedDealValue: 31000,
    probabilityToClose: 10,
    expectedRevenue: 3100,
    leadScore: 24,
    priority: "low",
    status: "inactive",
    source: "marketplace_search",
    createdDate: daysAgo(35),
    lastActivity: daysAgo(22),
    rfqDeadline: daysAgo(15),
    assignedSalesperson: { name: "Priya Nair" },
    unreadMessages: 0,
    attachments: [],
    internalNotesPreview:
      "Went quiet after initial pricing. Consider re-engagement campaign.",
    activity: [
      {
        id: "e9",
        label: "No response after 3 follow-ups",
        timestamp: daysAgo(22),
        actor: "system",
      },
    ],
    repeatBuyer: false,
    topBuyer: false,
    urgentRfq: false,
  },
  {
    id: "ld_008",
    rfqNumber: "RFQ-2026-4541",
    companyName: "Kaizen Manufacturing K.K.",
    verified: true,
    country: "Japan",
    countryFlag: "🇯🇵",
    industry: "Precision Manufacturing",
    companySize: "201-500 employees",
    contactName: "Hiroshi Tanaka",
    contactDesignation: "Chief Procurement Officer",
    contactEmail: "tanaka@kaizenmfg.co.jp",
    contactPhone: "+81 3 4567 8901",
    product: "CNC Machined Aluminum Parts",
    productCategory: "Machinery & Parts",
    quantity: "6,000 units",
    budget: "$210,000 – $235,000",
    estimatedDealValue: 224000,
    probabilityToClose: 70,
    expectedRevenue: 156800,
    potentialUpsell: "Prototype-to-production pipeline",
    leadScore: 91,
    priority: "high",
    status: "new",
    source: "returning_buyer",
    createdDate: hoursAgo(6),
    lastActivity: hoursAgo(6),
    rfqDeadline: daysFromNow(10),
    assignedSalesperson: { name: "Arjun Mehta" },
    unreadMessages: 5,
    attachments: [{ id: "a7", name: "cad-drawings.zip", sizeKb: 8900 }],
    lastMessagePreview:
      "Attaching CAD files for the batch — need a quote by next week.",
    buyerResponseTime: "~1 hr",
    internalNotesPreview: "Repeat buyer from Q1. Fast responder, prioritize.",
    activity: [
      {
        id: "e10",
        label: "New RFQ submitted",
        timestamp: hoursAgo(6),
        actor: "buyer",
      },
    ],
    repeatBuyer: true,
    topBuyer: false,
    urgentRfq: false,
  },
];

function getMockLeads(): Promise<Lead[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_LEADS), 400));
}

/* ============================================================================
 * FILTER / SORT LOGIC
 * ==========================================================================*/

function filterAndSortLeads(leads: Lead[], filters: LeadFilters): Lead[] {
  const q = filters.search.trim().toLowerCase();

  const filtered = leads.filter((lead) => {
    if (q) {
      const haystack =
        `${lead.companyName} ${lead.contactName} ${lead.rfqNumber} ${lead.product}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.status !== "all" && lead.status !== filters.status)
      return false;
    if (filters.country !== "all" && lead.country !== filters.country)
      return false;
    if (filters.industry !== "all" && lead.industry !== filters.industry)
      return false;
    if (filters.priority !== "all" && lead.priority !== filters.priority)
      return false;
    if (
      filters.productCategory !== "all" &&
      lead.productCategory !== filters.productCategory
    )
      return false;
    if (
      filters.assignedSalesperson !== "all" &&
      lead.assignedSalesperson.name !== filters.assignedSalesperson
    )
      return false;
    if (
      filters.scoreBand !== "all" &&
      getScoreBand(lead.leadScore).label !== filters.scoreBand
    )
      return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case "highest_value":
        return b.estimatedDealValue - a.estimatedDealValue;
      case "highest_score":
        return b.leadScore - a.leadScore;
      case "recent_activity":
        return (
          new Date(b.lastActivity).getTime() -
          new Date(a.lastActivity).getTime()
        );
      case "newest":
      default:
        return (
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
    }
  });
}

function getUniqueValues(
  leads: Lead[],
  key: "country" | "industry" | "productCategory",
): string[] {
  return Array.from(new Set(leads.map((l) => l[key]))).sort();
}

function getUniqueSalespeople(leads: Lead[]): string[] {
  return Array.from(
    new Set(leads.map((l) => l.assignedSalesperson.name)),
  ).sort();
}

function computeKpis(leads: Lead[]) {
  const total = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const hot = leads.filter((l) => l.leadScore >= 95).length;
  const quoted = leads.filter((l) => l.status === "quotation_sent").length;
  const won = leads.filter((l) => l.status === "won").length;
  const conversionRate = total ? Math.round((won / total) * 1000) / 10 : 0;
  const pipelineValue = leads
    .filter((l) => !["won", "lost", "inactive"].includes(l.status))
    .reduce((sum, l) => sum + l.estimatedDealValue, 0);
  const revenue = leads
    .filter((l) => l.status === "won")
    .reduce((sum, l) => sum + l.estimatedDealValue, 0);
  return {
    total,
    newLeads,
    hot,
    quoted,
    won,
    conversionRate,
    pipelineValue,
    revenue,
    spark: [4, 6, 5, 8, 7, 9, 8, 10],
  };
}

/* ============================================================================
 * BADGES
 * ==========================================================================*/

function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        cfg.badge,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: LeadPriority }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        cfg.badge,
      )}
    >
      {cfg.label}
    </span>
  );
}

function ScoreChip({ score }: { score: number }) {
  const band = getScoreBand(score);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
        band.badge,
      )}
    >
      {band.label === "Hot" ? <Flame className="h-3.5 w-3.5" /> : null}
      {score}
      <span className="font-normal opacity-70">· {band.label}</span>
    </span>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
      <ShieldCheck className="h-3.5 w-3.5" />
      Verified
    </span>
  );
}

function RepeatBuyerBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
      <Zap className="h-3 w-3" />
      Repeat Buyer
    </span>
  );
}

function TopBuyerBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
      <Star className="h-3 w-3 fill-current" />
      Top Buyer
    </span>
  );
}

function UrgentRfqBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-semibold text-white">
      Urgent RFQ
    </span>
  );
}

/* ============================================================================
 * KPI CARD
 * ==========================================================================*/

interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
  accent?: "default" | "success" | "warning" | "danger";
  sparkline?: number[];
}

const ACCENT_ICON_BG: Record<NonNullable<KpiCardProps["accent"]>, string> = {
  default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  success:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  warning:
    "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  danger: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

function KpiCard({
  label,
  value,
  change,
  icon: Icon,
  accent = "default",
  sparkline,
}: KpiCardProps) {
  const isPositive = change >= 0;
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Card className="group relative overflow-hidden rounded-xl border border-border/60 p-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              ACCENT_ICON_BG[accent],
            )}
          >
            <Icon className="h-4.5 w-4.5" strokeWidth={2} />
          </div>
          {sparkline ? (
            <MiniSparkline data={sparkline} positive={isPositive} />
          ) : null}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <div
          className={cn(
            "mt-2 inline-flex items-center gap-0.5 text-xs font-medium",
            isPositive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400",
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {Math.abs(change).toFixed(1)}%
          <span className="ml-1 font-normal text-muted-foreground">
            vs last month
          </span>
        </div>
      </Card>
    </motion.div>
  );
}

function MiniSparkline({
  data,
  positive,
}: {
  data: number[];
  positive: boolean;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * 56},${20 - ((v - min) / range) * 20}`,
    )
    .join(" ");
  return (
    <svg width="56" height="20" viewBox="0 0 56 20" className="opacity-70">
      <polyline
        points={points}
        fill="none"
        strokeWidth="1.5"
        className={positive ? "stroke-emerald-500" : "stroke-rose-500"}
      />
    </svg>
  );
}

/* ============================================================================
 * LEAD CARD (grid view)
 * ==========================================================================*/

interface LeadActionHandlers {
  onOpenConversation?: (lead: Lead) => void;
  onViewRfq?: (lead: Lead) => void;
  onSendQuotation?: (lead: Lead) => void;
  onScheduleFollowUp?: (lead: Lead) => void;
  onAssignSalesperson?: (lead: Lead) => void;
  onMarkWon?: (lead: Lead) => void;
  onArchive?: (lead: Lead) => void;
}

function LeadCard({ lead, ...handlers }: { lead: Lead } & LeadActionHandlers) {
  const [expanded, setExpanded] = useState(false);
  const initials = lead.companyName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <motion.div layout whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
      <Card className="relative flex flex-col gap-4 rounded-xl border border-border/60 p-5 shadow-sm transition-shadow hover:shadow-md">
        {(lead.urgentRfq || lead.topBuyer) && (
          <div className="absolute right-4 top-4 flex gap-1.5">
            {lead.urgentRfq && <UrgentRfqBadge />}
            {lead.topBuyer && <TopBuyerBadge />}
          </div>
        )}

        <div className="flex items-start gap-3 pr-20">
          <Avatar className="h-11 w-11 rounded-lg border border-border/60">
            <AvatarFallback className="rounded-lg bg-slate-100 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-semibold text-foreground">
                {lead.companyName}
              </h3>
              <span className="text-base leading-none">{lead.countryFlag}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              {lead.verified && <VerifiedBadge />}
              <span className="truncate">{lead.industry}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge status={lead.status} />
          <PriorityBadge priority={lead.priority} />
          <ScoreChip score={lead.leadScore} />
          {lead.repeatBuyer && <RepeatBuyerBadge />}
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3 text-xs">
          <SummaryField icon={Package} label="Product" value={lead.product} />
          <SummaryField
            icon={Building2}
            label="RFQ No."
            value={lead.rfqNumber}
          />
          <SummaryField
            icon={DollarSign}
            label="Est. Deal Value"
            value={formatCurrency(lead.estimatedDealValue)}
          />
          <SummaryField
            icon={Clock}
            label="Deadline"
            value={new Date(lead.rfqDeadline).toLocaleDateString()}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {lead.contactName}
            </p>
            <p className="truncate text-muted-foreground">
              {lead.contactDesignation}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger
                onClick={() => {
                  window.location.href = `mailto:${lead.contactEmail}`;
                }}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5" />
              </TooltipTrigger>
              <TooltipContent>{lead.contactEmail}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                onClick={() => {
                  window.location.href = `tel:${lead.contactPhone}`;
                }}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Phone className="h-3.5 w-3.5" />
              </TooltipTrigger>
              <TooltipContent>{lead.contactPhone}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {lead.lastMessagePreview && (
          <button
            onClick={() => handlers.onOpenConversation?.(lead)}
            className="flex items-start gap-2 rounded-lg border border-border/50 p-2.5 text-left text-xs hover:bg-muted/50"
          >
            <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="line-clamp-2 flex-1 text-muted-foreground">
              {lead.lastMessagePreview}
            </span>
            {lead.unreadMessages > 0 && (
              <span className="flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {lead.unreadMessages}
              </span>
            )}
          </button>
        )}

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2 border-t border-border/60 pt-3 text-xs"
          >
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Quantity:</span>{" "}
                {lead.quantity}
              </p>
              <p>
                <span className="font-medium text-foreground">Budget:</span>{" "}
                {lead.budget}
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Company Size:
                </span>{" "}
                {lead.companySize}
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Close Probability:
                </span>{" "}
                {lead.probabilityToClose}%
              </p>
            </div>
            {lead.internalNotesPreview && (
              <p className="rounded-md bg-amber-50 p-2 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                <span className="font-medium">Note: </span>
                {lead.internalNotesPreview}
              </p>
            )}
            {lead.attachments.length > 0 && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Paperclip className="h-3.5 w-3.5" />
                {lead.attachments.length} attachment
                {lead.attachments.length > 1 ? "s" : ""}
              </div>
            )}
          </motion.div>
        )}

        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]">
                {lead.assignedSalesperson.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {timeAgo(lead.lastActivity)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Less" : "More"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => handlers.onViewRfq?.(lead)}>
                  <Eye className="mr-2 h-4 w-4" /> View RFQ
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlers.onOpenConversation?.(lead)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" /> Open Conversation
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlers.onSendQuotation?.(lead)}
                >
                  <Send className="mr-2 h-4 w-4" /> Send Quotation
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlers.onScheduleFollowUp?.(lead)}
                >
                  <Calendar className="mr-2 h-4 w-4" /> Schedule Follow-up
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlers.onAssignSalesperson?.(lead)}
                >
                  <UserCog className="mr-2 h-4 w-4" /> Assign Salesperson
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handlers.onMarkWon?.(lead)}>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />{" "}
                  Mark Won
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlers.onArchive?.(lead)}
                  className="text-rose-600 focus:text-rose-600"
                >
                  <Archive className="mr-2 h-4 w-4" /> Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function SummaryField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1 text-muted-foreground">
        <Icon className="h-3 w-3" />
        <span>{label}</span>
      </div>
      <p className="truncate font-medium text-foreground">{value}</p>
    </div>
  );
}

/* ============================================================================
 * FILTER BAR
 * ==========================================================================*/

function FilterBar({
  filters,
  onChange,
  countries,
  industries,
  productCategories,
  salespeople,
  resultCount,
}: {
  filters: LeadFilters;
  onChange: (filters: LeadFilters) => void;
  countries: string[];
  industries: string[];
  productCategories: string[];
  salespeople: string[];
  resultCount: number;
}) {
  const set = <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) =>
    onChange({ ...filters, [key]: value });
  const activeCount = Object.entries(filters).filter(
    ([key, value]) => key !== "search" && key !== "sort" && value !== "all",
  ).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search company, contact, RFQ number, or product…"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={filters.sort}
          onValueChange={(v) => set("sort", v as SortOption)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SlidersHorizontal className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="highest_value">Highest Value</SelectItem>
            <SelectItem value="highest_score">Highest Score</SelectItem>
            <SelectItem value="recent_activity">Recent Activity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          placeholder="Status"
          value={filters.status}
          onChange={(v) => set("status", v as LeadFilters["status"])}
          options={[
            "new",
            "contacted",
            "qualified",
            "quotation_sent",
            "negotiation",
            "won",
            "lost",
            "inactive",
          ].map((s) => ({ value: s, label: s.replace("_", " ") }))}
        />
        <FilterSelect
          placeholder="Country"
          value={filters.country}
          onChange={(v) => set("country", v)}
          options={countries.map((c) => ({ value: c, label: c }))}
        />
        <FilterSelect
          placeholder="Industry"
          value={filters.industry}
          onChange={(v) => set("industry", v)}
          options={industries.map((i) => ({ value: i, label: i }))}
        />
        <FilterSelect
          placeholder="Lead Score"
          value={filters.scoreBand}
          onChange={(v) => set("scoreBand", v as LeadFilters["scoreBand"])}
          options={[
            { value: "Hot", label: "Hot (95–100)" },
            { value: "High", label: "High (80–94)" },
            { value: "Medium", label: "Medium (60–79)" },
            { value: "Low", label: "Low (<60)" },
          ]}
        />
        <FilterSelect
          placeholder="Priority"
          value={filters.priority}
          onChange={(v) => set("priority", v as LeadFilters["priority"])}
          options={["urgent", "high", "normal", "low"].map((p) => ({
            value: p,
            label: p,
          }))}
        />
        <FilterSelect
          placeholder="Product Category"
          value={filters.productCategory}
          onChange={(v) => set("productCategory", v)}
          options={productCategories.map((c) => ({ value: c, label: c }))}
        />
        <FilterSelect
          placeholder="Salesperson"
          value={filters.assignedSalesperson}
          onChange={(v) => set("assignedSalesperson", v)}
          options={salespeople.map((s) => ({ value: s, label: s }))}
        />

        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-xs text-muted-foreground"
            onClick={() =>
              onChange({
                ...DEFAULT_FILTERS,
                search: filters.search,
                sort: filters.sort,
              })
            }
          >
            <X className="h-3.5 w-3.5" />
            Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
          </Button>
        )}

        <Badge variant="secondary" className="ml-auto font-normal">
          {resultCount} lead{resultCount === 1 ? "" : "s"}
        </Badge>
      </div>
    </div>
  );
}

function FilterSelect({
  placeholder,
  value,
  onChange,
  options,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-auto min-w-[120px] gap-1.5 text-xs capitalize">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {placeholder}</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="capitalize">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ============================================================================
 * VIEW SWITCHER
 * ==========================================================================*/

const VIEWS: { value: ViewMode; label: string; icon: LucideIcon }[] = [
  { value: "grid", label: "Grid", icon: LayoutGrid },
  { value: "table", label: "Table", icon: Table2 },
  { value: "kanban", label: "Kanban", icon: KanbanSquare },
];

function ViewSwitcher({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border/60 bg-muted/40 p-0.5">
      {VIEWS.map((view) => {
        const Icon = view.icon;
        const active = value === view.value;
        return (
          <button
            key={view.value}
            onClick={() => onChange(view.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {view.label}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================================
 * TABLE VIEW
 * ==========================================================================*/

function LeadTable({
  leads,
  onRowClick,
  onOpenConversation,
  onSendQuotation,
  onViewRfq,
}: { leads: Lead[] } & LeadActionHandlers & {
    onRowClick?: (lead: Lead) => void;
  }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Budget</TableHead>
            <TableHead className="text-right">Deal Value</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              className="cursor-pointer"
              onClick={() => onRowClick?.(lead)}
            >
              <TableCell className="max-w-[180px]">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7 rounded-md">
                    <AvatarFallback className="rounded-md text-[10px]">
                      {lead.companyName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {lead.countryFlag} {lead.companyName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {lead.rfqNumber}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                <p className="truncate font-medium">{lead.contactName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {lead.contactDesignation}
                </p>
              </TableCell>
              <TableCell className="max-w-[160px] truncate text-sm text-muted-foreground">
                {lead.product}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {lead.budget}
              </TableCell>
              <TableCell className="text-right text-sm font-semibold">
                {formatCurrency(lead.estimatedDealValue)}
              </TableCell>
              <TableCell>
                <ScoreChip score={lead.leadScore} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={lead.priority} />
              </TableCell>
              <TableCell>
                <StatusBadge status={lead.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(lead.rfqDeadline).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {timeAgo(lead.lastActivity)}
              </TableCell>
              <TableCell
                className="text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewRfq?.(lead)}>
                      <Eye className="mr-2 h-4 w-4" /> View RFQ
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onOpenConversation?.(lead)}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" /> Open
                      Conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSendQuotation?.(lead)}>
                      <Send className="mr-2 h-4 w-4" /> Send Quotation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ============================================================================
 * KANBAN VIEW
 * ==========================================================================*/

function KanbanBoard({
  leads,
  onStageChange,
  onCardClick,
}: {
  leads: Lead[];
  onStageChange: (leadId: string, newStatus: LeadStatus) => void;
  onCardClick?: (lead: Lead) => void;
}) {
  const [dragOverStage, setDragOverStage] = useState<LeadStatus | null>(null);
  const leadsByStage = KANBAN_STAGES.reduce<Record<LeadStatus, Lead[]>>(
    (acc, stage) => {
      acc[stage] = leads.filter((l) => l.status === stage);
      return acc;
    },
    {} as Record<LeadStatus, Lead[]>,
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {KANBAN_STAGES.map((stage) => {
        const stageLeads = leadsByStage[stage];
        const cfg = STATUS_CONFIG[stage];
        const stageValue = stageLeads.reduce(
          (sum, l) => sum + l.estimatedDealValue,
          0,
        );

        return (
          <div
            key={stage}
            className={cn(
              "flex w-72 shrink-0 flex-col rounded-xl border border-border/60 bg-muted/20 transition-colors",
              dragOverStage === stage && "border-primary/50 bg-primary/5",
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverStage(stage);
            }}
            onDragLeave={() => setDragOverStage(null)}
            onDrop={(e) => {
              e.preventDefault();
              const leadId = e.dataTransfer.getData("text/lead-id");
              if (leadId) onStageChange(leadId, stage);
              setDragOverStage(null);
            }}
          >
            <div className="flex items-center justify-between border-b border-border/60 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", cfg.dot)} />
                <span className="text-sm font-medium">{cfg.label}</span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  {stageLeads.length}
                </span>
              </div>
            </div>
            <div className="px-3 pt-2 text-[11px] text-muted-foreground">
              {formatCurrency(stageValue)} pipeline
            </div>

            <div className="flex-1 space-y-2 p-3">
              {stageLeads.map((lead) => (
                <motion.div
                  key={lead.id}
                  layout
                  draggable
                  onDragStart={(e) => {
                    (e as unknown as React.DragEvent).dataTransfer.setData(
                      "text/lead-id",
                      lead.id,
                    );
                  }}
                  onClick={() => onCardClick?.(lead)}
                  whileHover={{ y: -2 }}
                  className="cursor-grab rounded-lg border border-border/60 bg-background p-3 shadow-sm active:cursor-grabbing"
                >
                  <p className="truncate text-xs font-semibold">
                    {lead.countryFlag} {lead.companyName}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {lead.product}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold">
                      {formatCurrency(lead.estimatedDealValue)}
                    </span>
                    <ScoreChip score={lead.leadScore} />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <PriorityBadge priority={lead.priority} />
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[9px]">
                        {lead.assignedSalesperson.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </motion.div>
              ))}
              {stageLeads.length === 0 && (
                <div className="rounded-lg border border-dashed border-border/60 p-4 text-center text-[11px] text-muted-foreground">
                  Drop a lead here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================================
 * EMPTY / ERROR / SKELETON STATES
 * ==========================================================================*/

function EmptyState({
  onBrowseMarketplace,
}: {
  onBrowseMarketplace?: () => void;
}) {
  return (
    <Card className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Inbox className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-base font-semibold">No leads yet</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        Buyer inquiries and RFQs will show up here as soon as they come in. List
        more products to start attracting qualified leads.
      </p>
      <Button className="mt-5" onClick={onBrowseMarketplace}>
        Browse Marketplace
      </Button>
    </Card>
  );
}

function NoResultsState({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <Card className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <SearchX className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">
        No leads match your filters
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try widening your search or clearing a few filters.
      </p>
      <Button variant="outline" className="mt-4" onClick={onClearFilters}>
        Clear filters
      </Button>
    </Card>
  );
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="flex flex-col items-center justify-center rounded-xl border border-dashed border-rose-200 bg-rose-50/40 px-6 py-16 text-center dark:border-rose-500/20 dark:bg-rose-500/5">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-500/10">
        <TriangleAlert className="h-6 w-6 text-rose-600 dark:text-rose-400" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">Couldn't load your leads</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Something went wrong reaching the server. Check your connection and try
        again.
      </p>
      <Button variant="outline" className="mt-4 gap-2" onClick={onRetry}>
        <RefreshCw className="h-3.5 w-3.5" /> Retry
      </Button>
    </Card>
  );
}

function KpiCardSkeleton() {
  return (
    <Card className="rounded-xl border border-border/60 p-4">
      <Skeleton className="h-9 w-9 rounded-lg" />
      <Skeleton className="mt-3 h-6 w-20" />
      <Skeleton className="mt-2 h-3 w-24" />
      <Skeleton className="mt-2 h-3 w-16" />
    </Card>
  );
}

function LeadCardSkeleton() {
  return (
    <Card className="rounded-xl border border-border/60 p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-lg" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-4 flex gap-1.5">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-16 w-full rounded-lg" />
      <Skeleton className="mt-3 h-10 w-full rounded-lg" />
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-7 w-16" />
      </div>
    </Card>
  );
}

/* ============================================================================
 * PAGE
 * ==========================================================================*/

export default function SupplierLeadsPage() {
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [view, setView] = useState<ViewMode>("grid");
  const [leadsOverride, setLeadsOverride] = useState<Lead[] | null>(null);

  const {
    data: leads,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["supplier-leads"],
    queryFn: getMockLeads, // TODO: replace with your real API call
  });

  const allLeads = leadsOverride ?? leads ?? [];
  const filteredLeads = useMemo(
    () => filterAndSortLeads(allLeads, filters),
    [allLeads, filters],
  );
  const countries = useMemo(
    () => getUniqueValues(allLeads, "country"),
    [allLeads],
  );
  const industries = useMemo(
    () => getUniqueValues(allLeads, "industry"),
    [allLeads],
  );
  const productCategories = useMemo(
    () => getUniqueValues(allLeads, "productCategory"),
    [allLeads],
  );
  const salespeople = useMemo(() => getUniqueSalespeople(allLeads), [allLeads]);
  const kpis = useMemo(() => computeKpis(allLeads), [allLeads]);

  function handleStageChange(leadId: string, newStatus: LeadStatus) {
    const base = leadsOverride ?? leads ?? [];
    setLeadsOverride(
      base.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
    );
    toast("Lead moved", {
      description: `Status updated to "${newStatus.replace("_", " ")}".`,
    });
  }

  function handleAction(action: string) {
    return (lead: Lead) =>
      toast(action, { description: `${action} for ${lead.companyName}.` });
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Supplier Leads
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor, prioritize and convert buyer inquiries into successful
            deals.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export Leads
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="h-3.5 w-3.5" /> Filters
          </Button>
          <Button size="sm" className="gap-1.5">
            <Bell className="h-3.5 w-3.5" /> Add Reminder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <KpiCardSkeleton key={i} />)
        ) : (
          <>
            <KpiCard
              label="Total Leads"
              value={String(kpis.total)}
              change={8.2}
              icon={Target}
              sparkline={kpis.spark}
            />
            <KpiCard
              label="New Leads"
              value={String(kpis.newLeads)}
              change={12.4}
              icon={Sparkles}
              accent="success"
              sparkline={kpis.spark}
            />
            <KpiCard
              label="Hot Leads"
              value={String(kpis.hot)}
              change={-2.1}
              icon={TrendingUp}
              accent="warning"
              sparkline={kpis.spark}
            />
            <KpiCard
              label="Quotation Sent"
              value={String(kpis.quoted)}
              change={5.6}
              icon={Send}
              sparkline={kpis.spark}
            />
            <KpiCard
              label="Won Deals"
              value={String(kpis.won)}
              change={14.3}
              icon={Trophy}
              accent="success"
              sparkline={kpis.spark}
            />
            <KpiCard
              label="Conversion Rate"
              value={`${kpis.conversionRate}%`}
              change={3.1}
              icon={Percent}
              sparkline={kpis.spark}
            />
            <KpiCard
              label="Est. Pipeline Value"
              value={formatCurrency(kpis.pipelineValue)}
              change={9.7}
              icon={Wallet}
              sparkline={kpis.spark}
            />
            <KpiCard
              label="Revenue Generated"
              value={formatCurrency(kpis.revenue)}
              change={18.9}
              icon={DollarSign}
              accent="success"
              sparkline={kpis.spark}
            />
          </>
        )}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <FilterBar
            filters={filters}
            onChange={setFilters}
            countries={countries}
            industries={industries}
            productCategories={productCategories}
            salespeople={salespeople}
            resultCount={filteredLeads.length}
          />
        </div>
        <ViewSwitcher value={view} onChange={setView} />
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <LeadCardSkeleton key={i} />
          ))}
        </div>
      ) : allLeads.length === 0 ? (
        <EmptyState onBrowseMarketplace={() => toast("Opening marketplace…")} />
      ) : filteredLeads.length === 0 ? (
        <NoResultsState onClearFilters={() => setFilters(DEFAULT_FILTERS)} />
      ) : view === "grid" ? (
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onViewRfq={handleAction("View RFQ")}
              onOpenConversation={handleAction("Open Conversation")}
              onSendQuotation={handleAction("Send Quotation")}
              onScheduleFollowUp={handleAction("Schedule Follow-up")}
              onAssignSalesperson={handleAction("Assign Salesperson")}
              onMarkWon={(lead) => handleStageChange(lead.id, "won")}
              onArchive={handleAction("Archive")}
            />
          ))}
        </motion.div>
      ) : view === "table" ? (
        <LeadTable
          leads={filteredLeads}
          onRowClick={handleAction("Open lead")}
          onOpenConversation={handleAction("Open Conversation")}
          onSendQuotation={handleAction("Send Quotation")}
          onViewRfq={handleAction("View RFQ")}
        />
      ) : (
        <KanbanBoard
          leads={filteredLeads}
          onStageChange={handleStageChange}
          onCardClick={handleAction("Open lead")}
        />
      )}
    </div>
  );
}
