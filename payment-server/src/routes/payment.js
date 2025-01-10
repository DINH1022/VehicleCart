const express = require('express');
const router = express.Router();
const Account = require('../models/account');
const Transaction = require('../models/transaction');
const authMiddleware = require('../middleware/auth');

// System account ID (change this to your desired ID)
const SYSTEM_ACCOUNT_ID = "SYSTEM_ACCOUNT_001";

// Get account balance
router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ id: req.userId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.json({ balance: account.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Process payment
router.post('/pay', authMiddleware, async (req, res) => {
    const session = await Account.startSession();
    session.startTransaction();

    try {
        const { amount } = req.body;
        
        // Get user account
        const userAccount = await Account.findOne({ id: req.userId });
        if (!userAccount) {
            throw new Error('User account not found');
        }

        // Get system account
        const systemAccount = await Account.findOne({ id: SYSTEM_ACCOUNT_ID });
        if (!systemAccount) {
            throw new Error('System account not found');
        }

        // Check sufficient balance
        if (userAccount.balance < amount) {
            throw new Error('Insufficient balance');
        }

        // Update balances
        await Account.findOneAndUpdate(
            { id: req.userId },
            { $inc: { balance: -amount } }
        );

        await Account.findOneAndUpdate(
            { id: SYSTEM_ACCOUNT_ID },
            { $inc: { balance: amount } }
        );

        // Record transactions
        await Transaction.create([
            {
                accountId: userAccount._id,
                amount: amount,
                transactionType: 'debit'
            },
            {
                accountId: systemAccount._id,
                amount: amount,
                transactionType: 'credit'
            }
        ]);

        await session.commitTransaction();
        res.json({ message: 'Payment successful' });

    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
});

module.exports = router;
