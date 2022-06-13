const express = require('express')
const Product = require('../models/product')
const authenticateToken = require('../authToken')
const router = express.Router();
router.get('/products', (req, res) => {
    Product.find()
        .then(result => res.send(result))
        .catch(err => res.send(err))
})

router.post('/products', authenticateToken, async (req, res) => {
    const exist = await Product.findOne({ 'productName': req.body.productName })
    if (!exist) {
        if (req.user.role == 'seller') {
            const product = new Product({ amountAvailable: req.body.amountAvailable, cost: req.body.cost, productName: req.body.productName, sellerId: req.user.sellerId })
            product.save()
                .then(result => res.send(result))
                .catch(err => res.send(err))
        } else {
            res.send('Only users with role seller can add products')
        }
    } else {
        res.send('Product already exists')
    }

})

router.put('/products', authenticateToken, async (req, res) => {
    const product = await Product.findOne({ 'productName': req.body.productName })
    if (product) {
        if (req.user.role == 'seller') {
            if (product.sellerId == req.body.sellerId) {
                Product.updateOne(req.body)
                    .then(result => res.send(result))
                    .catch(err => res.send)
            } else {
                res.send('Only the seller that created the product can update it')
            }
        } else {
            res.send('Only users with role seller can add products')
        }
    } else {
        res.send('Product don\'t exist')
    }
})

router.delete('/products', authenticateToken, async (req, res) => {
    const product = await Product.findOne({ 'productName': req.body.productName })
    if (product) {
        if (req.user.role == 'seller') {
            if (product.sellerId == req.body.sellerId) {
                Product.deleteOne()
                    .then(result => res.send(result))
                    .catch(err => res.send)
            } else {
                res.send('Only the seller that created the product can delete it')
            }
        } else {
            res.send('Only users with role seller can add products')
        }
    } else {
        res.send('Product don\'t exist')
    }
})

module.exports = router;