'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('lab_user', {
            user_id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            first_name: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            last_name: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            is_admin: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            password_hash: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            account_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'lab_account',
                    key: 'account_id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE
        }).then(() => {
            return queryInterface.addIndex('lab_user', ['email'], {
                indexName: 'unique_user_email',
                indiciesType: 'UNIQUE'
            });
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('lab_user');
    }
};
