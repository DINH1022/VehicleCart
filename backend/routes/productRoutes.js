import express from "express";
import formidable from "express-formidable";
import uploader from "../config/cloudinary.config.js";
const route = express.Router();

import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopRatingProducts,
  fetchTopSellingProducts,
  fetchRelatedProducts,
  fetchNewProducts,
  getReviewProduct
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

route
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, addProduct);

route.route("/allproducts").get(fetchAllProducts);
route.get("/topRating", fetchTopRatingProducts);
route.get("/topSelling", fetchTopSellingProducts);
route.get("/new", fetchNewProducts);
route.get("/:id/related", fetchRelatedProducts)
route
  .route("/:id/reviews")
  .post(authenticate, checkId, addProductReview)
  .get(getReviewProduct)

route.post("/upload", authenticate, uploader.single("image"), (req, res) => {
  try {
    if (req.file) {
      res.json({ url: req.file.path });
    } else {
      res.status(400).json({ error: "No file uploaded" });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

route
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, formidable(), removeProduct);
export default route;