


import type { Billing  } from '@/pages/User/Billing/type/billing';
import { API_CONFIG } from "@/config/api";
import {callAPI} from "@/share/lib/axios";
import type { orderWorkShop } from '@/pages/User/Workshop/types/order_workshop';

export const BillingApi = {
    createBilling: async (payload: Billing) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.CREATE_BILLING, payload);
    },
    getShippingMethods: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_SHIPPING_METHODS);
    },
    getMyOrders: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_MY_ORDERS);
    },
    getOrderDetail: async (orderId: string) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_ORDER_DETAIL(orderId));
    },
    postOrderRepurchase: async (orderId: string) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.POST_ORDER_REPURCHASE(orderId));
    },
    getLocations: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_LOCATIONS);
    },
    getCityWards: async (city_code: string) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_CITY_WARDS(city_code));
    },
    createOrderBuyNow: async (payload: orderWorkShop) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.CREATE_ORDER_BUY_NOW, payload);
    },
    postOrderCancel: async (orderId: string) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.POST_ORDER_CANCEL(orderId));
    }
}

