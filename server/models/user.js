const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: 1,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        maxlength: 100
    },
    lastName: {
        type: String,
        maxlength: 100
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    }
});

module.exports = User = new mongoose.model('User', UserSchema);