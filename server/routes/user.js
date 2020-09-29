const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken')

router.post('/register', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').isLength({ min: 6 }),
],  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { email, password } = req.body  
        let user = await User.findOne({ email })
        if (user) {
            return res.status(401).json({ msg: 'User already exists' })
        }
        user = new User({
            email,
            password
        })
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtsecret'),
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token })
            }
        )
    } catch (err) {
        console.error(err.mesage);
    }
})

// router.post('/login', [
//     check('email', 'Please Enter a valid email').isEmail(),
//     check('password', 'Password is required').exists()
// ], 
//     async(req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({errors: errors.array()})
//     }
    
//     const { email, password } = req.body

//     try {
//         // Check if the user exists
//         let user = await User.findOne({ email })

//         if (!user) {
//             return res.status(400).json({ errors: [{ msg: 'Invalid credentials'}]})
//         }

//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(400).json({ errors: [{ msg: 'Invalid credentials'}]})
//         }
//         const payload = {
//             user: {
//                 id: user.id //user
//             }
//         }

//         jwt.sign(
//             payload, 
//             config.get('jwsecret'), // secret
//             {expiresIn: 360000}, // expiration period
//             (err, token) => {
//                 if (err) throw err;
//                 res.json({ token })
//             });

//     } catch(err) {
//         console.log(err.message);
//         res.status(500).send('Server Error')
        
//     }
    
// })

router.post('/login', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').exists()
], 
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }

    const { email, password } = req.body

    try {
        let user = await User.findOne({ email });
        if (!user) res.status(400).json({ errors: [{ msg: 'This email isnt registered' }]});
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }]})
        }
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtsecret'),
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err
                res.json({ token })
            }
        )
    } catch (err) {
        console.error(err.mesage);
        res.status(500).send('Server Error')
    }
    

})
module.exports = router