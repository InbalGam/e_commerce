import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from './categorySlice';
import profileReducer from './profileSlice';
import productsReducer from './productSlice';
import cartReducer from './cartSlice';
import ordersReducer from './ordersSlice';

export default configureStore({
  reducer: {
    categories: categoryReducer,
    profile: profileReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer
  },
});
