"use strict";

let S = require('string');

module.exports = function(name, definitionFunc, options){
    return function(sequelize, DataTypes) {
        let config = {
            tableName: `loc_${name}`,
            underscored: true
        };

        let definition = {};
        let obj = definitionFunc.call({}, sequelize, DataTypes);

        Object.keys(obj).forEach((key) => {
            let property = obj[key];
            let fieldName = S(key).underscore();

            // if already an object, we can assume the `type` property has been set
            if(typeof property === "object"){
                property.field = fieldName;
                definition[key] = property;
            }
            else {
                definition[key] = {
                    type: property,
                    field: fieldName
                }
            }           
            
        });

        // noop
        let extend = () => null;    

        if(options && Object.keys(options).length > 0){

            if(typeof options.extend === "function"){
                extend = options.extend;
                delete options.extend;
            }

            for(let p in options){
                config[p] = options[p];
            }
        }

        let Model = sequelize.define(name, definition, config);
        extend.call(Model, {name, definition, options});

        return Model;
    };
};