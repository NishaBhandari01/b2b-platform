import { RFQRepository } from "../repository/rfq.repository.js";
import { sendEmail } from "../utils/mail.js";
import { quotationReceivedTemplate } from "../templates/quotationReceived.js";
import prisma from "../config/db.js";
export class RFQService {
  private rfqRepository: RFQRepository;

  constructor() {
    this.rfqRepository = new RFQRepository();
  }

  async createRFQ(rfqData: {
    title: string;
    category: string;
    quantity: number;
    budget: number;
    deadline: Date;
    description: string;
    userId: string;
  }) {
    return await this.rfqRepository.createRFQ(rfqData);
  }

  async getRFQById(
    rfqId: string,
    includeQuotations = false,
    includeMessages = false,
  ) {
    return await this.rfqRepository.getRFQById(rfqId, {
      includeQuotations,
      includeMessages,
      includeUser: true,
    });
  }

  async getUserRFQs(userId: string, role: string) {
    return await this.rfqRepository.getUserRFQs(userId, role);
  }

  async updateRFQ(
    rfqId: string,
    buyerId: string,
    rfqData: {
      title?: string;
      category?: string;
      quantity?: number;
      budget?: number;
      deadline?: Date;
      description?: string;
    },
  ) {
    const rfq = await this.rfqRepository.getRFQById(rfqId);
    if (!rfq) {
      throw new Error("RFQ not found");
    }
    if (rfq.userId !== buyerId) {
      throw new Error("Only the RFQ owner can update this RFQ");
    }
    if (rfq.status === "closed") {
      throw new Error("Cannot update a closed RFQ");
    }

    return await this.rfqRepository.updateRFQ(rfqId, rfqData);
  }

  async deleteRFQ(rfqId: string, buyerId: string) {
    const rfq = await this.rfqRepository.getRFQById(rfqId);
    if (!rfq) {
      throw new Error("RFQ not found");
    }
    if (rfq.userId !== buyerId) {
      throw new Error("Only the RFQ owner can delete this RFQ");
    }

    return await this.rfqRepository.deleteRFQ(rfqId);
  }

  async getRFQMessages(rfqId: string, participantId: string) {
    return await this.rfqRepository.getRFQMessages(rfqId, participantId);
  }

  async createMessage(payload: {
    rfqId: string;
    senderId: string;
    receiverId: string;
    text: string;
  }) {
    const rfq = await this.rfqRepository.getRFQById(payload.rfqId);
    if (!rfq) {
      throw new Error("RFQ not found");
    }

    const isBuyerSender = payload.senderId === rfq.userId;
    const isBuyerReceiver = payload.receiverId === rfq.userId;

    if (!isBuyerSender && !isBuyerReceiver) {
      throw new Error("Message must involve the RFQ buyer");
    }

    return await this.rfqRepository.createMessage(payload);
  }

  async createQuotation(payload: {
    rfqId: string;
    supplierId: string;
    price: number;
    leadTime: string;
    message: string;
  }) {
    console.log("🚀 RFQService.createQuotation() called");

    const rfq = await this.rfqRepository.getRFQById(payload.rfqId);

    if (!rfq) {
      throw new Error("RFQ not found");
    }

    if (rfq.status !== "published") {
      throw new Error("Cannot submit a quotation for a closed RFQ");
    }

    const alreadyQuoted = await this.rfqRepository.hasSupplierQuotation(
      payload.rfqId,
      payload.supplierId,
    );

    // Uncomment if you want to prevent duplicate quotations
    // if (alreadyQuoted) {
    //   throw new Error("A quotation has already been submitted by this supplier");
    // }

    const quotation = await this.rfqRepository.createQuotation(payload);

    console.log("✅ Quotation saved");

    // Get buyer and supplier
    const buyer = await prisma.user.findUnique({
      where: {
        id: rfq.userId,
      },
    });

    console.log("Buyer:", buyer);

    const supplier = await prisma.user.findUnique({
      where: {
        id: payload.supplierId,
      },
    });

    console.log("Supplier:", supplier);

    if (buyer && supplier) {
      try {
        console.log("📧 Sending quotation email...");

        await sendEmail(
          buyer.email,
          "📨 New Quotation Received",
          quotationReceivedTemplate({
            buyerName: buyer.name,
            supplierName: supplier.name,
            rfqTitle: rfq.title,
            price: payload.price,
            leadTime: payload.leadTime,
            message: payload.message,
            // quotationUrl: `${process.env.FRONTEND_URL}/buyer/dashboard`,
            quotationUrl: `${process.env.FRONTEND_URL}/buyer/rfqs`,
          }),
        );

        console.log("✅ Buyer email sent");
      } catch (error) {
        console.error("❌ Email failed");
        console.error(error);
      }
    }

    return quotation;
  }
  async updateQuotationStatus(
    quotationId: string,
    buyerId: string,
    status: "accepted" | "rejected",
  ) {
    const quotation = await this.rfqRepository.getQuotationById(quotationId);

    if (!quotation) {
      throw new Error("Quotation not found");
    }
    if (quotation.rfq.userId !== buyerId) {
      throw new Error("Only the RFQ owner can update quotation status");
    }
    if (quotation.status !== "pending") {
      throw new Error("Quotation status can only be changed once");
    }

    const updatedQuotation = await this.rfqRepository.updateQuotationStatus(
      quotationId,
      status,
    );

    if (status === "accepted") {
      await this.rfqRepository.closeRFQ(quotation.rfqId);
    }

    return updatedQuotation;
  }
}
