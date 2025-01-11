const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { engine } = require('express-handlebars');
const connectDB = require('./config/db');
const paymentRoutes = require('./routes/payment');
const authRoutes = require('./routes/auth');

const app = express();

// Handlebars setup
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);

// Payment page route
app.get('/payment-page', (req, res) => {
    const { token, amount } = req.query;
    res.render('payment', {
        layout: 'main',
        token,
        amount: parseInt(amount).toLocaleString()
    });
});

// HTTPS configuration
const options = {
    key: fs.readFileSync(path.join(__dirname, '../certificates/private-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../certificates/certificate.pem'))
};

// Create HTTPS server
const PORT = process.env.PORT || 4000;
https.createServer(options, app).listen(PORT, () => {
    console.log(`Payment server running on port ${PORT}`);
});
