const express = require("express");
const router = express.Router();
const { createAccount, createToken } = require("../controllers/authController");
router.post("/create-account", createAccount);
router.post("/request-token", createToken);
module.exports = router;
