
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
async function getUserData(username) {
    var sqlText =
        `SELECT id, balance FROM users
            WHERE
            name = '${username}' `

    try {
        var [rows] = await conn.execute(sqlText)
    }
    catch (error) {
        console.log(error.sqlMessage)
        throw error
    }
    return [rows]
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
            var results = await conn.execute(sqlText)

        } catch (error) {
            console.log(error.sqlMessage)
            throw error

        }

        return res.json(results)
    }

    async Deposit(req, res) {
        const { username, value, type } = req.body

        if (username == undefined || value == undefined || type == undefined) {
            res.status(400).json({ error: "Some of the values in body is wrong" })
            throw error
        }

        if (value < 0) {
            res.status(400).json({ error: "value should be positive for operation deposit" })
            throw error
        }

        try {
            var data = await getUserData(username)

        } catch (error) {
            console.log(error.sqlMessage)
            throw error
        }

        const userid = data[0][0].id

        const sqlText =
            `UPDATE
                users
             SET
                balance = balance + ${value},
                updated_at = NOW()
             WHERE
                id = ${userid}`

        try {
            await conn.execute(sqlText)
            await newTransaction(userid, username, undefined, value, 'deposit', '')
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

            res.status(400).json({ error: "Some of the values in body is wrong" })
            return
        }

        if (value > 0) {
            res.status(400).json({ error: "value should be negative for operation Withdraw" })
            return
        }

        try {
            var data = await getUserData(username)

        } catch (error) {
            throw error

        }

        const balance = data[0][0].balance

        if (balance < (value * -1)) {
            res.status(400).json({ error: "The value is more than the user have in the balance account" })
            return
        }

        try {
            var data = await getUserData(username)

        } catch (error) {
            console.log(error.sqlMessage)
            throw error
        }

        const userid = data[0][0].id

        var sqlText =
            `UPDATE
            users
         SET
            balance = balance - ${value * -1},
            updated_at = NOW()
         WHERE
            id = ${userid}`

        try {
            await conn.execute(sqlText)
            await newTransaction(userid, receive_user, undefined, value, 'withdraw', '')
        }
        catch (error) {
            console.log(error.sqlMessage)
            throw error
        }

        return res.json({ message: "Withdraw successful" })
    }

    async Payment(req, res) {
        const { username, receive_user, sent_user, value, type, code } = req.body

        if (username == undefined || receive_user == undefined || value == undefined || type == undefined || code == undefined) {

            res.status(400).json({ error: "Some of the values in body is wrong" })
            return
        }


        if (value > 0) {
            res.status(400).json({ error: "value should be negative for operation Payment" })
            return

        }

        try {
            var data = await getUserData(username)

        } catch (error) {
            console.log(error.sqlMessage)
            throw error
        }

        const balance = data[0][0].balance
        const userid = data[0][0].id


        if (balance < (value * -1)) {
            res.status(400).json({ error: "The value is more than the user have in the balance account" })
            return
        }

        sqlText =
            `UPDATE
            users
         SET
            balance = balance - ${value * -1},
            updated_at = NOW()
         WHERE
            id = ${userid}`

        try {
            await conn.execute(sqlText)
            await newTransaction(userid, receive_user, sent_user, value, 'payment', code)
        }
        catch (error) {
            console.log(error.sqlMessage)
            throw error
        }

        return res.json({ message: "Payment successful" })

    }

    async Transfer(req, res) {
        const { receive_user, sent_user, value, type, mode } = req.body

        if (receive_user == undefined || value == undefined || type == undefined || mode == undefined) {
            res.status(400).json({ error: "Some of the values in body is wrong" })
            return
        }


        if (mode == 'receiving') {

            if (value < 0) {
                res.status(400).json({ error: "value should be positive for operation Receiving Transfer" })
                return

            }

            try {
                var data = await getUserData(receive_user)

            } catch (error) {
                console.log(error.sqlMessage)
                throw error
            }

            const userid = data[0][0].id

            const sqlText =
                `UPDATE
                    users
                SET
                    balance = balance + ${value},
                    updated_at = NOW()
                 WHERE
                    id = ${userid}`

            try {
                await conn.execute(sqlText)
                await newTransaction(userid, receive_user, sent_user, value, 'transfer', '')
            }
            catch (error) {
                console.log(error.sqlMessage)
                throw error
            }

            return res.json({ message: "Transfer successful" })
        }

        if (mode == 'sending') {

            if (value > 0) {
                res.status(400).json({ error: "value should be negative for operation Sending Transfer" })
                return

            }

            try {
                var data = await getUserData(sent_user)

            } catch (error) {
                console.log(error.sqlMessage)
                throw error
            }

            const balance = data[0][0].balance
            const userid = data[0][0].id

            if (balance < (value * -1)) {
                res.status(400).json({ error: "The value is more than the user have in the balance account" })
                return
            }

            const sqlText =
                `UPDATE
                    users
                SET
                    balance = balance - ${value * -1},
                    updated_at = NOW()
                WHERE
                    id = ${userid}`

            try {
                await conn.execute(sqlText)
                await newTransaction(userid, receive_user, sent_user, value, 'transfer', '')
            }
            catch (error) {
                console.log(error.sqlMessage)
                throw error
            }

            return res.json({ message: "Transfer successful" })
        }
    }
}

module.exports = new UserController()

