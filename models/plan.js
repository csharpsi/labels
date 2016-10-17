'use strict';

var model = require('./base');
var Sequelize = require('sequelize');

let definition = {
    planId: {
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
    maxApiRequestsPerSecond: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    maxTypes: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    maxNamespacesPerType: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    maxLabelsPerNamespace: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
};

let config = {
    timestamps: false
};

module.exports = model('plan', definition, config);