import MainCategory from "../models/mainCategoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import categoryModel from "../models/categoryModel.js";
const createMainCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const existingMainCategory = await MainCategory.findOne({ name });
    if (existingMainCategory) {
      return res.status(400).json({ error: "Main category already exists" });
    }

    const mainCategory = await new MainCategory({ name }).save();
    res.status(201).json(mainCategory);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const updateMainCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const mainCategory = await MainCategory.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!mainCategory) {
      return res.status(404).json({ error: "Main category not found" });
    }
    res.json(mainCategory);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const removeMainCategory = asyncHandler(async (req, res) => {
  try {
    const mainCategory = await MainCategory.findByIdAndDelete(req.params.id);
    if (!mainCategory) {
      return res.status(404).json({ error: "Main category not found" });
    }
    res.json(mainCategory);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const listMainCategories = asyncHandler(async (req, res) => {
  try {
    const mainCategories = await MainCategory.find({});
    res.json(mainCategories);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const getMainCategory = asyncHandler(async (req, res) => {
  try {
    const mainCategory = await MainCategory.findById(req.params.id);
    if (!mainCategory) {
      return res.status(404).json({ error: "Main category not found" });
    }
    res.json(mainCategory);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const mainCategories = await MainCategory.find({});
    const categoriesWithSubs = await Promise.all(
      mainCategories.map(async (main) => {
        const subCategories = await categoryModel.find({ mainCategory: main._id });
        return {
          _id: main._id,
          name: main.name,
          subCategories: subCategories,
        };
      })
    );
    return res.status(200).json({
      success: true,
      data: categoriesWithSubs
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
export {
  createMainCategory,
  updateMainCategory,
  removeMainCategory,
  listMainCategories,
  getMainCategory,
  getAllCategories,
};
