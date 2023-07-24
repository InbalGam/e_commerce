import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from './categorySlice';
import profileReducer from './profileSlice';
import productsReducer from './productSlice';

export default configureStore({
  reducer: {
    categories: categoryReducer,
    profile: profileReducer,
    products: productsReducer
  },
});
