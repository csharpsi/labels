'use strict';

module.exports = function(sequelize, DataTypes) {
  var Account = sequelize.define('Account', {
    apiKey: DataTypes.TEXT,
    name: DataTypes.TEXT
  }, {
    tableName: 'loc_accounts',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.hasMany(models.Label);        
      }
    }
  });

  return Account;
};