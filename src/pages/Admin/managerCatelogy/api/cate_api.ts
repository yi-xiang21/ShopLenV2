import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";

export const categoryApi = {
    getAll: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_CATEGORIES);
    },
    getById: async (id: string) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_CATEGORY(id));
    },
    create: async (data: FormData) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.CREATE_CATEGORY, data);
    },
    update: async (id: string, data: FormData) => {
        return callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_CATEGORY(id), data);
    },
    delete: async (id: string) => {
        return callAPI.delete(API_CONFIG.ENDPOINTS.DELETE_CATEGORY(id));
    }
}