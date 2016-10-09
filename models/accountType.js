'use strict';
module.exports = function(sequelize, DataTypes) {
  var AccountType = sequelize.define('AccountType', {
    name: DataTypes.TEXT,
    maxLabelCount: DataTypes.BIGINT,
  }, {
    tableName: 'loc_account_types',
    classMethods: {
      associate: function(models) {
        this.hasMany(models.Account);
      }
    }
  });
  return AccountType;
};