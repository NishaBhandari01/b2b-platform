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

  async getRFQById(rfqId: string) {
    return await this.rfqRepository.getRFQById(rfqId);
  }

  async getAllRFQs() {
    return await this.rfqRepository.getAllRFQs();
  }
}
