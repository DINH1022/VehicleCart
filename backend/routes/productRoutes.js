import express from "express";
import formidable from "express-formidable";
const route = express.Router();

import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

route
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, formidable(), addProduct);

route.route("/allproducts").get(fetchAllProducts);
route
  .route("/:id/reviews")
  .post(authenticate, authorizeAdmin, checkId, addProductReview);
route.get("/top", fetchTopProducts);
route.get("/new", fetchNewProducts);

route
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, formidable(), removeProduct);
export default route;
