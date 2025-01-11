import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
const convertToSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name, mainCategory } = req.body; // truyền main cate bằng ID
    if (!name || !mainCategory || !mainCategory.length) {
      return res
        .status(400)
        .json({ error: "Name and at least one main category are required" });
    }
    const nameSlug = convertToSlug(name);
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.json({ error: "Tên danh mục đã tồn tại" });
    }

    const category = await new Category({
      name,
      mainCategory,
      nameSlug,
    }).save();
    const populatedCategory = await category.populate("mainCategory");
    res.status(201).json(populatedCategory);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.json({ error: "Không tìm thấy danh mục" });
    }

    if (name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory && existingCategory._id.toString() !== categoryId) {
        return res.json({ error: "Tên danh mục này đã tồn tại" });
      }

      category.name = name;
      category.nameSlug = convertToSlug(name);
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const removeCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ error: "Không tìm thấy danh mục" });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const listCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({}).populate("mainCategory");
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "mainCategory"
    );
    if (!category) {
      return res.status(404).json({ error: "Không tìm thấy danh mục" });
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
