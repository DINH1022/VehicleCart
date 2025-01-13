import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/feature/authSlice"
const store = configureStore({
  reducer: {
    authSlice: authReducer,
  }
});

export default store;
