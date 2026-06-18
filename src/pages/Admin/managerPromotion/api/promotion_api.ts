import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";
import type { promotion } from "@/pages/Admin/managerPromotion/type/promotion";

export const promotionApi = {
    getActive: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_PROMOTIONS_ACTIVE);
    },
    getAll: async (page :number, limit: number) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_PROMOTIONS, { params: { page, limit } });
    },
    getById: async (id: any) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_PROMOTION(id));
    },
    create: async (data:promotion) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.CREATE_PROMOTION, data);
    },
    update: async (id: any, data: promotion) => {
        return callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_PROMOTION(id ), data);
    },
    delete: async (id: any) => {
        return callAPI.delete(API_CONFIG.ENDPOINTS.DELETE_PROMOTION( id));
    },
    filter: async (filter: any) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.FILTER_PROMOTIONS, filter );
    }
}