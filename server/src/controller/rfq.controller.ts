// import { RFQService } from "../services/rfq.service.js";
// import { Request, Response } from "express";

// const rfqService = new RFQService();

// export const createRFQ = async (req: Request, res: Response) => {
//   try {
//     const rfq = await rfqService.createRFQ(req.body);
//     res.status(201).json({
//       success: true,
//       message: "RFQ created successfully",
//       data: rfq,
//     });
//   } catch (error) {
//     res.status(400).json({ error: (error as Error).message });
//   }
// };

// export default {
//   createRFQ,
// };

import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { RFQService } from "../services/rfq.service.js";

const rfqService = new RFQService();

export const createRFQ = async (req: AuthRequest, res: Response) => {
  try {
    const rfq = await rfqService.createRFQ({
      ...req.body,
      userId: req.user!.id,
    });

    return res.status(201).json({
      success: true,
      message: "RFQ created successfully",
      data: rfq,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: (err as Error).message,
    });
  }
};

export const getRFQById = async (req: AuthRequest, res: Response) => {
  try {
    const rfqId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!rfqId) {
      return res.status(400).json({
        success: false,
        message: "Invalid RFQ id",
      });
    }

    const includeQuotes = req.user?.role === "buyer";
    const rfq = await rfqService.getRFQById(rfqId, includeQuotes);

    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rfq,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: (err as Error).message,
    });
  }
};

export const getAllRFQs = async (req: AuthRequest, res: Response) => {
  try {
    const rfqs = await rfqService.getUserRFQs(req.user!.id, req.user!.role);

    return res.status(200).json({
      success: true,
      data: rfqs,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: (err as Error).message,
    });
  }
};

export const createQuotation = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "supplier") {
      return res.status(403).json({
        success: false,
        message: "Only suppliers can submit quotations",
      });
    }

    const rfqId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const quotation = await rfqService.createQuotation({
      rfqId,
      supplierId: req.user!.id,
      price: req.body.price,
      leadTime: req.body.leadTime,
      message: req.body.message,
    });

    return res.status(201).json({
      success: true,
      message: "Quotation submitted successfully",
      data: quotation,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: (err as Error).message,
    });
  }
};

export const updateQuotationStatus = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (req.user?.role !== "buyer") {
      return res.status(403).json({
        success: false,
        message: "Only buyers can accept or reject quotations",
      });
    }

    const quotationId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const updatedQuotation = await rfqService.updateQuotationStatus(
      quotationId,
      req.user!.id,
      req.body.status,
    );

    return res.status(200).json({
      success: true,
      message: "Quotation status updated",
      data: updatedQuotation,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: (err as Error).message,
    });
  }
};
