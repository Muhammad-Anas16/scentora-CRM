import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, limit = 10, q = '' } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (q) params.append('q', q);
    const response = await axios.get(`/api/products?${params.toString()}`);
    return {
      items: response.data.data.items,
      total: response.data.data.total,
      page: response.data.data.page,
      limit: response.data.data.limit,
    };
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;