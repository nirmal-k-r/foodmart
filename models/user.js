const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    address: String,
    phoneNumber: String,
    password: {
        type: String,
        required: true
    },
    token: { //authentication token
        type: String,
        default: null
    },
    role: {
        type: String,
        default: 'user'
    }
});

const User=mongoose.model('User', userSchema);
module.exports = User;