
const conn = require("../database/connection")

async function newTransaction(user_id, receive_user, sent_user, value, type, code) {

    if (sent_user == undefined) {
        sent_user = ''
    }

    const sqlText =
        `INSERT INTO transaction_history 
            (   user_id,
                receive_user,
                sent_user,
                value,
                type,
                created_at, 
                updated_at,
                code
            ) 
            VALUES 
            (
                ${user_id},
                 '${receive_user}',
                 '${sent_user}',
                 ${value},
                 '${type}',
                 NOW(),
                 NOW(),
                 '${code}' 
            )`

    try {
        await conn.execute(sqlText)
    }
    catch (error) {
        console.log(error.sqlMessage)
        throw error
    }

}


class UserController {
    async createUser(req, res) {
        const { username, value } = req.body

        if (username == undefined || value == undefined) {
            return res.status(400).json({ error: "Error has occured in the received values" })
        }

        const sqlText =
            `INSERT INTO users 
        (
            name,
            balance,
            created_at, 
            updated_at
        ) 
        VALUES 
        (
            '${username}',
             ${value},
             (now),
             (now) 
        )`
        try {
            const results = await conn.execute(sqlText)

        } catch (error) {
            console.log(error.sqlMessage)
            throw error

        }

        return res.json(results)
    }

    async Deposit(req, res) {
        const { username, receive_user, value, type } = req.body

        if (username == undefined || receive_user == undefined || value == undefined || type == undefined) {
            console.log(username, receive_user, value, type)
            res.status(400).json({ error: "Some of the values in body is wrong" })
            throw error
        }


        if (value < 0) {
            res.status(400).json({ error: "value should be positive for operation deposit" })
            throw error
        }
        var sqlText =
            `SELECT id FROM users
            WHERE
            name = '${username}' `

        try {
            var results = await conn.execute(sqlText)
        }
        catch (error) {
            console.log(error.sqlMessage)
            throw error
        }
        const user_results = results[0][0]

        sqlText =
            `UPDATE
                users
             SET
                balance = balance + ${value},
                updated_at = NOW()
             WHERE
                id = ${user_results.id}`

        console.log(sqlText)
        try {
            await conn.execute(sqlText)
            await newTransaction(user_results.id, receive_user, undefined, value, 'deposit', '')
        }
        catch (error) {
            console.log(error.sqlMessage)
            throw error
        }
        return res.json({ message: "Deposit successful" })

    }

    async Withdraw(req, res) {
        const { username, receive_user, value, type } = req.body

        if (username == undefined || receive_user == undefined || value == undefined || type == undefined) {
            console.log(username, receive_user, value, type)
            res.status(400).json({ error: "Some of the values in body is wrong" })
            throw error
        }


        if (value > 0) {
            res.status(400).json({ error: "value should be negative for operation Withdraw" })
            throw error

        }
        var sqlText =
            `SELECT id, balance FROM users
        WHERE
        name = '${username}' `

        try {
            var results = await conn.execute(sqlText)
        }
        catch (error) {
            console.log(error.sqlMessage)
            throw error
        }
        const user_results = results[0][0]
        if (user_results.balance < (value * -1)) {
            res.status(400).json({ error: "The value is more than the user have in the balance account" })
            throw error
        }

        sqlText =
            `UPDATE
            users
         SET
            balance = balance - ${value * -1},
            updated_at = NOW()
         WHERE
            id = ${user_results.id}`

        console.log(sqlText)
        try {
            await conn.execute(sqlText)
            await newTransaction(user_results.id, receive_user, undefined, value, 'withdraw', '')
        }
        catch (error) {
            console.log(error.sqlMessage)
            throw error
        }
        return res.json({ message: "Withdraw successful" })

    }

}
module.exports = new UserController()

