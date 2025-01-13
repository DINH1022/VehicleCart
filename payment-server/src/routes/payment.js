const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { getAccountBalance, getPageHistoryPayment, processPayment } = require("../controllers/paymentController");
const SYSTEM_ACCOUNT_ID = "SYSTEM_ACCOUNT_001";
router.get("/balance", authMiddleware, getAccountBalance);
router.get("/history-payment-page", authMiddleware, getPageHistoryPayment)
router.post("/pay", authMiddleware, processPayment)


module.exports = router;
