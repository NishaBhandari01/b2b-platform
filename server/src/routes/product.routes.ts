import express from "express";
import multer from "multer";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { productController } from "../controller/product.controller.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validator/product.validator.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  productController.uploadFile.bind(productController),
);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Industrial Water Pump
 *               category:
 *                 type: string
 *                 example: Machinery
 *               subCategory:
 *                 type: string
 *                 example: Water Pumps
 *               brand:
 *                 type: string
 *                 example: Kirloskar
 *               modelNumber:
 *                 type: string
 *                 example: KWP-500
 *               sku:
 *                 type: string
 *                 example: PUMP-001
 *               status:
 *                 type: string
 *                 enum:
 *                   - draft
 *                   - active
 *                   - out_of_stock
 *                   - archived
 *               shortDescription:
 *                 type: string
 *                 example: High-performance industrial water pump.
 *               description:
 *                 type: string
 *                 example: Heavy-duty industrial water pump suitable for factories.
 *               priceType:
 *                 type: string
 *                 enum:
 *                   - fixed
 *                   - range
 *                   - rfq
 *               currency:
 *                 type: string
 *                 example: USD
 *               price:
 *                 type: number
 *                 example: 250
 *               minPrice:
 *                 type: number
 *                 example: 200
 *               maxPrice:
 *                 type: number
 *                 example: 300
 *               unit:
 *                 type: string
 *                 example: Piece
 *               minOrderQty:
 *                 type: integer
 *                 example: 10
 *               specifications:
 *                 type: object
 *                 example:
 *                   Material: Stainless Steel
 *                   Voltage: 220V
 *               shippingInfo:
 *                 type: object
 *                 example:
 *                   country: Nepal
 *                   dispatchTime: 5 Days
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - ISO
 *                   - CE
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - pump
 *                   - industrial
 *               seoTitle:
 *                 type: string
 *                 example: Industrial Water Pump
 *               seoDescription:
 *                 type: string
 *                 example: Best industrial water pumps for factories.
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  validate(createProductSchema),
  productController.createProduct.bind(productController),
);

/**
 * @swagger
 * /api/products/my-products:
 *   get:
 *     summary: Get all products of the logged-in supplier
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of supplier products
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/my-products",
  authenticate,
  productController.getSupplierProducts.bind(productController),
);

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     summary: Get product details by ID
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: cmf3sd5t20000j4abc123xyz
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:productId",
  authenticate,
  productController.getProductById.bind(productController),
);

/**
 * @swagger
 * /api/products/slug/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: industrial-water-pump
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get(
  "/slug/:slug",
  productController.getProductBySlug.bind(productController),
);

/**
 * @swagger
 * /api/products/{productId}:
 *   patch:
 *     summary: Update supplier product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrn9ed99000061n0lh24uxq4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: Updated Industrial Water Pump
 *               price: 300
 *               description: Updated product description
 *               status: draft
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.patch(
  "/:productId",
  authenticate,
  validate(updateProductSchema),
  productController.updateProduct.bind(productController),
);

/**
 * @swagger
 * /api/products/{productId}:
 *   delete:
 *     summary: Soft delete product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrn9ed99000061n0lh24uxq4
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.delete(
  "/:productId",
  authenticate,
  productController.deleteProduct.bind(productController),
);

/**
 * @swagger
 * /api/products/{productId}/publish:
 *   patch:
 *     summary: Publish product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrn9ed99000061n0lh24uxq4
 *     responses:
 *       200:
 *         description: Product published successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.patch(
  "/:productId/publish",
  authenticate,
  productController.publishProduct.bind(productController),
);

export default router;
