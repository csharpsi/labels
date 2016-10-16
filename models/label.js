'use strict';

var model = require('./base');

module.exports = model('label', (sequelize, DataTypes) => {
    return {
        type: DataTypes.TEXT,
        namespace: DataTypes.TEXT,
        key: DataTypes.TEXT,
        lang: DataTypes.TEXT,
        text: DataTypes.TEXT
    }
}, {
        indexes: [{
            unique: true,
            fields: ['key', 'lang']
        }]
    });