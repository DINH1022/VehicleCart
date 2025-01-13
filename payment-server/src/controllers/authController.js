const jwt = require("jsonwebtoken");
const Account = require("../models/account");
const createAccount = async (req, res) => {
  try {
      const { userId } = req.body;
    if (!userId) {
      throw new Error("Missing required information");
    }
    // Kiểm tra tài khoản tồn tại
    const existingAccount = await Account.findOne({ id: userId });
    if (existingAccount) {
      return res.status(400).json({
        mess: "Tài khoản này đã có account",
      });
    }
    const account = await Account.create({
      id: userId,
      balance: 10000000000, // 1 billion
    });
    return res.status(200).json({
      accountId: account._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi tạo tài khoản",
      error: error.message,
    });
  }
};
const createTokenOrder = async (req, res) => {
  try {
    const { userId, orderDetails } = req.body;

    if (!userId || !orderDetails) {
      throw new Error("Missing required information");
    }

    // Kiểm tra tài khoản tồn tại
    const existingAccount = await Account.findOne({ id: userId });
    if (!existingAccount) {
      // Nếu tài khoản đã tồn tại, trả về token luôn
      return res.status(401).json({
        message: "Account of userID not found",
      });
    }
    const payload = {
      userId: userId,
      orderAmount: orderDetails.amount,
      orderId: orderDetails.orderId,
      timestamp: Date.now(),
      type: "payment_auth",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m", // thời gian hết hạn
      audience: "payment_system",
      issuer: "main_server",
    });

    return res.json({
      message: "Request token order successfully",
      token,
      accountId: existingAccount.id,
    });
    // Tạo tài khoản mới nếu chưa tồn tại
    // const account = await Account.create({
    //   id: userId,
    //   balance: 1000000000, // 1 billion
    // });

    // const payload = {
    //   userId: userId,
    //   orderAmount: orderDetails.amount,
    //   orderId: orderDetails.orderId,
    //   timestamp: Date.now(),
    //   type: "payment_auth",
    // };

    // const token = jwt.sign(payload, process.env.JWT_SECRET, {
    //   expiresIn: "15m",
    //   audience: "payment_system",
    //   issuer: "main_server",
    // });

    // res.status(201).json({
    //   message: "Account created successfully",
    //   token,
    //   accountId: account.id,
    // });
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(400).json({ message: error.message });
  }
};
const createToken = async (req, res) => {
  try {
    const userId = req.body.userId;
    const existingAccount = await Account.findOne({ id: userId });
    if (!existingAccount) {
      res.status(400).json({
        message: "Request token failed",
      });
    }
    const payload = {
      userId: userId,
      timestamp: Date.now(),
      type: "payment_auth",
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
      audience: "payment_system",
      issuer: "main_server",
    });
    console.log("token: ", token);
    res.status(201).json({
      message: "Request token successfully",
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  createAccount,
  createTokenOrder,
  createToken,
};
