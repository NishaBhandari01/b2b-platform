import prisma from "../config/db.js";
import orderRepository from "../repository/order.repository.js";

class OrderService {
  async createOrder(quotationId: string, buyerId: string) {
    const quotation = await prisma.quotation.findUnique({
      where: {
        id: quotationId,
      },

      include: {
        order: true,
      },
    });

    if (!quotation) {
      throw new Error("Quotation not found");
    }

    // check order already exists

    if (quotation.order) {
      throw new Error("Order already created");
    }

    // quotation must be accepted first

    if (quotation.status !== "accepted") {
      throw new Error("Only accepted quotation can create order");
    }

    return orderRepository.create({
      quotationId,

      rfqId: quotation.rfqId,

      buyerId,

      supplierId: quotation.supplierId,

      amount: quotation.price,
    });
  }

  async getBuyerOrders(userId: string) {
    return orderRepository.getBuyerOrders(userId);
  }

  async getSupplierOrders(userId: string) {
    return orderRepository.findSupplierOrders(userId);
  }

  async changeStatus(id: string, status: string) {
    const allowed = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowed.includes(status)) {
      throw new Error("Invalid order status");
    }

    return orderRepository.updateStatus(id, status);
  }

  async getSupplierOrderStats(userId: string) {
    return orderRepository.getSupplierOrderStats(userId);
  }

  async getSupplierOrdersByStatus(userId: string, status?: string) {
    return orderRepository.getSupplierOrdersByStatus(userId, status);
  }
}

export default new OrderService();
