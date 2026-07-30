// src/routes/analytics.routes.ts

import { Router } from "express";
import analyticsController from "../controller/analytics.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/supplier/analytics:
 *   get:
 *     tags:
 *       - Supplier Analytics
 *     summary: Get supplier performance analytics
 *     description: Returns KPIs, revenue trend, RFQ volume, and top performing products for the authenticated supplier.
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d]
 *           default: 30d
 *         description: Time range for the analytics data
 *         required: false
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 kpis:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         example: "RFQs responded"
 *                       value:
 *                         type: string
 *                         example: "412"
 *                       change:
 *                         type: number
 *                         example: 15.1
 *                       icon:
 *                         type: string
 *                         enum: [Inbox, FileText, Trophy, Clock]
 *                 revenue:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "Jul"
 *                       value:
 *                         type: number
 *                         example: 184500
 *                 rfqVolume:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       week:
 *                         type: string
 *                         example: "Wk 1"
 *                       responded:
 *                         type: number
 *                         example: 46
 *                       won:
 *                         type: number
 *                         example: 12
 *                 topProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "SS304 Seamless Pipes"
 *                       views:
 *                         type: number
 *                         example: 842
 *                       rfqs:
 *                         type: number
 *                         example: 46
 *                       winRate:
 *                         type: number
 *                         example: 39
 *       400:
 *         description: Invalid range parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid range. Allowed values: 7d, 30d, 90d"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 */
router.get("/analytics", authenticate, (req, res, next) =>
  analyticsController.getAnalytics(req, res, next),
);

export default router;
