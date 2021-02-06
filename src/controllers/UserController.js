
const User = require('../models/User')
const Transaction_history = require('../models/Transaction_history')
const conn = require("../database/connection")

class UserController {

    async createUser(request, response) {
        const { username, bvalue } = request.body

        if (username == undefined || bvalue == undefined) {
            return res.status(400).json({ error: "Error has occured in the received values" })
        }

        var result = await getUserData(username)

        if (result != undefined) {
            return response.status(400).json({ error: "This username already exists" })
        }

        await User.create({ name: username, balance: bvalue })

        return response.json({ "message": "User created successfully" })
    }

    async Deposit(request, response) {
        const { username, value } = request.body

        if (username == undefined || value == undefined) {
            response.status(400).json({ error: "Some of the values in body is wrong" })
            throw error
        }

        if (value < 0) {
            response.status(400).json({ error: "value should be positive for operation deposit" })
            throw error
        }

        var data = await getUserData(username)

        if (data == undefined) {
            return response.status(400).json({ error: "account not found" })
        }

        await User.increment({ balance: +value }, { where: { id: data.id } })

        await newTransaction(data.id, username, undefined, value, 'deposit', '')

        return response.json({ message: "Deposit successful" })
    }

    async Withdraw(request, response) {
        const { username, receive_user, value } = request.body

        if (username == undefined || receive_user == undefined || value == undefined) {
            return response.status(400).json({ error: "Some of the values in body is wrong" })
        }

        if (value > 0) {
            return response.status(400).json({ error: "value should be negative for operation Withdraw" })
        }
        var data = await getUserData(username)

        if (data == undefined) {
            return response.status(400).json({ error: "Account not found" })
        }

        const balance = data.balance

        if (balance < (value * -1)) {
            return response.status(400).json({ error: "The value is more than the user have in the balance account" })
        }

        const userid = data.id
        await User.increment({ balance: -(value * -1) }, { where: { id: data.id } })

        await newTransaction(userid, receive_user, undefined, value, 'withdraw', '')

        return response.json({ message: "Withdraw successful" })
    }
}

async function newTransaction(user_id, receive_user, sent_user, value, type, code) {
    await Transaction_history.create({
        user_id: user_id,
        receive_user: receive_user,
        sent_user: sent_user,
        value: value,
        type: type,
        code: code
    })
}

async function getUserData(username) {

    var [result] = await User.findAll({ where: { name: username } })

    if (result != undefined) {
        result = (result.get({ plain: true }))
    }
    return result
}

module.exports = new UserController()
