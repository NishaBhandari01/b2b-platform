import express from "express";

import {
  createRFQ,
  getAllRFQs,
  getRFQById,
  createQuotation,
  updateQuotationStatus,
  updateRFQ,
  deleteRFQ,
  getRFQMessages,
  createMessage,
} from "../controller/rfq.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createRFQSchema,
  updateRFQSchema,
  createQuotationSchema,
  sendMessageSchema,
  updateQuotationStatusSchema,
} from "../validator/rfq.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: RFQ
 *   description: Request For Quotation management
 */

/**
 * @swagger
 * /api/rfq:
 *   post:
 *     summary: Create RFQ
 *     tags: [RFQ]
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
 *               - title
 *               - category
 *               - quantity
 *               - budget
 *               - deadline
 *               - description
 *
 *             properties:
 *               title:
 *                 type: string
 *                 example: Steel Rod Requirement
 *
 *               category:
 *                 type: string
 *                 example: Construction
 *
 *               quantity:
 *                 type: integer
 *                 example: 500
 *
 *               budget:
 *                 type: number
 *                 example: 10000
 *
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-12-31T00:00:00.000Z
 *
 *               description:
 *                 type: string
 *                 example: Need steel rods for construction project
 *
 *     responses:
 *       201:
 *         description: RFQ created
 */
router.post("/", authenticate, validate(createRFQSchema), createRFQ);

/**
 * @swagger
 * /api/rfq:
 *   get:
 *     summary: Get all RFQs
 *     tags: [RFQ]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: RFQs fetched successfully
 */
router.get("/", authenticate, getAllRFQs);

/**
 * @swagger
 * /api/rfq/{id}:
 *   get:
 *     summary: Get RFQ by ID
 *     tags: [RFQ]
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: RFQ details
 */
router.get("/:id", authenticate, getRFQById);

/**
 * @swagger
 * /api/rfq/{id}:
 *   patch:
 *     summary: Update RFQ
 *     tags: [RFQ]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *     responses:
 *       200:
 *         description: RFQ updated
 */
router.patch("/:id", authenticate, validate(updateRFQSchema), updateRFQ);

/**
 * @swagger
 * /api/rfq/{id}:
 *   delete:
 *     summary: Delete RFQ
 *     tags: [RFQ]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: RFQ deleted
 */
router.delete("/:id", authenticate, deleteRFQ);

/**
 * @swagger
 * /api/rfq/{id}/quotations:
 *   post:
 *     summary: Supplier submits quotation for RFQ
 *     tags: [RFQ]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: RFQ ID
 *         schema:
 *           type: string
 *
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - price
 *               - leadTime
 *               - message
 *
 *             properties:
 *               price:
 *                 type: number
 *                 example: 5000
 *
 *               leadTime:
 *                 type: string
 *                 example: 15 days
 *
 *               message:
 *                 type: string
 *                 example: We can supply this product
 *
 *
 *     responses:
 *       201:
 *         description: Quotation created successfully
 */
router.post(
  "/:id/quotations",
  authenticate,
  validate(createQuotationSchema),
  createQuotation,
);

/**
 * @swagger
 * /api/rfq/quotations/{id}/status:
 *   patch:
 *     summary: Update quotation status
 *     tags: [RFQ]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - accepted
 *                   - rejected
 *                 example: accepted
 *
 *
 *     responses:
 *       200:
 *         description: Quotation status updated
 */
router.patch(
  "/quotations/:id/status",
  authenticate,
  validate(updateQuotationStatusSchema),
  updateQuotationStatus,
);

/**
 * @swagger
 * /api/rfq/{id}/messages:
 *   get:
 *     summary: Get RFQ messages
 *     tags: [RFQ]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Messages fetched
 */
router.get("/:id/messages", authenticate, getRFQMessages);

/**
 * @swagger
 * /api/rfq/{id}/messages:
 *   post:
 *     summary: Send RFQ message
 *     tags: [RFQ]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: Can you provide delivery details?
 *
 *
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post(
  "/:id/messages",
  authenticate,
  validate(sendMessageSchema),
  createMessage,
);

export default router;
