import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "../redux/feature/favoritesSlice";
import { getFavoritesFromLocalStorage } from "../utils/localStorage.js";

const initialFavorites = getFavoritesFromLocalStorage() || [];
const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
  },
  preloadedState: {
    favorites: initialFavorites,
  },
});

export default store;
