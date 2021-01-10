const Sequelize = require('sequelize')
const dbConfig = require('../config/database')


const User = require('../models/User')
const Transaction_history = require('../models/Transaction_history')
const connection = new Sequelize(dbConfig)

User.init(connection)
Transaction_history.init(connection)


module.exports = connection