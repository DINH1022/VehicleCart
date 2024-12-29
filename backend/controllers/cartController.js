import asyncHandler from "../middlewares/asyncHandler.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

//get cart of user
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name price image brand"
  );

  if (!cart) {
    return res.status(200).json({ items: [], totalAmount: 0 });
  }
  res.status(200).json(cart);
});

//add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    res.status(400);
    throw new Error("Invalid product ID or quantity");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error(`Only ${product.countInStock} items available`);
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [
        {
          product: productId,
          quantity,
          price: product.price,
        },
      ],
      totalAmount: product.price * quantity,
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      if (existingItem.quantity + quantity > product.stock) {
        res.status(400);
        throw new Error(`Cannot add more than ${product.countInStock} items`);
      }
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    await cart.save();
  }
  res.status(200).json(cart);
});

const addItemsToCart = asyncHandler(async (req, res) => {
  try {
    const { cartItems } = req.body;
    if (!cartItems) {
      return res.json({
        success: true,
      });
    }
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalAmount: 0,
      });
    }
    for (const item of cartItems) {
      const { product, quantity } = item;

      const p = await Product.findById(product._id);
      if (!p) {
        continue;
        return res.status(404).json({
          success: false,
          message: `Không tìm thấy sản phẩm với id ${product._id}`,
        });
      }

      if (p.countInStock < quantity) {
        continue;
        return res.status(400).json({
          success: false,
          message: `Chỉ còn ${p.countInStock} sản phẩm ${p.name} trong kho`,
        });
      }

      const existingItemIndex = cart.items.findIndex(
        (cartItem) => cartItem.product.toString() === product._id
      );

      if (existingItemIndex !== -1) {
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;
        if (newQuantity > product.countInStock) {
          continue;
          return res.status(400).json({
            success: false,
            message: `Không thể thêm quá ${p.countInStock} sản phẩm ${p.name}`,
          });
        }
        cart.items[existingItemIndex].quantity = newQuantity;
      } else {
        cart.items.push({
          product: product._id,
          quantity,
          price: product.price,
        });
      }
    }

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name image price countInStock",
    });

    return res.status(200).json(populatedCart);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi thêm vào giỏ hàng",
      error: error.message,
    });
  }
});

// update cart item quantity
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 0) {
    res.status(400);
    throw new Error("Invalid product ID or quantity");
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const cartItem = cart.items.find(
    (item) => item.product.toString() === productId
  );
  if (!cartItem) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  cartItem.quantity = quantity;

  cart.totalAmount = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  await cart.save();
  res.status(200).json(cart);
});

//remove item from cart

const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required");
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  cart.totalAmount = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
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
  res.status(200).json({ message: "cart cleaned" });
});

export {
  getCart,
  addToCart,
  updateCartItem,
  addItemsToCart,
  removeFromCart,
  cleanCart,
};
