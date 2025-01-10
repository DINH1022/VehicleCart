const express = require('express');
const router = express.Router();
const Account = require('../models/account');
const { generateToken } = require('../config/jwt');

// Create payment account
router.post('/create-account', async (req, res) => {
    try {
        const { userId } = req.body;
        
        // Check if account already exists
        const existingAccount = await Account.findOne({ id: userId });
        if (existingAccount) {
            return res.status(400).json({ message: 'Account already exists' });
        }

        // Create new account
        const account = await Account.create({
            id: userId,
            balance: 1000000000 // 1 billion VND
        });

        // Generate token
        const token = generateToken({ id: userId });

        res.status(201).json({ 
            message: 'Account created successfully',
            token,
            accountId: account.id
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
