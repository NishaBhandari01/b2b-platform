import express from "express";

import {
  createQuotation,
  listQuotationsByRFQ,
  acceptQuotation,
  rejectQuotation,
} from "../controller/quotation.controller.js";

import { validate } from "../middleware/validate.middleware.js";
import { createQuotationSchema } from "../validator/rfq.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quotations
 *   description: RFQ quotation management
 */

/**
 * @swagger
 * /api/quotations/{rfqId}:
 *   get:
 *     summary: Get quotations of an RFQ
 *     tags: [Quotations]
 *     parameters:
 *       - in: path
 *         name: rfqId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quotations fetched successfully
 */
router.get("/:rfqId", listQuotationsByRFQ);

/**
 * @swagger
 * /api/quotations:
 *   post:
 *     summary: Supplier creates quotation
 *     tags: [Quotations]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rfqId
 *               - price
 *               - leadTime
 *               - message
 *
 *             properties:
 *               rfqId:
 *                 type: string
 *                 example: cmrq676lx0001burnlha4ba0v
 *
 *               price:
 *                 type: number
 *                 example: 5000
 *
 *               leadTime:
 *                 type: string
 *                 example: "15 days"
 *
 *               message:
 *                 type: string
 *                 example: "We can supply this product"
 *
 *     responses:
 *       201:
 *         description: Quotation created
 */
router.post(
  "/",
  authenticate,
  validate(createQuotationSchema),
  createQuotation,
);

/**
 * @swagger
 * /api/quotations/{id}/accept:
 *   patch:
 *     summary: Accept quotation
 *     tags: [Quotations]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Quotation accepted
 */
router.patch("/:id/accept", authenticate, acceptQuotation);

/**
 * @swagger
 * /api/quotations/{id}/reject:
 *   patch:
 *     summary: Reject quotation
 *     tags: [Quotations]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Quotation rejected
 */
router.patch("/:id/reject", authenticate, rejectQuotation);

export default router;
