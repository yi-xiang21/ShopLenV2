import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";


export const DashboardApi = {
    getAll: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_DASHBOARD_OVERVIEW);
    }
}