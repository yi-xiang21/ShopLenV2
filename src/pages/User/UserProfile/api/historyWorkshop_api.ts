import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";

export const historyWorkshopApi = {
    getHistoryWorkshop: async (data: any) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_HISTORY_WORKSHOP, { params: data });
    },
}