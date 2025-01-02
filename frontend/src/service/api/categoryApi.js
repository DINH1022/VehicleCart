import apiRequest from "./apiRequest.js";

const CATEGORY_URL = "api/category";
const MAIN_CATEGORY_URL = "api/main-category";
const categoryApi = {
  createSubCategory: async (newCategory, mainCateID) => {
    return await apiRequest(`${CATEGORY_URL}`, true, {
      method: "POST",
      body: JSON.stringify({
        name: newCategory,
        mainCategory: mainCateID,
      }),
    });
  },

  updateSubCategory: async (categoryId, updatedCategory) => {
    return await apiRequest(`${CATEGORY_URL}/${categoryId}`, true, {
      method: "PUT",
      body: JSON.stringify({
        name: updatedCategory,
      }),
    });
  },

  deleteSubCategory: async (categoryId) => {
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
      method: "GET",
    });
  },
  createMainCategory: async (name) => {
    return await apiRequest(`${MAIN_CATEGORY_URL}`, true, {
      method: "POST",
      body: JSON.stringify({ name: name }),
    });
  },
  deleteMainCategory: async (cateID) => {
    return await apiRequest(`${MAIN_CATEGORY_URL}/${cateID}`, true, {
      method: "DELETE",
    });
  },
  updateMainCategory: async (mainCateId, newMainCate) => {
    return await apiRequest(`${MAIN_CATEGORY_URL}/${mainCateId}`, true, {
      method: "PUT",
      body: JSON.stringify({
        name: newMainCate,
      }),
    });
  },
};

export default categoryApi;
