import { createAsyncThunk } from '@reduxjs/toolkit';

import { authApi } from '@/pages/Login&Register/api/auth-api';
import type { LoginPayload, RegisterPayload } from '@/pages/Login&Register/types/auth-type';
import { userApi } from '@/pages/User/UserProfile/api/user-api';

export const loginThunk = createAsyncThunk(
  '/api/auth/login',
  async (payload: LoginPayload, thunkAPI) => {
    try {
      const res = await authApi.login(payload);

      return res.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Đăng nhập thất bại');
    }
  },
);

export const registerThunk = createAsyncThunk(
  '/api/auth/register',
  async (payload: RegisterPayload, thunkAPI) => {
    try {
      const res = await authApi.register(payload);
      
      return res.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Đăng ký tài khoản thất bại');
    }
  },
);

export const getMeThunk = createAsyncThunk('/api/auth/me', async (_, thunkAPI) => {
  try {
    const { getProfile } = userApi;
    const res = await getProfile();

    return res.data;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Lấy thông tin người dùng thất bại');
  }
});

