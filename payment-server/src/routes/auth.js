const express = require('express');
const router = express.Router();
const Account = require('../models/account');
const { generateToken } = require('../config/jwt');

router.post('/create-account', async (req, res) => {
    try {
        const { userId } = req.body;
        
        // Kiểm tra tài khoản tồn tại
        const existingAccount = await Account.findOne({ id: userId });
        if (existingAccount) {
            // Nếu tài khoản đã tồn tại, trả về token luôn
            const token = generateToken({ id: userId });
            return res.json({ 
                message: 'Account exists',
                token,
                accountId: existingAccount.id
            });
        }

        // Tạo tài khoản mới nếu chưa tồn tại
        const account = await Account.create({
            id: userId,
            balance: 1000000000 // 1 billion VND
        });

        const token = generateToken({ id: userId });

        res.status(201).json({ 
            message: 'Account created successfully',
            token,
            accountId: account.id
        });
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
