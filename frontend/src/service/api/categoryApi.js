import apiRequest from './apiRequest.js';

const CATEGORY_URL = "/api/categories";

const categoryApi = {
  createCategory: async (newCategory) => {
    return await apiRequest(`${CATEGORY_URL}`, true, {
      method: "POST",
      body: JSON.stringify(newCategory),
    });
  },

  updateCategory: async (categoryId, updatedCategory) => {
    return await apiRequest(`${CATEGORY_URL}/${categoryId}`, true, {
      method: "PUT",
      body: JSON.stringify(updatedCategory),
    });
  },

  deleteCategory: async (categoryId) => {
    return await apiRequest(`${CATEGORY_URL}/${categoryId}`, true, {
      method: "DELETE",
    });
  },

  fetchCategories: async () => {
    return await apiRequest(`${CATEGORY_URL}/categories`, true, {
      method: "GET",
    });
  },
  getMainCategoryWithSubs: async () => {
    return await apiRequest(`api/main-category/category-with-subs`, true, {
      method: "GET"
    })
  }
};

export default categoryApi;
