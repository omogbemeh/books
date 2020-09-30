const mongoose = require('mongoose');
const User = require('./user')

const BookSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        require: true
    },
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: 'n/a'
    },
    pages: {
        type: String,
        default: 'n/a'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    price: {
        type: String,
        default: 'n/a'
    }
}, { timestamps: true })

module.exports = Book = new mongoose.model('Books', BookSchema)