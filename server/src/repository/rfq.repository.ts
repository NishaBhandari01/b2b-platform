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

  async getRFQById(rfqId: string) {
    return await prisma.rfq.findUnique({
      where: {
        id: rfqId,
      },
    });
  }

  async getAllRFQs() {
    return await prisma.rfq.findMany();
  }
}

export default new RFQRepository();
