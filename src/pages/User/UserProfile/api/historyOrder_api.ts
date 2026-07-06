import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";

export const historyOrderApi = {
    getHistoryOrders: async (page: number, limit?: number, tab?: string, type?: string) => { 
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_HISTORY_ORDERS,{ params: { page, limit , tab,type } });
    },
    getHistoryOrderDetail: async (orderId: string) => {
    return callAPI.get(API_CONFIG.ENDPOINTS.GET_HISTORY_ORDER_DETAIL(orderId));
  }
}