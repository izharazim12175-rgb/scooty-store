import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload.product ?? action.payload;
      const requestedQuantity = action.payload.product
        ? action.payload.quantity
        : 1;
      const quantity =
        Number.isInteger(requestedQuantity) && requestedQuantity > 0
          ? requestedQuantity
          : 1;
      const item = state.find((cartItem) => cartItem.id === product.id);
      if (item) {
        item.quantity += quantity;
      } else {
        state.push({ ...product, quantity });
      }
    },
    removeFromCart: (state, action) =>
      state.filter((item) => item.id !== action.payload),
    increaseQuantity: (state, action) => {
      const item = state.find((product) => product.id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action) => {
      const item = state.find((product) => product.id === action.payload);
      if (!item) return;
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        return state.filter((product) => product.id !== action.payload);
      }
    },
    clearCart: () => [],
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
