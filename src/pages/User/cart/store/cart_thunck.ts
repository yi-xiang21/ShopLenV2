import { createAsyncThunk } from '@reduxjs/toolkit';
import {CartApi} from '@/pages/User/cart/api/cart_api';
import type { cart, CartSync } from '@/pages/User/cart/types/cart';
export const getCart = createAsyncThunk(
    '/api/cart',
    async (_, thunkAPI) => {
        try {
            const response = await CartApi.getCart();
            
            return response.data.data.cart;
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const addToCart = createAsyncThunk(
  '/api/cart',
  async (payload: cart, thunkAPI) => {
      try {
          const response = await CartApi.addToCart(payload);
          thunkAPI.dispatch(getCart());
          return response.data.data.cart;
        
      }
      catch (error) {
          return thunkAPI.rejectWithValue(error);
      }
  }
);

export const syncCart = createAsyncThunk(
  '/api/cart/sync',
  async (payload: CartSync, thunkAPI) => {
      try {
          const response = await CartApi.syncCart(payload);
          return response.data.data.cart;
      }
      catch (error) {
          return thunkAPI.rejectWithValue(error);
      }
  }
);

export const updateCartItem = createAsyncThunk(
  '/api/cart',
  async (payload: cart, thunkAPI) => {
        try {
            const response = await CartApi.updateCart(payload.variant_id || 0, payload);
            thunkAPI.dispatch(getCart());
            return response.data.data.cart;
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }   
    });

export const deleteCartItem = createAsyncThunk(
  '/api/cart',
  async (variant_id: number, thunkAPI) => {
        try {
            const response = await CartApi.deleteCart(variant_id);
            thunkAPI.dispatch(getCart());
            return response.data.data.cart;

        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    });


