// src/services/analytics.service.ts

import { eachMonthOfInterval, eachWeekOfInterval, format } from "date-fns";
import analyticsRepository from "../repository/analytics.repository.js";
import {
  AnalyticsRange,
  AnalyticsKpi,
  RevenuePoint,
  RfqVolumePoint,
  TopProduct,
  SupplierAnalyticsResponse,
} from "../types/analytics.types.js";

class AnalyticsService {
  async getAnalytics(
    supplierId: string,
    range: AnalyticsRange,
  ): Promise<SupplierAnalyticsResponse> {
    const { from, previousFrom, previousTo } =
      analyticsRepository.getDateRange(range);

    const [
      responded,
      prevResponded,
      quotations,
      prevQuotations,
      won,
      prevWon,
      avgHours,
      prevAvgHours,
      orders,
      volumeEvents,
      products,
    ] = await Promise.all([
      analyticsRepository.countRespondedRfqs(supplierId, from),
      analyticsRepository.countRespondedRfqs(
        supplierId,
        previousFrom,
        previousTo,
      ),
      analyticsRepository.countQuotationsSent(supplierId, from),
      analyticsRepository.countQuotationsSent(
        supplierId,
        previousFrom,
        previousTo,
      ),
      analyticsRepository.countWins(supplierId, from),
      analyticsRepository.countWins(supplierId, previousFrom, previousTo),
      analyticsRepository.getAverageResponseTimeHours(supplierId, from),
      analyticsRepository.getAverageResponseTimeHours(supplierId, previousFrom),
      analyticsRepository.getOrdersForRevenue(supplierId, from),
      analyticsRepository.getRfqAndWinEvents(supplierId, from),
      analyticsRepository.getProductsWithRfqStats(supplierId, from),
    ]);

    const winRate = quotations > 0 ? (won / quotations) * 100 : 0;
    const prevWinRate =
      prevQuotations > 0 ? (prevWon / prevQuotations) * 100 : 0;

    const kpis: AnalyticsKpi[] = [
      {
        label: "RFQs responded",
        value: responded.toLocaleString(),
        change: this.percentageChange(responded, prevResponded),
        icon: "Inbox",
      },
      {
        label: "Quotations sent",
        value: quotations.toLocaleString(),
        change: this.percentageChange(quotations, prevQuotations),
        icon: "FileText",
      },
      {
        label: "Win rate",
        value: `${Math.round(winRate)}%`,
        change: this.percentageChange(winRate, prevWinRate),
        icon: "Trophy",
      },
      {
        label: "Avg. response time",
        value: `${avgHours.toFixed(1)} hrs`,
        change: this.percentageChange(avgHours, prevAvgHours, true),
        icon: "Clock",
      },
    ];

    return {
      kpis,
      revenue: this.buildRevenueSeries(orders, from),
      rfqVolume: this.buildRfqVolumeSeries(volumeEvents, from, range),
      topProducts: this.buildTopProducts(products),
    };
  }

  private percentageChange(
    current: number,
    previous: number,
    invert = false,
  ): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    const change = ((current - previous) / previous) * 100;
    return Number((invert ? -change : change).toFixed(1));
  }

  private buildRevenueSeries(
    orders: { amount: number; createdAt: Date }[],
    from: Date,
  ): RevenuePoint[] {
    const months = eachMonthOfInterval({
      start: from,
      end: new Date(),
    });

    return months.map((monthStart) => {
      const key = format(monthStart, "MMM");

      const total = orders
        .filter(
          (o) =>
            format(o.createdAt, "MMM yyyy") === format(monthStart, "MMM yyyy"),
        )
        .reduce((sum, o) => sum + Number(o.amount), 0);

      return {
        month: key,
        value: Math.round(total),
      };
    });
  }

  private buildRfqVolumeSeries(
    data: {
      responded: { createdAt: Date }[];
      won: { createdAt: Date }[];
    },
    from: Date,
    range: AnalyticsRange,
  ): RfqVolumePoint[] {
    const weeks = eachWeekOfInterval(
      {
        start: from,
        end: new Date(),
      },
      {
        weekStartsOn: 1,
      },
    );

    return weeks.map((weekStart, index) => {
      const weekEnd = new Date(weekStart);

      weekEnd.setDate(weekEnd.getDate() + 7);

      const responded = data.responded.filter(
        (r) => r.createdAt >= weekStart && r.createdAt < weekEnd,
      ).length;

      const won = data.won.filter(
        (w) => w.createdAt >= weekStart && w.createdAt < weekEnd,
      ).length;

      return {
        week: range === "7d" ? format(weekStart, "EEE") : `Wk ${index + 1}`,
        responded,
        won,
      };
    });
  }

  private buildTopProducts(raw: any[]): TopProduct[] {
    return raw
      .map((p) => ({
        name: p.name,
        views: p.views,
        rfqs: 0,
        winRate: 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);
  }
}

export default new AnalyticsService();
