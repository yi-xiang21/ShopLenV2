const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,

  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    GOOGLE_LOGIN: '/api/auth/google',
    PROFILE: '/api/auth/me',

    GETALL_USERS: '/api/users',

    FORGOT_PASSWORD: '/api/auth/forgot-password',
    VERIFY_OTP: '/api/auth/verify-reset-otp',
    RESET_PASSWORD: '/api/auth/reset-password',

    CHANGE_PASSWORD: '/api/users/change-password',

    REFRESH_TOKEN: '/api/auth/refresh-token',
  },
} as const;

export type EndpointKey = keyof typeof API_CONFIG.ENDPOINTS;