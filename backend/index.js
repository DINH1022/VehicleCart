//packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors'
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import mainCategoryRoutes from "./routes/mainCategoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
//utils
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 600
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/main-category", mainCategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/favorites",favoriteRoutes)
app.use("/api/orders", orderRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(port, () => console.log(`Server running on port ${port}`));
