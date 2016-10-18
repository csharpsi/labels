'use strict';

var model = require('./base');
var Sequelize = require('sequelize');

let definition = {
    plan_id: {
        type: Sequelize.TEXT,
        primaryKey: true,
        validate: {
            isIn: ['Free', 'Mini', 'Pro', 'Enterprise']
        }
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
};

let config = {
    timestamps: false
};

module.exports = model('plan', definition, config);