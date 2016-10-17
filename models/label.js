'use strict';

var model = require('./base');
var Sequelize = require('sequelize');

let definition = {
    labelId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    labelType: Sequelize.TEXT,
    namespace: Sequelize.TEXT,
    labelKey: Sequelize.TEXT,
    language: Sequelize.TEXT,
    text: Sequelize.TEXT
};

let config = {
    indexes: [{
        unique: true,
        name: 'unique_label_key_language_account',
        fields: ['labelKey', 'language', 'accountId']
    }],
    classMethods: {
        associate: function (models) {
            this.belongsTo(models.account, { as: 'Account', foreignKey: 'account_id' });
        }
    }
};

module.exports = model('label', definition, config);