// import { Router } from "express";

// import productController from "../controller/product.controller.js";
// import { authenticate } from "../middleware/auth.middleware.js";
// import { upload } from "../middleware/upload.middleware.js";

// const router = Router();

// // Create product draft
// router.post(
//   "/",
//   authenticate,
//   productController.create.bind(productController),
// );

// // Get supplier products
// router.get(
//   "/my-products",
//   authenticate,
//   productController.myProducts.bind(productController),
// );

// // Get single product
// router.get("/:id", authenticate, productController.get.bind(productController));

// // Update basic info
// router.patch(
//   "/:id",
//   authenticate,
//   productController.update.bind(productController),
// );

// // Upload image
// router.post(
//   "/:id/images",
//   authenticate,
//   upload.single("file"),
//   productController.uploadImage.bind(productController),
// );

// // Delete image
// router.delete(
//   "/:id/images/:imageId",
//   authenticate,
//   productController.deleteImage.bind(productController),
// );

// // Publish product
// router.post(
//   "/:id/publish",
//   authenticate,
//   productController.publish.bind(productController),
// );

// export default router;

import { Router } from "express";

import productController from "../controller/product.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Supplier product management APIs
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create product draft
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product draft created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  productController.create.bind(productController),
);

/**
 * @swagger
 * /api/products/my-products:
 *   get:
 *     summary: Get supplier products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supplier products fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/my-products",
  authenticate,
  productController.myProducts.bind(productController),
);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get single product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *       404:
 *         description: Product not found
 */
router.get("/:id", authenticate, productController.get.bind(productController));

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update product basic information
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch(
  "/:id",
  authenticate,
  productController.update.bind(productController),
);

/**
 * @swagger
 * /api/products/{id}/images:
 *   post:
 *     summary: Upload product image
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid file
 */
router.post(
  "/:id/images",
  authenticate,
  upload.single("file"),
  productController.uploadImage.bind(productController),
);

/**
 * @swagger
 * /api/products/{id}/images/{imageId}:
 *   delete:
 *     summary: Delete product image
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image deleted successfully
 */
router.delete(
  "/:id/images/:imageId",
  authenticate,
  productController.deleteImage.bind(productController),
);

/**
 * @swagger
 * /api/products/{id}/publish:
 *   post:
 *     summary: Publish product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product published successfully
 *       400:
 *         description: Product validation failed
 */
router.post(
  "/:id/publish",
  authenticate,
  productController.publish.bind(productController),
);

export default router;
