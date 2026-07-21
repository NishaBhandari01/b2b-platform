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
 * /api/orders/supplier:
 *   get:
 *     summary: Get orders received by supplier
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Supplier orders fetched successfully
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
