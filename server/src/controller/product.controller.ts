import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import productService from "../services/product.service.js";

class ProductController {
  async create(req: AuthRequest, res: Response) {
    try {
      const supplierId = req.user!.id;

      const product = await productService.createDraft(supplierId, req.body);

      return res.status(201).json({
        success: true,
        message: "Product draft created",
        data: product,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async get(req: AuthRequest, res: Response) {
    try {
      const supplierId = req.user!.id;
      const productId = req.params.id as string;

      const product = await productService.getProduct(productId, supplierId);

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const supplierId = req.user!.id;
      const productId = req.params.id as string;

      const product = await productService.updateBasicInfo(
        productId,
        supplierId,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Product updated",
        data: product,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async publish(req: AuthRequest, res: Response) {
    try {
      const supplierId = req.user!.id;
      const productId = req.params.id as string;

      const product = await productService.publishProduct(
        productId,
        supplierId,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Product published",
        data: product,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async uploadImage(req: AuthRequest, res: Response) {
    try {
      const supplierId = req.user!.id;
      const productId = req.params.id as string;

      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No file provided",
        });
      }

      const isPrimary = req.body.isPrimary === "true";

      const image = await productService.uploadImage(
        productId,
        supplierId,
        file,
        isPrimary,
      );

      return res.status(200).json({
        success: true,
        message: "Image uploaded",
        data: image,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async myProducts(req: AuthRequest, res: Response) {
    try {
      const supplierId = req.user!.id;

      const products = await productService.getSupplierProducts(supplierId);

      return res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async deleteImage(req: AuthRequest, res: Response) {
    try {
      const supplierId = req.user!.id;
      const productId = req.params.id as string;
      const imageId = req.params.imageId as string;

      await productService.deleteImage(productId, supplierId, imageId);

      return res.status(200).json({
        success: true,
        message: "Image removed",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteProduct(req: AuthRequest, res: Response) {
    try {
      const supplierId = req.user!.id;
      const id = req.params.id as string;

      await productService.deleteProduct(id, supplierId);

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new ProductController();
