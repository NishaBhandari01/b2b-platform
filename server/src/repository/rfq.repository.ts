import prisma from "../config/db.js";

export class RFQRepository {
  async createRFQ(rfqData: {
    userId: string;
    title: string;
    category: string;
    quantity: number;
    budget: number;
    deadline: Date;
    description: string;
  }) {
    return await prisma.rfq.create({
      data: rfqData,
    });
  }

  async getRFQById(rfqId: string, includeQuotations = false) {
    return await prisma.rfq.findUnique({
      where: {
        id: rfqId,
      },
      include: includeQuotations
        ? {
            quotations: {
              include: {
                supplier: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          }
        : undefined,
    });
  }

  async getUserRFQs(userId: string, role: string) {
    if (role === "buyer") {
      return await prisma.rfq.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: {
              quotations: true,
            },
          },
        },
      });
    }

    return await prisma.rfq.findMany({
      where: {
        status: "published",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            quotations: true,
          },
        },
      },
    });
  }

  async createQuotation(quotationData: {
    rfqId: string;
    supplierId: string;
    price: number;
    leadTime: string;
    message: string;
  }) {
    return await prisma.quotation.create({
      data: quotationData,
    });
  }

  async getQuotationById(quotationId: string) {
    return await prisma.quotation.findUnique({
      where: {
        id: quotationId,
      },
      include: {
        rfq: true,
      },
    });
  }

  async updateQuotationStatus(
    quotationId: string,
    status: "accepted" | "rejected",
  ) {
    return await prisma.quotation.update({
      where: {
        id: quotationId,
      },
      data: {
        status,
      },
    });
  }

  async closeRFQ(rfqId: string) {
    return await prisma.rfq.update({
      where: {
        id: rfqId,
      },
      data: {
        status: "closed",
      },
    });
  }
}

export default new RFQRepository();
