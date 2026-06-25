import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getCart, syncCart } from '@/pages/User/cart/store/cart_thunck';
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
      localStorage.removeItem('localCart');
    },
    addToLocalCart: (state, action: PayloadAction<cart>) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.variant_id === newItem.variant_id
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }

      localStorage.setItem('localCart', JSON.stringify(state.items));
    },
    setLocalCart: (state, action) => {
      state.items = action.payload;
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
      })
      .addCase(syncCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.loading = false;
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearCart, addToLocalCart ,setLocalCart} = cartSlice.actions;
export default cartSlice.reducer;