import apiRequest from "./apiRequest.js";
import { SERVER_URL } from "../../redux/constant.js";

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

  uploadProductImage: async (formData) => {
    try {
      const response = await fetch(`${SERVER_URL}/${PRODUCT_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error.message || 'Failed to upload image');
    }
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

  getTopRatingProducts: async () => {
    return await apiRequest(`${PRODUCT_URL}/topRating`, false, {
      method: "GET",
    });
  },

  getTopSellingProducts: async () => {
    return await apiRequest(`${PRODUCT_URL}/topSelling`, false, {
      method: "GET",
    });
  },

  getRelatedProducts: async (productId) => {
    return await apiRequest(`${PRODUCT_URL}/${productId}/related`, false, {
      method: "GET",
    });
  },
};

export default productApi;
