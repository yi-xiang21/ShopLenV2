// Lấy base URL từ env (Vite)
const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'https://be-shoplen.onrender.com';
// const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Định nghĩa endpoints (readonly để tránh bị sửa ngoài ý muốn)
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,

  ENDPOINTS: {
    LOGIN: 'api/auth/login',
    REGISTER: 'api/auth/register',
    LOGOUT: 'api/auth/logout',
    PROFILE: 'api/auth/me',
  },
} as const;

// Type tự động từ ENDPOINTS
type Endpoints = typeof API_CONFIG.ENDPOINTS;
export type EndpointKey = keyof Endpoints;
export type EndpointValue = Endpoints[EndpointKey];

// Helper: lấy full URL từ endpoint
export function getApiUrl(endpoint: EndpointValue): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// (Optional) Helper nâng cao: truyền key thay vì string
export function getApiUrlByKey(key: EndpointKey): string {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[key]}`;
}