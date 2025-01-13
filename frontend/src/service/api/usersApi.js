import apiRequest from "./apiRequest.js";
import { SERVER_URL } from "../../redux/constant.js";
const USERS_URL = "api/users";
const usersApi = {
  login: async (data) => {
    try {
      return await apiRequest(`${USERS_URL}/auth`, true, {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },
  googleLogin: async (code) => {
    try {
      return await apiRequest(`${USERS_URL}/auth/google?code=${code}`, true, {
        method: "GET",
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login google failed");
    }
  },
  facebookLogin: async (code) => {
    try {
      const response = await apiRequest(`${USERS_URL}/auth/facebook?code=${code}`, true, {
        method: "GET",
        credentials: 'include'
      });
      return response;
    } catch (error) {
      console.error("Facebook login error details:", error);
      throw new Error(error.response?.data?.message || "Login facebook failed");
    }
  },
  register: async (data) => {
    try {
      return await apiRequest(`${USERS_URL}`, true, {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  logout: async () => {
    try {
      return await apiRequest(`${USERS_URL}/logout`, true, {
        method: "POST",
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    try {
      return await apiRequest(`${USERS_URL}/profile`, true, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || "Profile update failed");
    }
  },

  getProfile: async () => {
    try {
      return await apiRequest(`${USERS_URL}/profile`, true, {
        method: "GET",
      });
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  },

  getUsers: async () => {
    try {
      return await apiRequest(`${USERS_URL}`, true, {
        method: "GET",
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  },

  deleteUser: async (userId) => {
    try {
      return await apiRequest(`${USERS_URL}/${userId}`, true, {
        method: "DELETE",
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete user");
    }
  },

  getUserDetails: async (userId) => {
    try {
      return await apiRequest(`${USERS_URL}/${userId}`, true, {
        method: "GET",
      });
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user details"
      );
    }
  },

  updateUser: async (userId, data) => {
    try {
      return await apiRequest(`${USERS_URL}/${userId}`, true, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
  },
  uploadAvatar: async (avatar) => {
    try {
      console.log("test: ", avatar);
      const res = await fetch(
        `${SERVER_URL}/${USERS_URL}/profile/upload-avatar`,
        {
          method: "POST",
          credentials: "include",
          body: avatar,
        }
      );
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
};
export default usersApi;
