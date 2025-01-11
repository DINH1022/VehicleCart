import fetch from 'node-fetch';
import https from 'https';
import asyncHandler from '../middlewares/asyncHandler.js';
import Order from '../models/orderModel.js';

// Add this to handle self-signed certificates in development
const agent = new https.Agent({
    rejectUnauthorized: false
});

const createOrder = asyncHandler(async (req, res) => {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    const order = await Order.create({
        user: req.user._id,
        items: items,
        shippingAddress,
        totalAmount: items.reduce((total, item) => total + item.price * item.quantity, 0)
    });

    res.status(201).json(order);
});

const processPayment = asyncHandler(async (req, res) => {
    const { totalAmount, items } = req.body;
    const userId = req.user._id;

    console.log('=== Payment Process Started ===');
    console.log('User ID:', userId);
    console.log('Total Amount:', totalAmount);
    console.log('Items:', JSON.stringify(items, null, 2));

    try {
        // Get payment token
        console.log('Requesting payment token...');
        const tokenResponse = await fetch('https://localhost:4000/api/auth/create-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId.toString() }),
            agent // Add this for development
        });

        const tokenData = await tokenResponse.json();
        console.log('Token Response:', tokenData);

        if (!tokenResponse.ok) {
            console.error('Token request failed:', tokenData);
            throw new Error(`Failed to get payment token: ${tokenData.message}`);
        }

        const { token } = tokenData;

        // Process payment
        console.log('Processing payment with token...');
        const paymentResponse = await fetch('https://localhost:4000/api/payment/pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount: totalAmount }),
            agent // Add this for development
        });

        const paymentResult = await paymentResponse.json();
        console.log('Payment Response:', paymentResult);

        if (!paymentResponse.ok) {
            console.error('Payment failed:', paymentResult);
            throw new Error(`Payment failed: ${paymentResult.message}`);
        }

        // Create order record
        console.log('Creating order record...');
        const order = await Order.create({
            user: userId,
            items,
            totalAmount,
            paymentStatus: 'completed',
            paymentId: paymentResult.transactionId
        });

        console.log('Order created successfully:', order._id);
        console.log('=== Payment Process Completed ===');

        res.status(201).json({
            success: true,
            order,
            message: 'Payment processed successfully'
        });

    } catch (error) {
        console.error('=== Payment Process Failed ===');
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

export { createOrder, processPayment };
