// import express from "express";
// import rfqController from "../controller/rfq.controller.js";

// const router = express.Router();

// /**
//  * @swagger
//  * /api/rfq:
//  *   post:
//  *     summary: Create a new RFQ
//  *     tags:
//  *       - RFQ
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - title
//  *               - category
//  *               - quantity
//  *               - budget
//  *               - deadline
//  *               - description
//  *             properties:
//  *               title:
//  *                 type: string
//  *                 example: "RFQ for 100 units of Product X"
//  *               category:
//  *                 type: string
//  *                 example: "Electronics"
//  *               quantity:
//  *                 type: integer
//  *                 example: 100
//  *               budget:
//  *                 type: number
//  *                 example: 5000
//  *               deadline:
//  *                 type: string
//  *                 format: date-time
//  *                 example: "2026-12-31T23:59:59.000Z"
//  *               description:
//  *                 type: string
//  *                 example: "We are looking for suppliers to provide 100 units of Product X by the end of the year."
//  *     responses:
//  *       201:
//  *         description: RFQ created successfully.
//  *       400:
//  *         description: Bad Request.
//  *       500:
//  *         description: Internal Server Error.
//  */

// router.post("/", (req, res) => rfqController.createRFQ(req, res));

// export default router;

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
 * /api/rfq:
 *   post:
 *     summary: Create a new RFQ
 *     description: Creates a new Request for Quotation (RFQ). Authentication is required.
 *     tags:
 *       - RFQ
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Steel Rods"
 *               category:
 *                 type: string
 *                 example: "Construction"
 *               quantity:
 *                 type: integer
 *                 example: 500
 *               budget:
 *                 type: number
 *                 example: 10000
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-08-01T00:00:00.000Z"
 *               description:
 *                 type: string
 *                 example: "Need 500 steel rods for bridge construction."
 *     responses:
 *       201:
 *         description: RFQ created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "RFQ created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "cmrbueieh0000gl90x75ifhqw"
 *                     title:
 *                       type: string
 *                     category:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     budget:
 *                       type: number
 *                     deadline:
 *                       type: string
 *                       format: date-time
 *                     description:
 *                       type: string
 *                     userId:
 *                       type: string
 *
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: object
 *
 *       401:
 *         description: Unauthorized or Invalid Token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *
 *       500:
 *         description: Internal Server Error
 */

router.post("/", authenticate, validate(createRFQSchema), createRFQ);
router.get("/", authenticate, getAllRFQs);
router.get("/:id", authenticate, getRFQById);
router.patch("/:id", authenticate, validate(updateRFQSchema), updateRFQ);
router.delete("/:id", authenticate, deleteRFQ);
router.post(
  "/:id/quotations",
  authenticate,
  validate(createQuotationSchema),
  createQuotation,
);
router.patch(
  "/quotations/:id/status",
  authenticate,
  validate(updateQuotationStatusSchema),
  updateQuotationStatus,
);
router.get("/:id/messages", authenticate, getRFQMessages);
router.post(
  "/:id/messages",
  authenticate,
  validate(sendMessageSchema),
  createMessage,
);

export default router;
