import { createSlice } from '@reduxjs/toolkit';
import { getCart } from '@/pages/User/cart/store/cart_thunck';
import type { cart } from '@/pages/User/cart/types/cart';

interface cartState {
  items: cart[];
  loading: boolean;
  error: string | null;
}

const initialState: cartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;

        state.items = action.payload?.data || action.payload || []; 
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;