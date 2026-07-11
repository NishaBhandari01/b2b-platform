import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { QuotationService } from '../services/quotation.service';
import { ConversationService } from '../services/conversation.service';

const quotationService = new QuotationService();
const conversationService = new ConversationService();

// GET /api/quotations/:rfqId - list quotations for an RFQ
export const listQuotationsByRFQ = async (req: Request, res: Response) => {
  try {
    const { rfqId } = req.params;
    const quotes = await quotationService.listByRFQ(rfqId);
    res.json({ success: true, data: quotes });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

// POST /api/quotations - create a quotation (supplier side)
export const createQuotation = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'supplier') {
      return res.status(403).json({ success: false, message: 'Only suppliers can submit quotations' });
    }
    const { rfqId, price, leadTime, message } = req.body;
    const supplierId = req.user!.id;
    // Create quotation and associated conversation (if not existing)
    const quotation = await quotationService.createQuotation({ rfqId, supplierId, price, leadTime, message });
    // Ensure a conversation exists for this quotation
    await conversationService.getOrCreateConversation(rfqId, supplierId);
    res.status(201).json({ success: true, message: 'Quotation submitted successfully', data: quotation });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

// PATCH /api/quotations/:id/accept - accept a quotation (buyer side)
export const acceptQuotation = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'buyer') {
      return res.status(403).json({ success: false, message: 'Only buyers can accept quotations' });
    }
    const { id } = req.params;
    const buyerId = req.user!.id;
    const acceptedQuotation = await quotationService.acceptQuotation(id, buyerId);
    res.json({ success: true, message: 'Quotation accepted', data: acceptedQuotation });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

// PATCH /api/quotations/:id/reject - reject a quotation (buyer side)
export const rejectQuotation = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'buyer') {
      return res.status(403).json({ success: false, message: 'Only buyers can reject quotations' });
    }
    const { id } = req.params;
    const buyerId = req.user!.id;
    const rejectedQuotation = await quotationService.rejectQuotation(id, buyerId);
    res.json({ success: true, message: 'Quotation rejected', data: rejectedQuotation });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};
