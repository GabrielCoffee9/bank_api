const Transcation_history = require('../models/Transaction_history')
const User = require('../models/User')

module.exports = {
    async create(req, res) {
        const { name, balance } = req.body
        const user = await User.create({ name, balance })

        return res.json(user)
    },

    async Deposit(req, res) {
        const { name, value, type } = req.body

        const user = await User.findAll({ attributes: ['id'], where: { name }, raw: true })

        if (user == '') {
            return res.status(400).json({ error: "User not found" })
        }

        if (value < 0) {
            return res.status(400).json({ error: "The value should be positive for operations like Deposit" })
        }

        if (type != 'deposit') {
            return res.status(400).json({ error: "The type should be 'deposit' for operation Deposit" })
        }

        await User.increment({ balance: +value }, { where: { name: name } })

        const transac_history = await Transcation_history.create({
            user_id: user.map((User) => User.id),
            receive_user: name,
            value: value,
            type: type

        })
        return res.json({ message: "Deposit successful" })
    },

    async Withdraw(req, res) {
        const { name, value, type } = req.body

        const user = await User.findAll({ attributes: ['id'], where: { name }, raw: true })

        if (user == '') {
            return res.status(400).json({ error: "User not found" })
        }

        if (value > 0) {
            return res.status(400).json({ error: " The value should be negative for operations like Withdraw" })
        }

        if (type != 'withdraw') {
            return res.status(400).json({ error: "The type should be 'withdraw' for operation Withdraw" })
        }

        await User.decrement({ balance: -value }, { where: { name: name } })

        const transac_history = await Transcation_history.create({
            user_id: user.map((User) => User.id),
            receive_user: name,
            value: value,
            type: type

        })
        return res.json({ message: "Withdraw successful" })
    }
}