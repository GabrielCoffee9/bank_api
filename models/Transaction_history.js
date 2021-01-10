const { Model, DataTypes } = require('sequelize')

class Transcation_history extends Model {
    static init(sequelize) {
        super.init({
            user_id: DataTypes.INTEGER,
            receive_user: DataTypes.STRING,
            sent_user: DataTypes.STRING,
            value: DataTypes.FLOAT,
            type: DataTypes.STRING
        }, {
            sequelize,
            tableName: 'transaction_history'
        })
    }
}

module.exports = Transcation_history