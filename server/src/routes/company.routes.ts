import { Router } from "express";

import companyController from "../controller/company.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Supplier company profile management
 */

/**
 * @swagger
 * /api/company/profile:
 *   post:
 *     summary: Create company profile
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bharat Lighting Co.
 *               gstNumber:
 *                 type: string
 *                 example: 07ABCDE1234F1Z5
 *               panNumber:
 *                 type: string
 *                 example: ABCDE1234F
 *               established:
 *                 type: string
 *                 example: "2009"
 *               employees:
 *                 type: string
 *                 example: 50-100
 *               description:
 *                 type: string
 *                 example: Manufacturer of LED lighting products
 *
 *     responses:
 *       201:
 *         description: Company profile created successfully
 *
 *       400:
 *         description: Company profile creation failed
 */
router.post(
  "/profile",
  authenticate,
  companyController.createCompany.bind(companyController),
);

/**
 * @swagger
 * /api/company/profile:
 *   get:
 *     summary: Get logged-in user's company profile
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Company profile fetched successfully
 *
 *       404:
 *         description: Company profile not found
 */
router.get(
  "/profile",
  authenticate,
  companyController.getCompany.bind(companyController),
);

/**
 * @swagger
 * /api/company/profile:
 *   put:
 *     summary: Update company profile
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bharat Lighting Pvt Ltd
 *
 *               gstNumber:
 *                 type: string
 *                 example: 07ABCDE1234F1Z5
 *
 *               panNumber:
 *                 type: string
 *                 example: ABCDE1234F
 *
 *               employees:
 *                 type: string
 *                 example: 100-200
 *
 *               description:
 *                 type: string
 *                 example: Updated company description
 *
 *     responses:
 *       200:
 *         description: Company profile updated successfully
 *
 *       400:
 *         description: Update failed
 */
router.put("/profile", authenticate, companyController.updateCompany);

/**
 * @swagger
 * /api/company/documents/upload:
 *   post:
 *     summary: Upload (or replace) a single company document to Cloudflare R2
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: GST Certificate
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 *       400:
 *         description: Upload failed
 */
router.post(
  "/documents/upload",
  authenticate,
  upload.single("file"),
  companyController.uploadDocument.bind(companyController),
);

export default router;
