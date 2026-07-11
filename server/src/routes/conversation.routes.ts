import express from 'express';
import {
  getOrCreateConversation,
  listConversations,
} from '../controller/conversation.controller.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';

const router = express.Router();

// All conversation routes require authentication
router.use(authenticate);

// GET /api/conversations
// Lists all conversations for the authenticated user
router.get('/', async (req, res) => {
  await listConversations(req as AuthRequest, res);
});

// GET /api/conversations/:rfqId/:supplierId
// Returns existing or creates new conversation for a quotation
router.get('/:rfqId/:supplierId', async (req, res) => {
  await getOrCreateConversation(req as AuthRequest, res);
});

export default router;
