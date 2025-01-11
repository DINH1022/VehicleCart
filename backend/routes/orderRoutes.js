import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { processPayment, getOrders, getOrderById, updateOrderPaymentStatus } from '../controllers/orderController.js';

const router = express.Router();

router
    .route('/')
    .get(authenticate, getOrders);  

router.post('/payment', authenticate, processPayment);

router.put('/payment-status', authenticate, updateOrderPaymentStatus);

router
    .route('/:id')
    .get(authenticate, getOrderById);

export default router;
