const express = require('express')
const Product = require('../models/product')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const authenticateToken = require('../authToken')
const router = express.Router();
const coinsList = [5, 10, 20, 50, 100]

router.post('/user', async (req, res) => {
    const exist = await User.findOne({ 'username': req.body.username })
    if (!exist) {
        if (req.body.role == 'seller' || 'buyer') {
            try {
                const salt = await bcrypt.genSalt()
                const hashedPassword = await bcrypt.hash(req.body.password, salt)
                const user = req.body.role == 'buyer' ? new User({ username: req.body.username, password: hashedPassword, role: req.body.role, deposit: 0 }) : new User({ username: req.body.username, password: hashedPassword, role: req.body.role })
                user.save()
                    .then(result => res.send(result))
                    .catch(err => res.send(err))
            } catch {
                res.status(500).send('something wrong with adding new user')
            }
        } else {
            res.send('user need to have role of buyer or seller')
        }
    } else {
        res.status(400).send('user already exist')
    }
})

router.post('/users/login', async (req, res) => {
    const user = await User.findOne({ 'username': req.body.username })
    if (user) {
        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                newUser = user.role == 'seller' ? newUser = { username: req.body.username, password: req.body.password, role: user.role, sellerId: user._id } : newUser = { username: req.body.username, password: req.body.password, role: user.role, deposit: user.deposit }
                const accessToken = jwt.sign(newUser, process.env.ACCESS_TOKEN_SECRET)
                res.json({ accessToken: accessToken })
            } else {
                res.send('Not Allowed')
            }
        } catch {
            res.status(500).send('error on the server')
        }
    } else {
        res.status(400).send('user don\'t exist')
    }


})
router.post('/deposit', authenticateToken, (req, res) => {
    if (req.user.role == 'buyer') {
        if (coinsList.includes(req.body.coins)) {
            User.updateOne({ 'deposit': req.body.coins })
                .then(result => res.send(result))
                .catch(err => res.send)
            res.send('succesfully added')
        } else {
            res.send('Coins must be either 5 or 10 or 20 or 50 or 100')
        }
    } else {
        res.send('Only users with buyer role can deposit')
    }

})

router.post('/buy', authenticateToken, async (req, res) => {
    if (req.user.role == 'buyer') {
        const product = await Product.findOne({ '_id': req.body.productId })
        const newUser = await User.findOne({ 'username': req.user.username })
        if (product) {
            if ((parseInt(product.cost * req.body.amountOfProducts) <= newUser.deposit)) {
                const oldDeposit = newUser.deposit
                const total = parseInt(product.cost * req.body.amountOfProducts)
                const change = parseInt(oldDeposit-total)
                User.updateOne({'deposit':change})
                    .then(result => res.send(result))
                    .catch(err => res.send)

                if(coinsList.includes(change)){
                    res.json({product,total,change})
                } else {
                    res.json({product,total})
                }
            } else {
                res.send('buyer don\'t have enough money')
            }

        } else {
            res.send('Product don\'t exist')
        }


    } else {
        res.send('Only users with buyer role can deposit')
    }
})


router.post('/reset', authenticateToken, (req, res) => {
    if (req.user.role == 'buyer') {
        User.updateOne({ 'deposit': 0 })
            .then(result => res.send(result))
            .catch(err => res.send)
    } else {
        res.send('Only users with buyer role can deposit')
    }
})

module.exports = router;