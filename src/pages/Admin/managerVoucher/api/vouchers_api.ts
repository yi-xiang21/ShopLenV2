import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";
import type { voucher,voucherApply } from "../type/vouchers";

export const vouchersApi = {
    getAll: async (page :number, limit: number) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_VOUCHERS, { params: { page, limit } });
    },
    getById: async (id: any) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_VOUCHER( id));
    },
    create: async (data:voucher) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.CREATE_VOUCHER, data);
    },
    update: async (id: any, data: voucher) => {
        return callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_VOUCHER(id ), data);
    },
    delete: async (id: any) => {
        return callAPI.delete(API_CONFIG.ENDPOINTS.DELETE_VOUCHER( id));
    },
    filter: async (filter: any) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.FILTER_VOUCHERS, filter );
    },
    // user
    getMyVouchers: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_VOUCHERS_USER);
    },
    saveVoucher: async (voucherId: number) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.POST_VOUCHER_USER, { voucher_id: voucherId });
    },
    applyVoucher: async (data: voucherApply) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.POST_VOUCHER_APPLY, data);
    },
    getActiveVouchers: async (page:number, limit:number) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_VOUCHER_ACTIVE ,{ params: { page, limit } });
    },

}