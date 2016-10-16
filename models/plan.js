'use strict';

var model = require('./base');

module.exports = model('plan', (sequelize, DataTypes) => {
    return {
        name: DataTypes.TEXT,
        description: DataTypes.TEXT,
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        }
    }
}, {
        timestamps: false
    });