


import type { cart, CartSync } from '@/pages/User/Cart/types/cart';
import { API_CONFIG } from "@/config/api";
import {callAPI} from "@/share/lib/axios";

export const CartApi = {
    getCart: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_CART);
    },
    addToCart: async (payload: cart) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.ADD_CART, payload);
    },
    syncCart: async (payload: CartSync) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.SYNC_CART, payload);
    },
    updateCart: async (variant_id: number, payload: cart) => {
        return callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_CART(variant_id), payload);
    },
    deleteCart: async (variant_id: number) => {
        return callAPI.delete(API_CONFIG.ENDPOINTS.DELETE_CART(variant_id));
    }
}

