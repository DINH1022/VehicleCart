import { createSlice } from "@reduxjs/toolkit";
const favoriteSlice = createSlice({
  name: "favorites",
  initialState: [], 
  reducers: {
    addToFavorites: (state, action) => {
      if (Array.isArray(state) && !state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },
    removeFromFavorites: (state, action) => {
      console.log(action.payload)
      return Array.isArray(state) ? state.filter((product) => product._id !== action.payload) : [];
    },
    setFavorites: (state, action) => {
      return Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } = favoriteSlice.actions;
export const selectFavoriteProduct = (state) => state.favorites;
export default favoriteSlice.reducer;







// import { createSlice } from "@reduxjs/toolkit";

// const favoriteSlice = createSlice({
//   name: "favorites",
//   initialState: [],
//   reducers: {
//     addToFavorites: (state, action) => {
//       if (!state.some((product) => product._id === action.payload._id)) {
//         state.push(action.payload);
//       }
//     },
//     removeFromFavorites: (state, action) => {
//       return state.filter((product) => product._id !== action.payload);
//     },
//     setFavorites: (state, action) => {
//       return Array.isArray(action.payload) ? action.payload : [];
//     },
//   },
// });

// export const { addToFavorites, removeFromFavorites, setFavorites } = favoriteSlice.actions;
// export const selectFavoriteProduct = (state) => state.favorites;
// export default favoriteSlice.reducer;