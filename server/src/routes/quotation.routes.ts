import express from "express";
import {
  createQuotation,
  listQuotationsByRFQ,
  acceptQuotation,
  rejectQuotation,
} from "../controller/quotation.controller";
import { validate } from "../middleware/validate.middleware.js";
import { createQuotationSchema } from "../validator/rfq.validator.js";

const router = express.Router();

// List quotations for a specific RFQ
router.get("/:rfqId", async (req, res) => {
  const { rfqId } = req.params;
  const result = await listQuotationsByRFQ(rfqId);
  res.json(result);
});

// Create a new quotation (supplier side)
router.post("/", validate(createQuotationSchema), async (req, res) => {
  const payload = req.body;
  const result = await createQuotation(payload);
  res.status(201).json(result);
});

// Accept quotation
router.patch("/:id/accept", async (req, res) => {
  const { id } = req.params;
  const result = await acceptQuotation(id);
  res.json(result);
});

// Reject quotation
router.patch("/:id/reject", async (req, res) => {
  const { id } = req.params;
  const result = await rejectQuotation(id);
  res.json(result);
});

export default router;
