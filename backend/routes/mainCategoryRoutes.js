import express from "express";
const router = express.Router();
import {
  createMainCategory,
  updateMainCategory,
  removeMainCategory,
  listMainCategories,
  getMainCategory,
  getAllCategories,
} from "../controllers/mainCategoryController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router
  .route("/")
  .post(authenticate, authorizeAdmin, createMainCategory)
  .get(listMainCategories);

router.route("/category-with-subs").get(getAllCategories);
router
  .route("/:id")
  .get(getMainCategory)
  .put(authenticate, authorizeAdmin, updateMainCategory)
  .delete(authenticate, authorizeAdmin, removeMainCategory);

export default router;
