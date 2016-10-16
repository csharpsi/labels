'use strict';

var model = require('./base');

module.exports = model('account', (sequelize, DataTypes) => {
    return {
        apiKey: DataTypes.TEXT,
        name: DataTypes.TEXT
    }
}, {    
    classMethods: {
      associate: function(models) {        
        this.hasMany(models.label);
        this.belongsTo(models.plan);        
      }
    }
});