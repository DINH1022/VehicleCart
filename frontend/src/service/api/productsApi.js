import apiRequest from "./apiRequest.js";

const PRODUCT_URL = "api/products";

const productApi = {
  getProducts: async (params) => {
    if (params) {
      return await apiRequest(`${PRODUCT_URL}/?${params}`, false, {
        method: "GET",
      });
    } else {
      return await apiRequest(`${PRODUCT_URL}`, false, {
        method: "GET",
      });
    }
  },

  getProductById: async (productId) => {
    const res = await apiRequest(`${PRODUCT_URL}/${productId}`, false, {
      method: "GET",
    });
    return res;
  },
  allProducts: async () => {
    return await apiRequest(`${PRODUCT_URL}/allProducts`, false, {
      method: "GET",
    });
  },

  specialProduct: async () => {
    return await apiRequest(`${PRODUCT_URL}/special-product`, false, {
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
    return await apiRequest(`${PRODUCT_URL}/top`, false, {
      method: "GET",
    });
  },
  createReview: async (productId, data) => {
    console.log("data", data);
    return await apiRequest(`${PRODUCT_URL}/${productId}/reviews`, true, {
      method: "POST",
      body: data,
    });
  },
  getNewProducts: async () => {
    return await apiRequest(`${PRODUCT_URL}/new`, true, {
      method: "GET",
    });
  },
  getReviewProduct: async (productId) => {
    return await apiRequest(`${PRODUCT_URL}/${productId}/reviews`, true, {
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

  getFilteredProducts: async ({ checked, radio }) => {
    return await apiRequest(`${PRODUCT_URL}/filtered-products`, true, {
      method: "POST",
      body: JSON.stringify({ checked, radio }),
    });
  },
};

export default productApi;
