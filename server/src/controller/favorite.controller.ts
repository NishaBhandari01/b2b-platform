import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import favoriteService from "../services/favorite.service.js";

class FavoriteController {
  // POST /api/favorites/:companyId
  async addFavorite(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== "buyer") {
        return res.status(403).json({
          success: false,
          message: "Only buyers can add favorite suppliers",
        });
      }

      const { companyId } = req.params;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: "Company ID is required",
        });
      }

      const favorite = await favoriteService.addFavorite(
        req.user.id,
        req.params.companyId as string,
      );

      return res.status(201).json({
        success: true,
        message: "Supplier added to favorites",
        data: favorite,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DELETE /api/favorites/:companyId
  async removeFavorite(req: AuthRequest, res: Response) {
    try {
      const buyerId = req.user!.id;

      const companyId = req.params.companyId as string;

      await favoriteService.removeFavoriteSupplier(buyerId, companyId);

      return res.json({
        success: true,
        message: "Supplier removed from favorites",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/favorites
  async getFavorites(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== "buyer") {
        return res.status(403).json({
          success: false,
          message: "Only buyers can view favorite suppliers",
        });
      }

      const favorites = await favoriteService.getFavorites(req.user.id);
      if (!favorites) {
        throw new Error("no favoritres");
      }

      return res.json({
        success: true,
        data: favorites,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new FavoriteController();
