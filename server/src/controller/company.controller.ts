// import { Response } from "express";
// import { AuthRequest } from "../middleware/auth.middleware.js";
// import companyService from "../services/company.service.js";
// class CompanyController {
//   async createCompany(req: AuthRequest, res: Response) {
//     try {
//       const userId = req.user!.id;

//       const company = await companyService.createCompanyProfile(
//         userId,
//         req.body,
//       );

//       return res.status(201).json({
//         success: true,

//         message: "Company profile created successfully",

//         data: company,
//       });
//     } catch (error: any) {
//       return res.status(400).json({
//         success: false,

//         message: error.message,
//       });
//     }
//   }

//   async getCompany(req: AuthRequest, res: Response) {
//     try {
//       const userId = req.user!.id;

//       const company = await companyService.getCompanyProfile(userId);

//       return res.status(200).json({
//         success: true,

//         data: company,
//       });
//     } catch (error: any) {
//       return res.status(404).json({
//         success: false,

//         message: error.message,
//       });
//     }
//   }

//   async updateCompany(req: AuthRequest, res: Response) {
//     try {
//       const userId = req.user!.id;

//       const company = await companyService.updateCompanyProfile(
//         userId,
//         req.body,
//       );

//       return res.status(200).json({
//         success: true,

//         message: "Company profile updated successfully",

//         data: company,
//       });
//     } catch (error: any) {
//       return res.status(400).json({
//         success: false,

//         message: error.message,
//       });
//     }
//   }
// }

// export default new CompanyController();

import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import companyService from "../services/company.service.js";

class CompanyController {
  async createCompany(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const company = await companyService.createCompanyProfile(
        userId,
        req.body,
      );

      return res.status(201).json({
        success: true,
        message: "Company profile created successfully",
        data: company,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCompany(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const company = await companyService.getCompanyProfile(userId);

      return res.status(200).json({
        success: true,
        data: company,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateCompany(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const company = await companyService.updateCompanyProfile(
        userId,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Company profile updated successfully",
        data: company,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async uploadDocument(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { name } = req.body; // e.g. "GST Certificate" — sent alongside the file
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No file provided",
        });
      }
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Document name is required",
        });
      }

      const document = await companyService.uploadCompanyDocument(
        userId,
        name,
        file,
      );

      return res.status(200).json({
        success: true,
        message: "Document uploaded successfully",
        data: document,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new CompanyController();
