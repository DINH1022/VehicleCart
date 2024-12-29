import apiRequest from "./apiRequest.js";

const FAVORITES_URL = "api/favorites";
const favoritesApi = {
  getFavorites: async () => {
    const response =  await apiRequest(`${FAVORITES_URL}`, true, {
      method: "GET",
    });
    return response
  },
  
  addFavorite: async (productId) => {
    return await apiRequest(`${FAVORITES_URL}`, true, {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  },

  removeFavorite: async (productId) => {
    return await apiRequest(`${FAVORITES_URL}`, true, {
      method: "DELETE",
      body: JSON.stringify({ productId }),
    });
  },
};
export default favoritesApi;
