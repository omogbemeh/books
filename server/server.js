const express = require('express');
const app = express();
const connectDb = require('../config/db');

connectDb();

app.use(express.json({ extended: false }))

app.use('/api/users', require('./routes/user'));
app.use('/api/books', require('./routes/book'));

const PORT = process.env.PORT || 3001

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); })