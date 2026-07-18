import { Response, NextFunction } from "express";

import { AuthRequest } from "../middleware/auth.middleware.js";
import { productService } from "../services/product.service.js";
import fs from "fs";
import path from "path";
import { getBucket, isFirebaseConfigured } from "../config/firebase.js";

export class ProductController {
  /**
   * Upload file (Images/Videos/Documents)
   */
  async uploadFile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded.",
        });
      }

      const supplierId = req.user!.id;

      if (isFirebaseConfigured) {
        const bucket = getBucket();
        if (!bucket) {
          throw new Error("Firebase bucket not found.");
        }

        const filename = `products/${supplierId}/${Date.now()}_${file.originalname}`;
        const fileRef = bucket.file(filename);

        await fileRef.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
          },
        });

        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media`;

        return res.status(200).json({
          success: true,
          url: publicUrl,
          publicId: filename,
        });
      } else {
        // Local fallback
        const uploadsDir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filename = `${Date.now()}_${file.originalname}`;
        const filepath = path.join(uploadsDir, filename);

        await fs.promises.writeFile(filepath, file.buffer);

        const protocol = req.protocol;
        const host = req.get("host");
        const publicUrl = `${protocol}://${host}/uploads/${filename}`;

        return res.status(200).json({
          success: true,
          url: publicUrl,
          publicId: filename,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create Product
   */
  async createProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const supplierId = req.user!.id;
      console.log("PRODUCT BODY:", req.body);
      const product = await productService.createProduct(supplierId, req.body);
      console.log("PRODUCT BODY:", req.body);

      return res.status(201).json({
        success: true,
        message: "Product created successfully.",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Product By ID
   */
  async getProductById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(
        req.params.productId as string,
      );

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Logged-in Supplier Products
   */
  async getSupplierProducts(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const supplierId = req.user!.id;

      const products = await productService.getSupplierProducts(supplierId);

      return res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Product By Slug
   */
  async getProductBySlug(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductBySlug(
        req.params.slug as string,
      );

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Product
   */
  async updateProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const supplierId = req.user!.id;

      const product = await productService.updateProduct(
        req.params.productId as string,
        supplierId,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete Product
   */
  async deleteProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const supplierId = req.user!.id;

      const product = await productService.deleteProduct(
        req.params.productId as string,
        supplierId,
      );

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish Product
   */
  async publishProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const supplierId = req.user!.id;

      const product = await productService.publishProduct(
        req.params.productId as string,
        supplierId,
      );

      return res.status(200).json({
        success: true,
        message: "Product published successfully.",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
