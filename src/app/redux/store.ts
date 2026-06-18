import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/pages/Login&Register/store/auth-slice';
import wishlistReducer from '@/pages/User/whistlist/store/wishlist_slice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
