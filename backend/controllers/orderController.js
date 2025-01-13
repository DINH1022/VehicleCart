import fetch from "node-fetch";
import https from "https";
import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/orderModel.js";

// Add this to handle self-signed certificates in development
const agent = new https.Agent({
  rejectUnauthorized: false,
});

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const order = await Order.create({
    user: req.user._id,
    items: items,
    shippingAddress,
    totalAmount: items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
  });

  res.status(201).json(order);
});

const processPayment = asyncHandler(async (req, res) => {
  const { totalAmount, items, note, phone, shippingAddress } = req.body;
  const userId = req.user._id;

  try {
    const order = await Order.create({
      user: userId,
      items: items,
      totalAmount: totalAmount,
      note: note,
      phone: phone,
      shippingAddress: shippingAddress,
      paymentStatus: "pending",
    });
    console.log("order: ", order);
    const tokenResponse = await fetch(
      "https://localhost:4000/api/auth/create-account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.PAYMENT_SERVER_API_KEY, // Thêm API key
        },
        body: JSON.stringify({
          userId: userId.toString(),
          orderDetails: {
            orderId: order._id,
            amount: totalAmount,
            items: items.length,
            createdAt: order.createdAt,
          },
        }),
        agent,
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`Payment account error: ${tokenData.message}`);
    }

    // Redirect to payment page
    res.json({
      redirectUrl: `https://localhost:4000/payment-page?token=${tokenData.token}&amount=${totalAmount}&orderId=${order._id}`,
      token: tokenData.token,
      orderId: order._id,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
const historyPayment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  try {
    const tokenResponse = await fetch(
      "https://localhost:4000/api/auth/request-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.PAYMENT_SERVER_API_KEY, // Thêm API key
        },
        body: JSON.stringify({
          userId: userId.toString(),
        }),
        agent,
      }
    );

    const tokenData = await tokenResponse.json();
    console.log("data: ", tokenData);
    if (tokenData.token) {
      res.json({
        redirectUrl: `https://localhost:4000/api/payment/history-payment-page?token=${tokenData.token}`,
        token: tokenData.token,
      });
    }
  } catch (error) {
    throw error;
  }
});
const updateOrderPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;

  const order = await Order.findByIdAndUpdate(
    orderId,
    { paymentStatus: status },
    { new: true }
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .populate("user", "email")
    .populate("items.product", "name image price");
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  const order = await Order.findByIdAndUpdate(
    orderId,
    { shippingStatus: status },
    { new: true }
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
});

const getRevenueStats = asyncHandler(async (req, res) => {
  const { period } = req.query; // 'month', 'quarter', or 'year'
  const currentYear = new Date().getFullYear();

  let groupBy;
  if (period === "month") {
    groupBy = {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" },
    };
  } else if (period === "quarter") {
    groupBy = {
      year: { $year: "$createdAt" },
      quarter: {
        $ceil: { $divide: [{ $month: "$createdAt" }, 3] },
      },
    };
  } else {
    groupBy = {
      year: { $year: "$createdAt" },
    };
  }

  const stats = await Order.aggregate([
    {
      $match: {
        paymentStatus: "completed",
        createdAt: { $gte: new Date(currentYear - 1, 0, 1) },
      },
    },
    {
      $group: {
        _id: groupBy,
        revenue: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.json(stats);
});

const getTotalOrders = asyncHandler(async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export {
  createOrder,
  processPayment,
  getOrders,
  getOrderById,
  updateOrderPaymentStatus,
  getAllOrders,
  updateOrderStatus,
  getRevenueStats,
  getTotalOrders,
  historyPayment,
};
