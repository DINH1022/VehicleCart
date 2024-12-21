import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "../redux/feature/favoritesSlice";
import authReducer from "../redux/feature/authSlice"
const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    authSlice: authReducer,
  }
});

export default store;
