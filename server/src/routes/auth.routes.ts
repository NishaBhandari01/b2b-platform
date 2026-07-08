import express from "express";
import * as authController from "../controller/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Santosh Paudel
 *               email:
 *                 type: string
 *                 example: santosh@gmail.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *               role:
 *                 type: string
 *                 enum:
 *                   - buyer
 *                   - supplier
 *                   - admin
 *     responses:
 *       201:
 *         description: User registered successfully
 */

router.post("/register", (req, res) => authController.register(req, res));

export default router;
