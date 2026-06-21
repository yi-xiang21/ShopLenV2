import { createAsyncThunk } from '@reduxjs/toolkit';
import { WishlistApi } from '@/pages/User/whistlist/api/wishlist'; // Đổi lại đường dẫn cho đúng dự án của bạn

// 1. Thunk lấy danh sách Wishlist
export const getWishlistThunk = createAsyncThunk(
  '/api/wishlist/get',
  async (_, thunkAPI) => {
    try {
      const res = await WishlistApi.getWishlist();
      console.log("Wishlist data:", res.data); 
      return res.data.data?.items; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Lỗi khi lấy danh sách yêu thích'
      );
    }
  }
);


export const toggleWishlistThunk = createAsyncThunk(
  '/api/wishlist/toggle',
  async (productId: number, thunkAPI) => {    
    try {
      const res = await WishlistApi.toggleWishlist(productId);
    
      thunkAPI.dispatch(getWishlistThunk());

      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Lỗi khi cập nhật danh sách yêu thích'
      );
    }
  }
);