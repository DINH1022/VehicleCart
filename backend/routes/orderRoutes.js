import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import { processPayment, getOrders, getOrderById, updateOrderPaymentStatus, getAllOrders, updateOrderStatus, getRevenueStats, getTotalOrders, historyPayment } from '../controllers/orderController.js';

const router = express.Router();

router
    .route('/')
    .get(authenticate, getOrders);  

router.post('/payment', authenticate, processPayment);
router.get('/history-payment', authenticate, historyPayment)
router.put('/payment-status', authenticate, updateOrderPaymentStatus);

router
    .route('/:id')
    .get(authenticate, getOrderById);

// Admin routes
router.get('/admin/all', authenticate, authorizeAdmin, getAllOrders);
router.put('/admin/status/:id', authenticate, authorizeAdmin, updateOrderStatus);
router.get('/admin/revenue-stats', authenticate, authorizeAdmin, getRevenueStats);
router.get('/admin/total', authenticate, authorizeAdmin, getTotalOrders);

export default router;
