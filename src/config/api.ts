const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,

  ENDPOINTS: {
    //auth
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    GOOGLE_LOGIN: '/api/auth/google',
    //user
    PROFILE: '/api/auth/me',
    UPDATE_PROFILE: '/api/users/user/me',

    //whistlist
    POST_WISHLIST: '/api/wishlist/toggle',
    GET_WISHLIST: '/api/wishlist',

    //cart
    GET_CART: '/api/cart',
    ADD_CART: '/api/cart',
    SYNC_CART: '/api/cart/sync',
    UPDATE_CART: (variant_id: number) => `/api/cart/${variant_id}`,
    DELETE_CART: (variant_id: number) => `/api/cart/${variant_id}`,

    //momo
    POST_CREATE_PAYMENT: '/api/payment/momo/ipn',
    GET_PAYMENT_SUCCESS: '/api/payment/momo/return',
    POST_REFUND_MOMO_PAYMENT: (order_id: number) => `/api/payment/refund/${order_id}`,

    //voucher user
    GET_VOUCHERS_USER: '/api/vouchers/my-vouchers',
    POST_VOUCHER_USER: '/api/vouchers/save',
    POST_VOUCHER_APPLY: '/api/vouchers/apply',


    //billing
    CREATE_BILLING: '/api/orders',
    GET_SHIPPING_METHODS: '/api/orders/shipping-fees',
    GET_MY_ORDERS: '/api/orders/my-orders',
    GET_ORDER_DETAIL: (orderId: string) => `/api/orders/${orderId}`,
    POST_ORDER_REPURCHASE: (orderId: string) => `/api/repurchase/${orderId}`,

    //location
    GET_LOCATIONS: '/api/location/cities',
    GET_CITY_WARDS: (city_code: string) => `/api/location/cities/${city_code}/wards`,


    //admin account
    GETALL_USERS: '/api/users',
    GET_USER: (id: string) => `/api/users/${id}`,
    CREATE_USER: '/api/users',
    UPDATE_USER: (id: string) => `/api/users/${id}`,
    DELETE_USER: (id: string) => `/api/users/${id}`,
    FILTER_USERS: '/api/users/filter',
    
    //admin category
    GET_CATEGORIES: '/api/categories',
    GET_CATEGORY: (id: string) => `/api/categories/${id}`,
    CREATE_CATEGORY: '/api/categories',
    UPDATE_CATEGORY: (id: string) => `/api/categories/${id}`,
    DELETE_CATEGORY: (id: string) => `/api/categories/${id}`,
    FiLTER_CATEGORIES: '/api/categories/filter',

    //admin stock
    GET_STOCKS: '/api/variants/stock',
    POST_FILTER_STOCKS: '/api/inventory/overview',
    GET_HISTORY_STOCKS: (variant_id: number) => `/api/inventory/${variant_id}/history`,
    POST_UPDATE_STOCKS: '/api/inventory/adjust',

    
    //admin product
    GET_PRODUCTS: '/api/products',
    GET_PRODUCT: (id: string) => `/api/products/${id}`,
    CREATE_PRODUCT: '/api/products',
    UPDATE_PRODUCT: (id: string) => `/api/products/${id}`,
    DELETE_PRODUCT: (id: string) => `/api/products/${id}`,
    FiLTER_PRODUCTS: '/api/products/filter',
    GET_PRODUCTS_TOP_SELLING: '/api/products/top-selling',
    
    

    //admin voucher
    GET_VOUCHERS: '/api/vouchers/vouchers',
    GET_VOUCHER: (id: string) => `/api/vouchers/vouchers/${id}`,
    CREATE_VOUCHER: '/api/vouchers/vouchers',
    UPDATE_VOUCHER: (id: string) => `/api/vouchers/vouchers/${id}`,
    DELETE_VOUCHER: (id: string) => `/api/vouchers/vouchers/${id}`,
    FILTER_VOUCHERS: '/api/vouchers/vouchers/filter',




    //admin promotion
    GET_PROMOTIONS_ACTIVE: '/api/promotions',
    GET_PROMOTION: (id: string) => `/api/promotions/${id}`,
    GET_PROMOTIONS: '/api/promotions/promotions/all',
    CREATE_PROMOTION: '/api/promotions/promotions',
    UPDATE_PROMOTION: (id: string) => `/api/promotions/promotions/${id}`,
    DELETE_PROMOTION: (id: string) => `/api/promotions/promotions/${id}`,
    FILTER_PROMOTIONS: '/api/promotions/promotions/filter',


    
    //admin order
    GETALL_ORDERS: '/api/orders/admin/all',
    GET_ORDER: (id: string) => `/api/orders/admin/${id}`,
    UPDATE_ORDER_STATUS: (id: string) => `/api/orders/admin/${id}/status`,
    FILTER_ORDERS: '/api/orders/admin/filter',


    FORGOT_PASSWORD: '/api/auth/forgot-password',
    VERIFY_OTP: '/api/auth/verify-reset-otp',
    RESET_PASSWORD: '/api/auth/reset-password',

    CHANGE_PASSWORD: '/api/users/change-password',

    REFRESH_TOKEN: '/api/auth/refresh-token',
  },
} as const;

export type EndpointKey = keyof typeof API_CONFIG.ENDPOINTS;