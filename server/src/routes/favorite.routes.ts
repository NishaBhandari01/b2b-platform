import { Router } from "express";
import favoriteController from "../controller/favorite.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get buyer's favorite suppliers
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorite suppliers retrieved successfully.
 */
router.get("/", authenticate, favoriteController.getFavorites);

/**
 * @swagger
 * /api/favorites/{companyId}:
 *   post:
 *     summary: Add supplier to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Supplier added to favorites.
 *       409:
 *         description: Supplier already exists in favorites.
 */
router.post("/:companyId", authenticate, favoriteController.addFavorite);

/**
 * @swagger
 * /api/favorites/{companyId}:
 *   delete:
 *     summary: Remove supplier from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Supplier removed from favorites.
 *       404:
 *         description: Favorite not found.
 */
router.delete("/:companyId", authenticate, favoriteController.removeFavorite);

export default router;
