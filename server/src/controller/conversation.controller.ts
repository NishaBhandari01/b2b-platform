import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { ConversationService } from '../services/conversation.service.js';

const conversationService = new ConversationService();

// GET /api/conversations/:rfqId/:supplierId
// Returns existing or creates new conversation for the quotation
export const getOrCreateConversation = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { rfqId, supplierId } = req.params;
    const conversation = await conversationService.getOrCreateConversation(
      rfqId,
      supplierId,
    );
    res.json({ success: true, data: conversation });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

// GET /api/conversations
// Lists all conversations for the authenticated user with unread counts
export const listConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const conversations =
      await conversationService.listConversationsForUser(userId);
    res.json({ success: true, data: conversations });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};
