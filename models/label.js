'use strict';

var model = require('./base');
var Sequelize = require('sequelize');

let definition = {
    label_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    label_type: Sequelize.TEXT,
    namespace: Sequelize.TEXT,
    label_key: Sequelize.TEXT,
    language: Sequelize.TEXT,
    text: Sequelize.TEXT
};

let config = {
    indexes: [{
        unique: true,
        name: 'unique_label_key_language_account',
        fields: ['label_key', 'language', 'account_id']
    }],
    classMethods: {
        associate: function (models) {
            this.belongsTo(models.account, { as: 'Account', foreignKey: 'account_id' });
        }
    },
    instanceMethods: {
        setLabelKey: function(key){
            if(key === this.label_key){
                return false;
            }
            
            const parts = key.split('_');

            if(parts.length !== 3){
                throw new Error(Catalogue.getString('validation_apiLabels_incorrectKeyFormat', {key}));
            }

            const type = parts[0];
            const ns = parts[1];                

            this.label_key = key;
            this.label_type = type;
            this["namespace"] = ns; // avoid keyword clash

            return true;
        }
    }
};

module.exports = model('label', definition, config);