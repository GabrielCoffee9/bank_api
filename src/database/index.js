const Sequelize = require('sequelize')
const dbConfig = require('../database/connection')

const User = require('../models/User')
const Transaction_history = require('../models/Transaction_history')
const { rawAttributes } = require('../models/User')

const connection = new Sequelize(dbConfig)

User.init(connection)
Transaction_history.init(connection)

module.exports = connection