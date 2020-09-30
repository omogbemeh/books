const jwt = require('jsonwebtoken');
const config = require('config');
const secret = config.get('jwtsecret');

const auth = (req, res, next) => {
    try {
        const token = req.headers['x-auth-token']
        if (!token) res.status(401).json({ msg: 'No token, Unauthorized access'})
        const decoded = jwt.verify(token, secret)
        req.user = decoded.user
        next()
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = auth