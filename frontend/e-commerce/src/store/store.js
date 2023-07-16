import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from './categorySlice';
import profileReducer from './profileSlice';

export default configureStore({
  reducer: {
    categories: categoryReducer,
    profile: profileReducer
  },
});
