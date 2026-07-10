import { RFQRepository } from "../repository/rfq.repository.js";

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

  async getRFQById(rfqId: string, includeQuotations = false) {
    return await this.rfqRepository.getRFQById(rfqId, includeQuotations);
  }

  async getUserRFQs(userId: string, role: string) {
    return await this.rfqRepository.getUserRFQs(userId, role);
  }

  async createQuotation(payload: {
    rfqId: string;
    supplierId: string;
    price: number;
    leadTime: string;
    message: string;
  }) {
    const rfq = await this.rfqRepository.getRFQById(payload.rfqId);
    if (!rfq) {
      throw new Error("RFQ not found");
    }
    if (rfq.status !== "published") {
      throw new Error("Cannot submit a quotation for a closed RFQ");
    }

    return await this.rfqRepository.createQuotation(payload);
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
