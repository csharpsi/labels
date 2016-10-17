'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('lab_account', {
            account_id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            api_key: Sequelize.TEXT,
            name: Sequelize.TEXT,
            plan_id: {
                type: Sequelize.TEXT,
                references: {
                    model: 'lab_plan',
                    key: 'plan_id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('lab_account');
    }
};
