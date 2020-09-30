const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Book = require('../models/books')

router.route('/book')
// Get all books
.get(async (req, res) => {
    try {
        const books = await Book.find().sort({ date: -1 })
        res.json(books);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})
// Post a book
.post([auth, [
    check('name', 'Name of the book is required').not().isEmpty(),
    check('author', 'The author is required').not().isEmpty(),
    check('rating', 'Please rate the book').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, author, content, rating, pages, price } = req.body
    try {
        const book = new Book({
            name,
            author,
            content,
            rating,
            pages,
            price,
            user: req.user.id
        })
        await book.save();
        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
.patch(async (req, res) => {})
.delete(async (req, res) => {})

module.exports = router