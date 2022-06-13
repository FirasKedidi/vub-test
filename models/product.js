const mongoose = require('mongoose')
const internal = require('stream')
const Schema = mongoose.Schema

const productSchema = new Schema({
    amountAvailable: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    sellerId: {
        type: String
    }

})

const Product = mongoose.model('Product', productSchema)
module.exports = Product