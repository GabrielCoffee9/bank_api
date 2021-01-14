const express = require('express')
const connection = require('../database/connection')

const routes = express.Router()
const UserController = require('../controllers/UserController')

routes.get('/', (req, res) => {
    res.json({ message: "Welcome to Coffee Bank!" })
})

routes.post('/createUser', UserController.createUser)
routes.post('/deposit', UserController.Deposit)
routes.post('/withdraw', UserController.Withdraw)
routes.post('/payment', UserController.Payment)


module.exports = routes