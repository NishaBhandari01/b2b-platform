import prisma from "../config/db.js";

class OrderRepository {
  async create(data: any) {
    return prisma.order.create({
      data,

      include: {
        quotation: {
          include: {
            rfq: true,
          },
        },
        buyer: true,
        supplier: true,
      },
    });
  }

  async getBuyerOrders(userId: string) {
    return prisma.order.findMany({
      where: {
        buyerId: userId,
      },

      include: {
        quotation: {
          include: {
            rfq: true,
          },
        },
        supplier: true,
      },
    });
  }

  async findSupplierOrders(userId: string) {
    return prisma.order.findMany({
      where: {
        supplierId: userId,
      },
      include: {
        quatation: {
          include: {
            ref: true,
          },
        },
        buyer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        quatation: true,
        buyer: true,
        supplier: true,
      },
    });
  }

  async updateStatus(id: string, status: any) {
    return prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
}

export default new OrderRepository();
