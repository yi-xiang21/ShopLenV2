import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";


export const WishlistApi = {
  getWishlist: async () => {
    return callAPI.get(API_CONFIG.ENDPOINTS.GET_WISHLIST);
  },
 toggleWishlist: async (productId: number) => {
    return callAPI.post(API_CONFIG.ENDPOINTS.POST_WISHLIST, { 
      product_id: productId 
    });
  }
}