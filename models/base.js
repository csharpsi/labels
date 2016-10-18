"use strict";

let S = require('string');

module.exports = function (name, definition, options) {
    return function (sequelize, DataTypes) {
        let config = {
            tableName: `lab_${name}`,
            underscored: true
        };

        // noop
        let extend = () => null;

        if (options && Object.keys(options).length > 0) {

            if (typeof options.extend === "function") {
                extend = options.extend;
                delete options.extend;
            }

            for (let p in options) {
                config[p] = options[p];
            }
        }

        let Model = sequelize.define(name, definition, config);
        extend.call(Model, { name, definition, options });

        return Model;
    };
};