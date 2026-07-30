// // src/types/analytics.types.ts

// export type AnalyticsRange = "7d" | "30d" | "90d";

// export type KpiIcon = "Inbox" | "FileText" | "Trophy" | "Clock";

// export interface AnalyticsKpi {
//   label: string;
//   value: string;
//   change: number;
//   icon: KpiIcon;
// }

// export interface RevenuePoint {
//   month: string;
//   value: number;
// }

// export interface RfqVolumePoint {
//   week: string;
//   responded: number;
//   won: number;
// }

// export interface TopProduct {
//   name: string;
//   views: number;
//   rfqs: number;
//   winRate: number;
// }

// export interface SupplierAnalyticsResponse {
//   kpis: AnalyticsKpi[]; // ← must be array
//   revenue: RevenuePoint[]; // ← must be array of { month, value }
//   rfqVolume: RfqVolumePoint[]; // ← must be array of { week, responded, won }
//   topProducts: TopProduct[];
// }

// src/types/analytics.types.ts

export type AnalyticsRange = "7d" | "30d" | "90d";

export interface AnalyticsKpi {
  label: string;
  value: string;
  change: number;
  icon: "Inbox" | "FileText" | "Trophy" | "Clock";
}

export interface RevenuePoint {
  month: string;
  value: number;
}

export interface RfqVolumePoint {
  week: string;
  responded: number;
  won: number;
}

export interface TopProduct {
  name: string;
  views: number;
  rfqs: number;
  winRate: number;
}

export interface SupplierAnalyticsResponse {
  kpis: AnalyticsKpi[];
  revenue: RevenuePoint[];
  rfqVolume: RfqVolumePoint[];
  topProducts: TopProduct[];
}

export interface RevenueOrder {
  amount: number;
  createdAt: Date;
}

export interface VolumeEvents {
  responded: {
    createdAt: Date;
  }[];

  won: {
    createdAt: Date;
  }[];
}

export interface ProductAnalytics {
  id: string;
  name: string;
  views: number;

  quotations: {
    id: string;
    order: {
      id: string;
    } | null;
  }[];
}
