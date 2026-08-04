import express from "express";
import orderController from "../controller/order.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Manage buyer and supplier orders
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create order manually from accepted quotation
 *     description: Creates an order using an accepted quotation.
 *     tags: [Orders]
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
 *               - quotationId
 *             properties:
 *               quotationId:
 *                 type: string
 *                 example: cmrq676lx0001burnlha4ba0v
 *
 *     responses:
 *       201:
 *         description: Order created successfully
 *
 *       400:
 *         description: Invalid quotation
 *
 *       401:
 *         description: Unauthorized
 */
router.post("/", orderController.create);

/**
 * @swagger
 * /api/orders/buyer:
 *   get:
 *     summary: Get orders placed by buyer
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Buyer orders fetched successfully
 */
router.get("/buyer", orderController.buyerOrders);

/**
 * @swagger
 * /api/orders/supplier/stats:
 *   get:
 *     summary: Get supplier order statistics
 *     description: Returns summary statistics for the logged-in supplier's orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Supplier order statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 24
 *                     pending:
 *                       type: integer
 *                       example: 6
 *                     confirmed:
 *                       type: integer
 *                       example: 4
 *                     processing:
 *                       type: integer
 *                       example: 5
 *                     shipped:
 *                       type: integer
 *                       example: 3
 *                     delivered:
 *                       type: integer
 *                       example: 5
 *                     cancelled:
 *                       type: integer
 *                       example: 1
 *
 *       401:
 *         description: Unauthorized
 */
router.get("/supplier/stats", orderController.supplierOrderStats);

/**
 * @swagger
 * /api/orders/supplier:
 *   get:
 *     summary: Get orders received by supplier
 *     description: Returns all supplier orders or filters them by status.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - confirmed
 *             - processing
 *             - shipped
 *             - delivered
 *             - cancelled
 *             - all
 *         example: pending
 *         description: Filter orders by status.
 *
 *     responses:
 *       200:
 *         description: Supplier orders fetched successfully
 *
 *       401:
 *         description: Unauthorized
 */
router.get("/supplier", orderController.supplierOrders);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrq676lx0001burnlha4ba0v
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - confirmed
 *                   - processing
 *                   - shipped
 *                   - delivered
 *                   - cancelled
 *                 example: confirmed
 *
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *
 *       400:
 *         description: Invalid status
 */
router.patch("/:id/status", orderController.updateStatus);

export default router;
