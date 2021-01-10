const { Model, DataTypes } = require('sequelize')

class User extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            balance: DataTypes.FLOAT
        }, {
            sequelize
        })
    }
}

module.exports = User