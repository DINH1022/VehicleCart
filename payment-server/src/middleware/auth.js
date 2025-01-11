const { verifyToken } = require('../config/jwt');

const authMiddleware = (req, res, next) => {
    console.log('\n=== Auth Middleware Check ===');
    console.log('Headers:', req.headers);
    
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('Auth Failed: No token or invalid format');
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token received:', token.substring(0, 20) + '...');
        
        const decoded = verifyToken(token);
        console.log('Token decoded:', decoded);
        
        req.userId = decoded.id;
        console.log('User ID extracted:', req.userId);
        console.log('=== Auth Check Complete ===\n');
        
        next();
    } catch (error) {
        console.error('Auth Error:', {
            message: error.message,
            stack: error.stack
        });
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;