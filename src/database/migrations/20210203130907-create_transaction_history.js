'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('transaction_history', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            receive_user: {
                type: Sequelize.STRING,
                allowNull: false
            },
            sent_user: {
                type: Sequelize.STRING,
                allowNull: true
            },
            value: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            code: {
                type: Sequelize.STRING,
                allowNull: true
            }
        });

    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('transaction_history');
    }
};