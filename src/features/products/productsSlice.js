import { createSlice } from "@reduxjs/toolkit";
import { readDemoData } from "../../app/demoPersistence.js";
import catalog from "../../data/products.js";

const initialProducts = (() => {
  const products = readDemoData("scootstore-products", null);
  if (!Array.isArray(products) || products.length === 0) {
    return catalog;
  }
  return products.map((item) => {
    if (typeof item.stockQuantity === "number") return item;
    const fromCatalog = catalog.find((product) => product.id === item.id);
    return {
      ...item,
      stockQuantity: fromCatalog?.stockQuantity ?? 10,
    };
  });
})();

const productsSlice = createSlice({
  name: "products",
  initialState: initialProducts,
  reducers: {
    setProducts: (_state, action) => action.payload,
    addProduct: (state, action) => {
      if (!state.some((product) => product.id === action.payload.id)) {
        state.push(action.payload);
      }
    },
    updateProduct: (state, action) => {
      const { id, changes } = action.payload;
      const product = state.find((item) => item.id === id);
      if (product) Object.assign(product, changes);
    },
    deleteProduct: (state, action) =>
      state.filter((product) => product.id !== action.payload),
    deductStock: (state, action) => {
      action.payload.forEach(({ id, quantity }) => {
        const product = state.find((item) => item.id === id);
        if (product && typeof product.stockQuantity === "number") {
          product.stockQuantity = Math.max(0, product.stockQuantity - quantity);
        }
      });
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  deductStock,
} = productsSlice.actions;
export default productsSlice.reducer;
