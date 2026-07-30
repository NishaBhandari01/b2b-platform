// src/controllers/analytics.controller.ts

import { Request, Response, NextFunction } from "express";
import analyticsService from "../services/analytics.service.js";
import { AnalyticsRange } from "../types/analytics.types.js";

class AnalyticsController {
  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const supplierId = user.id;

      const range = (req.query.range as AnalyticsRange) || "30d";

      const allowedRanges: AnalyticsRange[] = ["7d", "30d", "90d"];

      if (!allowedRanges.includes(range)) {
        return res.status(400).json({
          error: "Invalid range. Allowed values: 7d, 30d, 90d",
        });
      }

      const data = await analyticsService.getAnalytics(supplierId, range);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

export default new AnalyticsController();
