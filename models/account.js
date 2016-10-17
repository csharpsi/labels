'use strict';

var model = require('./base');
var Sequelize = require('sequelize');

let definition = {
    accountId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.TEXT,
    apiKey: Sequelize.TEXT
};

let config = {
    classMethods: {
        associate: function (models) {
            this.hasMany(models.label, { as: 'Labels' });
            this.hasMany(models.user, { as: 'Users', foreignKey: 'account_id' });
            this.belongsTo(models.plan, { as: 'Plan', foreignKey: 'plan_id' });
        }
    }
};

module.exports = model('account', definition, config);