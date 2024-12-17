import e from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, brand, quantity, category, description, price } = req.fields;
    switch (true) {
      case !name:
        throw new Error("Name is required");
      case !brand:
        throw new Error("Brand is required");
      case !quantity:
        throw new Error("Quantity is required");
      case !category:
        throw new Error("Category is required");
      case !description:
        throw new Error("Description is required");
      case !price:
        throw new Error("Price is required");
    }
    const product = new Product({ ...req.fields });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// @desc    Update product details
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, brand, quantity, category, description, price } = req.fields;
    switch (true) {
      case !name:
        throw new Error("Name is required");
      case !brand:
        throw new Error("Brand is required");
      case !quantity:
        throw new Error("Quantity is required");
      case !category:
        throw new Error("Category is required");
      case !description:
        throw new Error("Description is required");
      case !price:
        throw new Error("Price is required");
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// @desc    Fetch products with pagination and search
// @route   GET /api/products/search
// @access  Public
const fetchProducts = asyncHandler(async (req, res) => {
  try {
    // Set number of products per page
    const pageSize = 6;

    // Create search query based on keyword
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i", // Case insensitive search
          },
        }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);
    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const fetchProductById = asyncHandler(async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Product not found" });
  }
});

// @desc    Fetch all products for homepage
// @route   GET /api/products/all
// @access  Public
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if user already reviewed
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      // Prevent multiple reviews from same user
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      // Create new review object
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      // Update product review statistics
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
};
