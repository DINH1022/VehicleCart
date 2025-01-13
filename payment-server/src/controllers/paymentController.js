const express = require("express");
const Account = require("../models/account");
const Transaction = require("../models/transaction");

const SYSTEM_ACCOUNT_ID = "SYSTEM_ACCOUNT_001";
const getAccountBalance = async (req, res) => {
  try {
    const account = await Account.findOne({ id: req.userId });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    res.json({ balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getPageHistoryPayment = async (req, res) => {
  const account = await Account.findOne({ id: req.userId });
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }
  const temp = await Transaction.find({ accountId: account._id });
  const transactions = temp.map((transaction) => {
    return {
      ...transaction.toObject(),
      userId: req.userId,
    };
  });
  res.render("transaction", { transactions });
};
const processPayment = async (req, res) => {
  const session = await Account.startSession();
  session.startTransaction();

  console.log("\n=== Payment Server: Transaction Started ===");
  console.log("Time:", new Date().toISOString());

  try {
    const { amount } = req.body;
    console.log("Transaction Details:", {
      userId: req.userId,
      amount: amount,
      requestHeaders: req.headers,
    });

    // Get user account
    const userAccount = await Account.findOne({ id: req.userId });
    console.log("User Account Status:", {
      found: !!userAccount,
      balance: userAccount?.balance,
      accountId: userAccount?.id,
    });

    if (!userAccount) {
      throw new Error("User account not found");
    }
    const transaction = await Transaction.create({
      accountId: userAccount._id,
      amount: amount,
    });
    // Get system account
    const systemAccount = await Account.findOne({ id: SYSTEM_ACCOUNT_ID });
    console.log("System Account Status:", {
      found: !!systemAccount,
      balance: systemAccount?.balance,
    });

    if (!systemAccount) {
      throw new Error("System account not found");
    }

    // Check sufficient balance
    console.log("Balance Check:", {
      required: amount,
      available: userAccount.balance,
      sufficient: userAccount.balance >= amount,
    });

    if (userAccount.balance < amount) {
      throw new Error(
        `Insufficient balance: Required ${amount}, Available ${userAccount.balance}`
      );
    }

    // Update balances
    const updatedUserAccount = await Account.findOneAndUpdate(
      { id: req.userId },
      { $inc: { balance: -amount } },
      { new: true }
    );

    const updatedSystemAccount = await Account.findOneAndUpdate(
      { id: SYSTEM_ACCOUNT_ID },
      { $inc: { balance: amount } },
      { new: true }
    );
    transaction.status = true;
    transaction.save();
    console.log("Transaction Results:", {
      userNewBalance: updatedUserAccount.balance,
      systemNewBalance: updatedSystemAccount.balance,
      transactionAmount: amount,
    });

    await session.commitTransaction();
    console.log("=== Transaction Completed Successfully ===\n");

    res.json({
      message: "Payment successful",
      transactionId: Date.now().toString(),
      newBalance: updatedUserAccount.balance,
    });
  } catch (error) {
    console.error("=== Transaction Failed ===");
    console.error("Error Details:", {
      message: error.message,
      stack: error.stack,
      time: new Date().toISOString(),
    });

    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
module.exports = {
  getAccountBalance,
  getPageHistoryPayment,
  processPayment,
};
