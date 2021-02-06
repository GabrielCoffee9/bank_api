const express = require('express')

const routes = express.Router()
const UserController = require('../controllers/UserController')

routes.get('/', (req, res) => {
    res.json({ message: "Welcome to Coffee Bank!" })
})

routes.post('/createUser', UserController.createUser)
routes.post('/deposit', UserController.Deposit)
routes.post('/withdraw', UserController.Withdraw)
routes.post('/payment', UserController.Payment)
routes.post('/transfer', UserController.Transfer)

module.exports = routes