import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    cleanCart
} from "../controllers/cartController.js";
import {authenticate} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(authenticate, getCart).post(authenticate, addToCart).put(authenticate, updateCartItem);
router.route("/:productId").delete(authenticate, removeFromCart);
router.route("/clean").delete(authenticate, cleanCart);

export default router;