import { configureStore } from '@reduxjs/toolkit';
import { writeDemoData } from './demoPersistence';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import ordersReducer from '../features/orders/ordersSlice';
import productsReducer from '../features/products/productsSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    orders: ordersReducer,
    products: productsReducer,
    wishlist: wishlistReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();
  writeDemoData('scootstore-products', state.products);
  writeDemoData('scootstore-orders', state.orders);
});
