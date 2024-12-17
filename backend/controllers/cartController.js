import asyncHandler from "../middlewares/asyncHandler.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

//get cart of user
const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name price image");

    if (!cart) {
        return res.status(200).json({ items: [], totalAmount: 0 });
    }
    res.status(200).json(cart);
});

//add item to cart
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: [{
                product: productId,
                quantity,
                price: product.price,
            }],
            totalAmount: product.price * quantity
        });
    } else {
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity, price: product.price });
        }

        cart.totalAmount = cart.items.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );
        await cart.save();
    }
    res.status(200).json(cart);
});

// update cart item quantity
const updateCartItem = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    const cartItem = cart.items.find(item => item.product.toString() === productId);
    if (!cartItem) {
        res.status(404);
        throw new Error("Item not found in cart");
    }

    cartItem.quantity = quantity;

    cart.totalAmount = cart.items.reduce((total, item) => 
        total + (item.price * item.quantity), 0
    );

    await cart.save();
    res.status(200).json(cart);
});

//remove item from cart

const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(item =>
        item.product.toString() !== productId
    );

    cart.totalAmount = cart.items.reduce((total, item) =>
        total + (item.price * item.quantity), 0
    );

    await cart.save();
    res.status(200).json(cart);
});

//clean cart

const cleanCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();
    res.status(200).json({message : "cart cleaned"});
});

export {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    cleanCart
};