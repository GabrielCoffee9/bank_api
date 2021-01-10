const express = require('express')
const { listAll, Deposit } = require('../controllers/UserController')

const UserController = require('../controllers/UserController')
const User = require('../models/User')

const routes = express.Router()

routes.get('/', (req, res) => {
    return res.json({ message: "hello world" })
})

routes.post('/createUser', UserController.create)

routes.post('/deposit', UserController.Deposit)

routes.post('/withdraw', UserController.Withdraw)

module.exports = routes