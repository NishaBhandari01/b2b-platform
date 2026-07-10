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
    const rfqId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!rfqId) {
      return res.status(400).json({
        success: false,
        message: "Invalid RFQ id",
      });
    }

    const rfq = await rfqService.getRFQById(rfqId);

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
      message: "",
    });
  }
};
