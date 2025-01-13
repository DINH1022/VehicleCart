const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.query.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('No token provided');
        }

        // Thêm validation mạnh hơn
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            audience: 'payment_system',
            issuer: 'main_server'
        });
        console.log("decode: ", decoded)
        // Kiểm tra thời gian token
        const tokenAge = Date.now() - decoded.timestamp;
        if (tokenAge > 15 * 60 * 1000) { // 15 minutes
            throw new Error('Token expired');
        }

        // Validate loại token
        if (decoded.type !== 'payment_auth') {
            throw new Error('Invalid token type');
        }

        // Thêm thông tin vào request
        req.userId = decoded.userId;
        req.orderAmount = decoded.orderAmount || 0;
        req.orderId = decoded.orderId || '';
        
        next();
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = authMiddleware;