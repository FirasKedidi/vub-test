require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/product')
const User = require('./models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authenticateToken = (req,res,next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if( token == null) {
        return res.sendStatus(401)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user) => {
            if (err) {
                return res.sendStatus(403)
                req.user = user
                next()
            }
           
        })
    }
}
mongoose.connect('mongodb://localhost/vub')
    .then(() => console.log('Connected to Mongodb'))
    .catch(err => console.log(err))

const app = express()
app.use(express.json())
app.post('/users', async (req, res) => {
    const exist = await User.findOne({ 'username': req.body.username })
    if (!exist) {
        try {
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            const user = new User({ username: req.body.username, password: hashedPassword, role: req.body.role })
            user.save()
                .then(result => res.send(result))
                .catch(err => res.send(err))
        } catch {
            res.status(500).send('something wrong with adding new user')
        }
    } else {
        res.status(400).send('user already exist')
    }
})

app.post('/users/login', async (req, res) => {
    const user = await User.findOne({ 'username': req.body.username })
    if (user) {
        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                newUser ={username:req.body.username}
                const accessToken = jwt.sign(newUser, process.env.ACCESS_TOKEN_SECRET)
                console.log(accessToken)
                res.json({ accessToken : accessToken })
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

app.get('/products', (req, res) => {
    Product.find()
        .then(result => res.send(result))
        .catch(err => res.send(err))
})

app.post('/products',authenticateToken, (req, res) => {
    product.save()
    .then(result => res.send(result))
    .catch(err => res.send(err))
})


app.listen(3000)