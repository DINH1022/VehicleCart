import apiRequest from "./apiRequest.js";

const CART_URL = "api/cart";
const cartApi = {
  getCart: async () => {
    return await apiRequest(`${CART_URL}`, true, {
      method: "GET",
    });
  },
  addToCart: async (productId, quantity) => {
    return await apiRequest(`${CART_URL}`, true, {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  },
  addItemsToCart: async (data) => {
    return await apiRequest(`${CART_URL}/items`, true, {
      method: "POST",
      body: JSON.stringify({
        cartItems: data,
      }),
    });
  },
  updateCart: async (productId, quantity) => {
    return await apiRequest(`${CART_URL}`, true, {
      method: "PUT",
      body: JSON.stringify({ productId, quantity }),
    });
  },
  removeFromCart: async (productId) => {
    return await apiRequest(`${CART_URL}/${productId}`, true, {
      method: "DELETE",
    });
  },
  clearCart: async () => {
    return await apiRequest(`${CART_URL}/clean`, true, {
      method: "DELETE",
    });
  },
};

export default cartApi;
