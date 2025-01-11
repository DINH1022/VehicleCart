import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { processPayment } from '../controllers/orderController.js';

const router = express.Router();

router.post('/payment', authenticate, processPayment);

export default router;
