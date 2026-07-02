import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";
import type { Workshop } from "@/pages/Admin/managerWorkshop/types/workshop";

export const WorkshopApi = {
    getAll: (data:any) =>
        callAPI.post(API_CONFIG.ENDPOINTS.POST_FILTER_WORKSHOPS, data),
    getById: (id:any) =>
        callAPI.get(API_CONFIG.ENDPOINTS.GET_DETAIL_WORKSHOP(id)),
    create: (data:Workshop) =>
        callAPI.post(API_CONFIG.ENDPOINTS.POST_WORKSHOPS, data),
    update: (id:any, data:Workshop) =>
        callAPI.put(API_CONFIG.ENDPOINTS.PUT_UPDATE_WORKSHOP(id), data),
    delete: (id:any) =>
        callAPI.delete(API_CONFIG.ENDPOINTS.DELETE_WORKSHOP(id)),
}