import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";
import type { account } from "../type/account";

export const AccountApi = {
    getAll: async (page :number, limit: number) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GETALL_USERS, { params: { page, limit } });
    },
    getById: async (id: any) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_USER( id));
    },
    create: async (data:account) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.CREATE_USER, data);
    },
    update: async (id: any, data: account) => {
        return callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_USER(id ), data);
    },
    delete: async (id: any) => {
        return callAPI.delete(API_CONFIG.ENDPOINTS.DELETE_USER( id));
    }
}