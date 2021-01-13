const express = require('express')
const connection = require('../database/connection')

const routes = express.Router()
const UserController = require('../controllers/UserController')



routes.post('/createUser', UserController.createUser)

routes.get('/', (req, res) => {
    res.json({ message: "Welcome to Coffee Bank!" })
})


routes.post('/deposit', UserController.Deposit)
// routes.get('/', (req, res) => {
//     return res.json({ message: "hello world" })
// })

// routes.post('/createUser', UserController.createUser)

// routes.post('/deposit', UserController.Deposit)

// routes.post('/withdraw', UserController.Withdraw)

module.exports = routes