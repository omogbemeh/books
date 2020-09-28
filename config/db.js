const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongodb')

const connectDB = async () => {
    try {
        await mongoose.connect(db,
            { useUnifiedTopology: true ,
              useNewUrlParser: true });
        console.log('Database is connected');
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = connectDB