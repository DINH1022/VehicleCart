const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 1000000000 // 1 billion
    }
});

module.exports = mongoose.model('Account', accountSchema);