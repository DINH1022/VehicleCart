import { createSlice } from "@reduxjs/toolkit";

const getInitialUserData = () => {
  const sessionData = sessionStorage.getItem("userData");
  const localData = localStorage.getItem("userData");
  
  return {
    currentUser: sessionData ? JSON.parse(sessionData) : localData ? JSON.parse(localData) : null,
    isLoggedIn: !!(sessionData || localData)
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialUserData(),
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
      sessionStorage.removeItem("userData");
      localStorage.removeItem("userData");
    }
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;