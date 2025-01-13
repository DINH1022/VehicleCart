const express = require("express");
const router = express.Router();
const { createAccount, createTokenOrder, createToken } = require("../controllers/authController");
router.post("/create-account", createAccount)
router.post("/create-token-order", createTokenOrder);
router.post("/request-token", createToken);
module.exports = router;
