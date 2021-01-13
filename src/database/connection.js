const mysql = require('mysql2/promise')

const connection = mysql.createPool({
    host: 'sql10.freemysqlhosting.net',
    user: 'sql10386201',
    password: 'AqS9vQqFt2',
    database: 'sql10386201',
    waitForConnections: true,
    multipleStatements: true
})

module.exports = connection