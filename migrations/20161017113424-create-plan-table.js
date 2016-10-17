'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('lab_plan', {
            plan_id: {
                type: Sequelize.TEXT,
                primaryKey: true
            },
            description: Sequelize.TEXT,
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            },
            max_api_requests_per_second: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            max_types: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            max_namespaces_per_type: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            max_labels_per_namespace: {
                type: Sequelize.INTEGER,
                allowNull: true
            }
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('lab_plan');
    }
};
