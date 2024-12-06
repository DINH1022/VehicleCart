import apiRequest from './apiRequest.js'

const BASE_URL = "http://localhost:5000/";
const PRODUCT_URL = "http://localhost:5000/api/products";

const productApi = {
  getProducts: async (keyword) => {
    
    return await apiRequest(`${PRODUCT_URL}/${keyword}`, false, {
      method: "GET",
    });
  },

  getProductById: async (productId) => {
    return await apiRequest(`${PRODUCT_URL}/${productId}`, true, {
      method: "GET",
    });
  },
  allProducts: async () => {
    return await apiRequest(`${PRODUCT_URL}/allProducts`, false, {
      method: "GET",
    });
  },
  createProduct: async (data) => {
    return await apiRequest(`${PRODUCT_URL}`, true, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateProduct: async (productId, data) => {
    return await apiRequest(`${PRODUCT_URL}/${productId}`, true, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteProduct: async (productId) => {
    return await apiRequest(`${PRODUCT_URL}/${productId}`, true, {
      method: "DELETE",
    });
  },

  getTopProducts: async () => {
    return await apiRequest(`${PRODUCT_URL}/top`, true, {
      method: "GET",
    });
  },

  getNewProducts: async () => {
    return await apiRequest(`${PRODUCT_URL}/new`, true, {
      method: "GET",
    });
  },

  uploadProductImage: async (data) => {
    return await apiRequest(`${PRODUCT_URL}/upload`, true, {
      method: "POST",
      body: data, 
    });
  },

  createReview: async (productId, data) => {
    return await apiRequest(`${PRODUCT_URL}/${productId}/reviews`, true, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getFilteredProducts: async ({checked, radio}) => {
    return await apiRequest(`${PRODUCT_URL}/filtered-products`, true, {
      method: "POST",
      body: JSON.stringify({checked, radio}),
    });
  },
};

export default productApi;
