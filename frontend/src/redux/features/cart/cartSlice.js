import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { _id, color, quantity, coverImage } = action.payload;
      const colorName = color?.colorName || "Original";

      const existingItem = state.cartItems.find(
        (item) => item._id === _id && (item.color?.colorName || "Original") === colorName
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: quantity || 1,
          color: color || { colorName: "Original", image: coverImage },
        });
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Product Added to the Cart",
        showConfirmButton: false,
        timer: 1500,
      });
    },

    removeFromCart: (state, action) => {
      const { _id, color } = action.payload;
      const colorName = color?.colorName || "Original";

      state.cartItems = state.cartItems.filter(
        (item) => !(item._id === _id && (item.color?.colorName || "Original") === colorName)
      );

      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Product Removed from Cart",
        showConfirmButton: false,
        timer: 1500,
      });
    },

    updateQuantity: (state, action) => {
      const { _id, color, quantity } = action.payload;
      const colorName = color?.colorName || "Original";

      const item = state.cartItems.find(
        (item) => item._id === _id && (item.color?.colorName || "Original") === colorName
      );

      if (item) {
        item.quantity = quantity;
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Cart Cleared",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
