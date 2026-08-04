import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import orderService from "../services/order.service.js";

class OrderController {
  // POST /api/orders
  async create(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== "buyer") {
        return res.status(403).json({
          success: false,
          message: "Only buyers can create orders",
        });
      }

      const { quotationId } = req.body;

      if (!quotationId) {
        return res.status(400).json({
          success: false,
          message: "quotationId is required",
        });
      }

      const order = await orderService.createOrder(quotationId, req.user.id);

      return res.status(201).json({
        success: true,

        message: "Order created successfully",

        data: order,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,

        message: error.message,
      });
    }
  }

  // GET /api/orders/buyer
  async buyerOrders(req: AuthRequest, res: Response) {
    try {
      const orders = await orderService.getBuyerOrders(req.user!.id);

      res.json({
        success: true,

        data: orders,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  // GET /api/orders/supplier
  async supplierOrders(req: AuthRequest, res: Response) {
    try {
      const { status } = req.query;

      const orders =
        status && status !== "all"
          ? await orderService.getSupplierOrdersByStatus(
              req.user!.id,
              status as string,
            )
          : await orderService.getSupplierOrders(req.user!.id);

      res.json({
        success: true,
        data: orders,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // PATCH /api/orders/:id/status
  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,

          message: "Status is required",
        });
      }

      const order = await orderService.changeStatus(
        req.params.id as string,

        status,
      );

      return res.json({
        success: true,

        message: "Order status updated",

        data: order,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,

        message: error.message,
      });
    }
  }

  async supplierOrderStats(req: AuthRequest, res: Response) {
    try {
      const stats = await orderService.getSupplierOrderStats(req.user!.id);

      return res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new OrderController();
