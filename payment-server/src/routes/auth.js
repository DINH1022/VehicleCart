const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Account = require('../models/account');

router.post('/create-account', async (req, res) => {
    try {
        const { userId, orderDetails } = req.body;
        
        // Thêm validation
        if (!userId || !orderDetails) {
            throw new Error('Missing required information');
        }

        // Kiểm tra tài khoản tồn tại
        const existingAccount = await Account.findOne({ id: userId });
        if (existingAccount) {
            // Nếu tài khoản đã tồn tại, trả về token luôn
            const payload = {
                userId: userId,
                orderAmount: orderDetails.amount,
                orderId: orderDetails.orderId,
                timestamp: Date.now(),
                type: 'payment_auth'
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '15m', // thời gian hết hạn
                audience: 'payment_system',
                issuer: 'main_server'
            });

            return res.json({ 
                message: 'Account exists',
                token,
                accountId: existingAccount.id
            });
        }

        // Tạo tài khoản mới nếu chưa tồn tại
        const account = await Account.create({
            id: userId,
            balance: 1000000000 // 1 billion 
        });

        const payload = {
            userId: userId,
            orderAmount: orderDetails.amount,
            orderId: orderDetails.orderId,
            timestamp: Date.now(),
            type: 'payment_auth'
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '15m', 
            audience: 'payment_system',
            issuer: 'main_server'
        });

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
