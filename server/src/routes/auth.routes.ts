import express from "express";
import * as authController from "../controller/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: santosh@gmail.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: User logged in successfully
 */

router.post("/login", (req, res) => authController.login(req, res));
router.get("/me", authenticate, (req, res) => authController.me(req, res));
router.post("/refresh", (req, res) => authController.refresh(req, res));
router.post("/logout", authenticate, (req, res) =>
  authController.logout(req, res),
);
router.post("/google", (req, res) => authController.google(req, res));
// router.post("/forgot-password", (req, res) =>
//   authController.forgetPassword(req, res),
// );

router.post("/forgot-password", (req, res) =>
  authController.forgotPassword(req, res),
);

router.post("/reset-password", (req, res) =>
  authController.resetPassword(req, res),
);

export default router;
