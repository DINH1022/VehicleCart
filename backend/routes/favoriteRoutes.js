import express from "express";
import {
    getFavorites,
    addToFavorites,
    removeFavorites
} from "../controllers/favoriteController.js";
import {authenticate} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(authenticate, getFavorites).post(authenticate, addToFavorites);
router.route("/").delete(authenticate, removeFavorites);

export default router;