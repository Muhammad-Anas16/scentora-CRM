import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/productsSlice/productsSlice';
import usersReducer from './features/usersSlice/usersSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    products: productsReducer,
  },
})