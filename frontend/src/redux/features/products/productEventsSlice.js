// redux/features/products/productEventsSlice.js

import { createSlice } from "@reduxjs/toolkit";

/**
 * Handles product-related events like triggering a refetch
 * when a product is added, updated, or deleted.
 */

const initialState = {
  shouldRefetch: false,
};

const productEventsSlice = createSlice({
  name: "productEvents",
  initialState,
  reducers: {
    // Call this after a product is added/updated/deleted
    triggerRefetch: (state) => {
      state.shouldRefetch = true;
    },
    // Called after Products.jsx catches the refetch and refreshes
    resetRefetch: (state) => {
      state.shouldRefetch = false;
    },
  },
});

export const { triggerRefetch, resetRefetch } = productEventsSlice.actions;
export default productEventsSlice.reducer;
