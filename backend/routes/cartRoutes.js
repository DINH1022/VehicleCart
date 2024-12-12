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
router.route("/clean").delete(authenticate, cleanCart); // phải đặt trước route xóa có ID vì nếu không sẽ bị hiểu nhầm clean là ID
router.route("/:productId").delete(authenticate, removeFromCart);

export default router;