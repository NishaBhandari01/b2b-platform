// src/repositories/analytics.repository.ts

import prisma from "../config/db.js";
import { AnalyticsRange } from "../types/analytics.types.js";
import { startOfDay, subDays } from "date-fns";

class AnalyticsRepository {
  private getDateBounds(range: AnalyticsRange) {
    const now = new Date();

    switch (range) {
      case "7d":
        return {
          from: startOfDay(subDays(now, 7)),
          previousFrom: startOfDay(subDays(now, 14)),
          previousTo: startOfDay(subDays(now, 7)),
        };

      case "30d":
        return {
          from: startOfDay(subDays(now, 30)),
          previousFrom: startOfDay(subDays(now, 60)),
          previousTo: startOfDay(subDays(now, 30)),
        };

      case "90d":
        return {
          from: startOfDay(subDays(now, 90)),
          previousFrom: startOfDay(subDays(now, 180)),
          previousTo: startOfDay(subDays(now, 90)),
        };
    }
  }

  getDateRange(range: AnalyticsRange) {
    return this.getDateBounds(range);
  }

  // RFQs supplier responded to
  async countRespondedRfqs(supplierId: string, from: Date, to?: Date) {
    return prisma.quotation.count({
      where: {
        supplierId,
        createdAt: {
          gte: from,
          ...(to ? { lt: to } : {}),
        },
      },
    });
  }

  // Quotations sent by supplier
  async countQuotationsSent(supplierId: string, from: Date, to?: Date) {
    return prisma.quotation.count({
      where: {
        supplierId,
        createdAt: {
          gte: from,
          ...(to ? { lt: to } : {}),
        },
      },
    });
  }

  // Successful orders
  async countWins(supplierId: string, from: Date, to?: Date) {
    return prisma.order.count({
      where: {
        supplierId,
        status: {
          not: "cancelled",
        },
        createdAt: {
          gte: from,
          ...(to ? { lt: to } : {}),
        },
      },
    });
  }

  // Average time between RFQ creation and supplier response
  async getAverageResponseTimeHours(supplierId: string, from: Date) {
    const result = await prisma.$queryRaw<{ avg_hours: number | null }[]>`
      SELECT AVG(
        EXTRACT(
          EPOCH FROM (
            q."createdAt" - r."createdAt"
          )
        ) / 3600.0
      ) AS avg_hours

      FROM "Quotation" q

      INNER JOIN "Rfq" r
      ON r.id = q."rfqId"

      WHERE q."supplierId" = ${supplierId}
      AND q."createdAt" >= ${from}
    `;

    return Number(result[0]?.avg_hours ?? 0);
  }

  async getOrdersForRevenue(supplierId: string, from: Date) {
    return prisma.order.findMany({
      where: {
        supplierId,
        createdAt: {
          gte: from,
        },
        status: {
          not: "cancelled",
        },
      },

      select: {
        amount: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async getRfqAndWinEvents(supplierId: string, from: Date) {
    const [responded, won] = await Promise.all([
      prisma.quotation.findMany({
        where: {
          supplierId,
          createdAt: {
            gte: from,
          },
        },

        select: {
          createdAt: true,
        },
      }),

      prisma.order.findMany({
        where: {
          supplierId,
          createdAt: {
            gte: from,
          },
          status: {
            not: "cancelled",
          },
        },

        select: {
          createdAt: true,
        },
      }),
    ]);

    return {
      responded,
      won,
    };
  }

  async getProductsWithRfqStats(supplierId: string, from: Date, limit = 20) {
    /*
      Current schema has no Product -> RFQ relation.

      Return products with views only.
      RFQ tracking requires a future ProductQuotation/RfqItem table.
    */

    return prisma.product.findMany({
      where: {
        supplierId,
        deletedAt: null,
      },

      select: {
        id: true,
        name: true,
        views: true,
      },

      orderBy: {
        views: "desc",
      },

      take: limit,
    });
  }
}

export default new AnalyticsRepository();
