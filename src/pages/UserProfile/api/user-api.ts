import { API_CONFIG } from "../../../config/api";
import { callAPI } from "../../../share/lib/axios";

export const userApi = {
  getAll: async () => {
    return callAPI.get(API_CONFIG.ENDPOINTS.GETALL_USERS);
  },
  getProfile: async () => {
    return callAPI.get(API_CONFIG.ENDPOINTS.PROFILE);
  }
}