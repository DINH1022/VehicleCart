import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "../redux/feature/favoritesSlice";

const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
  }
});

export default store;
