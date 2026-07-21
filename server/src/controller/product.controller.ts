import { Response, NextFunction } from "express";

import { AuthRequest } from "../middleware/auth.middleware.js";
import { productService } from "../services/product.service.js";

import { PutObjectCommand } from "@aws-sdk/client-s3";

import { r2, bucketName } from "../config/r2.js";

export class ProductController {
  /**
   * Upload file (Images/Videos/Documents)
   */
  // async uploadFile(req: AuthRequest, res: Response, next: NextFunction) {
  //   try {
  //     const file = req.file;
  //     if (!file) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "No file uploaded.",
  //       });
  //     }

  //     const supplierId = req.user!.id;
  //     const filename = `products/${supplierId}/${Date.now()}_${file.originalname}`;

  //     await r2.send(
  //       new PutObjectCommand({
  //         Bucket: bucketName,
  //         Key: filename,
  //         Body: file.buffer,
  //         ContentType: file.mimetype,
  //       }),
  //     );

  //     // Using the R2 endpoint as the base for the URL for now
  //     // This may not work if the bucket is not public without a custom domain.
  //     // But it is standard practice to return the object URL.
  //     const publicUrl = `${process.env.R2_ENDPOINT}/${bucketName}/${filename}`;

  //     return res.status(200).json({
  //       success: true,
  //       url: publicUrl,
  //       publicId: filename,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async uploadFile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const supplierId = req.user!.id;

      const uploadedFiles = [];

      for (const file of files) {
        const filename = `products/${supplierId}/${Date.now()}-${file.originalname}`;

        await r2.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: filename,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );

        uploadedFiles.push({
          url: `${process.env.R2_ENDPOINT}/${filename}`,

          publicId: filename,

          type: file.mimetype,
        });
      }

      return res.status(200).json({
        success: true,
        files: uploadedFiles,
      });
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
