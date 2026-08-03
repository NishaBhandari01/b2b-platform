import favoriteRepository from "../repository/favorite.repository.js";

class FavoriteService {
  async addFavorite(buyerId: string, companyId: string) {
    const existing = await favoriteRepository.getFavorite(buyerId, companyId);

    if (existing) {
      throw new Error("supplier already added to favorites.");
    }
    return favoriteRepository.addFavorite(buyerId, companyId);
  }

  async removeFavoriteSupplier(buyerId: string, companyId: string) {
    const favorite = await favoriteRepository.removeFavorite(
      buyerId,
      companyId,
    );

    return favorite;
  }

  async getFavorites(buyerId: string) {
    return favoriteRepository.getFavorites(buyerId);
  }
}

export default new FavoriteService();
