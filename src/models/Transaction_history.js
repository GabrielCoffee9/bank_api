const { Model, DataTypes } = require('sequelize')

class Transacation_history extends Model {
    static init(sequelize) {
        super.init({
            user_id: DataTypes.INTEGER,
            receive_user: DataTypes.STRING,
            sent_user: DataTypes.STRING,
            value: DataTypes.FLOAT,
            type: DataTypes.STRING,
            code: DataTypes.STRING
        }, {
            sequelize,
            tableName: 'transaction_history'
        })
    }
}

module.exports = Transacation_history 