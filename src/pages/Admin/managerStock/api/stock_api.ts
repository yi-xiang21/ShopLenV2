import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";
import type { stock } from "@/pages/Admin/managerStock/type/stock";

export const stockApi = {

    filter: async (filterData: any) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.POST_FILTER_STOCKS, filterData);  
    },
    getHistory: async (variant_id: number , page:number, limit:number) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_HISTORY_STOCKS(variant_id), { params: { page, limit } });
    },
    updateStock: async (stockData: stock | stock[]) => {
        const payload = Array.isArray(stockData) ? stockData : [stockData];
        return callAPI.post(API_CONFIG.ENDPOINTS.POST_UPDATE_STOCKS, payload);
    }
    
}