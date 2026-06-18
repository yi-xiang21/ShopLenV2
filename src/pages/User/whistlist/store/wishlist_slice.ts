import { createSlice } from '@reduxjs/toolkit';
import { getWishlistThunk } from '@/pages/User/whistlist/store/wishlist_thunck';
import type { WishlistItem } from '@/pages/User/whistlist/types/wishlist'; // Import interface của bạn

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlistThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlistThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.items = action.payload?.data || action.payload || []; 
      })
      .addCase(getWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;