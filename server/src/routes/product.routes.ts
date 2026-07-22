import { Router } from "express";

import productController from "../controller/product.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

// Create product draft
router.post(
  "/",
  authenticate,
  productController.create.bind(productController),
);

// Get supplier products
router.get(
  "/my-products",
  authenticate,
  productController.myProducts.bind(productController),
);

// Get single product
router.get("/:id", authenticate, productController.get.bind(productController));

// Update basic info
router.patch(
  "/:id",
  authenticate,
  productController.update.bind(productController),
);

// Upload image
router.post(
  "/:id/images",
  authenticate,
  upload.single("file"),
  productController.uploadImage.bind(productController),
);

// Delete image
router.delete(
  "/:id/images/:imageId",
  authenticate,
  productController.deleteImage.bind(productController),
);

// Publish product
router.post(
  "/:id/publish",
  authenticate,
  productController.publish.bind(productController),
);

export default router;
