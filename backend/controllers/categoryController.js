import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name, mainCategory } = req.body;  // truyền main cate bằng ID
    if (!name || !mainCategory || !mainCategory.length) {
      return res.status(400).json({ error: "Name and at least one main category are required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = await new Category({ name, mainCategory }).save();
    const populatedCategory = await category.populate('mainCategory');
    res.status(201).json(populatedCategory);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name, mainCategory } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (name) category.name = name;
    if (mainCategory && mainCategory.length > 0) category.mainCategory = mainCategory;

    const updatedCategory = await category.save();
    const populatedCategory = await updatedCategory.populate('mainCategory');
    res.json(populatedCategory);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const removeCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const listCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({}).populate('mainCategory');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('mainCategory');
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};
