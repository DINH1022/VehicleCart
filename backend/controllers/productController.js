import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import MainCategory from "../models/mainCategoryModel.js";
import Category from "../models/categoryModel.js";
import Cart from "../models/cartModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      rating: 0,
      numReviews: 0,
      reviews: [],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, brand, quantity, category, description, price } = req.fields;

    if (!name) throw new Error("Name is required");
    if (!brand) throw new Error("Brand is required");
    if (!quantity) throw new Error("Quantity is required");
    if (!category || !category.length)
      throw new Error("At least one category is required");
    if (!description) throw new Error("Description is required");
    if (!price) throw new Error("Price is required");

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

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const convertToSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/ /g, "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 8;
    const query = {};
    const { page, search, ...filterQuery } = req.query;
    const categoryConditions = [];
    const mainCategories = await MainCategory.find({});
    for (const mainCategory of mainCategories) {
      let paramName = mainCategory.name.toLowerCase();
      paramName = convertToSlug(paramName);

      if (filterQuery[paramName]) {
        const values = filterQuery[paramName]
          .split(",")
          .map((val) => val.trim());
        const subCategories = await Category.find({
          mainCategory: mainCategory._id,
          nameSlug: {
            $in: values.map((val) => new RegExp(`^${val}$`, "i")),
          },
        }).select("_id");

        if (subCategories.length > 0) {
          const categoryIds = subCategories.map((cat) => cat._id);
          categoryConditions.push({
            category: { $in: categoryIds },
          });
        }
      }
    }

    if (categoryConditions.length > 0) {
      query.$and = categoryConditions;
    }
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    const pageNumber = parseInt(page, 10) || 1;
    const skip = (pageNumber - 1) * pageSize;

    const count = await Product.countDocuments(query);
    const products = await Product.find(query).limit(pageSize).skip(skip);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

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

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if user already reviewed
      const alreadyReviewed = product.reviews.find((r) => {
        return r.user && r.user.toString() === req.user._id.toString();
      });

      if (alreadyReviewed) {
        return res.json({
          success: false,
          mes: "Bạn đã đánh giá sản phẩm này",
        });
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

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

const getReviewProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const reviews = product.reviews;
    return res.status(200).json({
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchTopRatingProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate({
        path: "category",
        populate: {
          path: "mainCategory",
          model: "MainCategory",
        },
      })
      .sort({ rating: -1 })
      .limit(12);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate({
        path: "category",
        populate: {
          path: "mainCategory",
          model: "MainCategory",
        },
      })
      .sort({ createdAt: -1 })
      .limit(12);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchTopSellingProducts = asyncHandler(async (req, res) => {
  try {
    const topProducts = await Cart.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
    ]);

    const productIds = topProducts.map((item) => item._id);

    let products = await Product.find({ _id: { $in: productIds } }).populate({
      path: "category",
      populate: {
        path: "mainCategory",
        model: "MainCategory",
      },
    });

    // If we have less than 12 products, add more products sorted by creation date
    if (products.length < 12) {
      const additionalProducts = await Product.find({
        _id: { $nin: productIds },
      })
        .populate({
          path: "category",
          populate: {
            path: "mainCategory",
            model: "MainCategory",
          },
        })
        .sort({ createdAt: -1 })
        .limit(12 - products.length);

      products = [...products, ...additionalProducts];
    }

    // Limit  12 products
    products = products.slice(0, 12);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchRelatedProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id }, // ne = not equal
      category: { $in: product.category },
    })
      .populate({
        path: "category",
        populate: {
          path: "mainCategory",
          model: "MainCategory",
        },
      })
      .limit(10);

    res.json(relatedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
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
  fetchTopRatingProducts,
  fetchTopSellingProducts,
  fetchNewProducts,
  fetchRelatedProducts,
  getReviewProduct,
};
