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
 * /api/company:
 *   get:
 *     summary: Get all supplier companies
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Companies fetched successfully
 */
router.get(
  "/",

  companyController.getAllCompanies.bind(companyController),
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
 * /api/company/{companyId}:
 *   get:
 *     summary: Get supplier company profile by ID
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrf6gjtu000113qpwd1j8z4b
 *
 *     responses:
 *       200:
 *         description: Company profile fetched successfully
 *
 *       404:
 *         description: Company not found
 */
router.get(
  "/:companyId",
  authenticate,
  companyController.getCompanyById.bind(companyController),
);

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
 *               website:
 *                 type: string
 *                 example: www.bharatlighting.com
 *               email:
 *                 type: string
 *                 example: contact@bharatlighting.com
 *               phone:
 *                 type: string
 *                 example: "+91 98765 43210"
 *               headquarters:
 *                 type: string
 *                 example: Mumbai, Maharashtra, India
 *               industry:
 *                 type: string
 *                 example: Manufacturing & Wholesale
 *     responses:
 *       201:
 *         description: Company profile created successfully
 *       400:
 *         description: Company profile creation failed
 */

/**
 * @swagger
 * /api/company/profile:
 *   put:
 *     summary: Update company profile
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               gstNumber:
 *                 type: string
 *               panNumber:
 *                 type: string
 *               established:
 *                 type: string
 *               employees:
 *                 type: string
 *               description:
 *                 type: string
 *               website:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               headquarters:
 *                 type: string
 *               industry:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company profile updated successfully
 *       400:
 *         description: Update failed
 */

router.put(
  "/profile",
  authenticate,
  companyController.updateCompany.bind(companyController),
);

export default router;
