'use strict';
module.exports = function(sequelize, DataTypes) {
  var Label = sequelize.define('Label', {
    type: DataTypes.TEXT,
    namespace: DataTypes.TEXT,
    key: DataTypes.TEXT,
    lang: DataTypes.TEXT,
    text: DataTypes.TEXT
  }, {
    tableName: 'loc_labels',
    indexes: [{
      unique: true,
      fields: ['key', 'lang']
    }],
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Label;
};