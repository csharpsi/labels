"use strict";
var hbs = require('hbs');
var moment = require('moment');
var Catalogue = require('../catalogue');

class HandlebarsRegister {
    registerHelpers() {

        /**
         * Provides template support for localised labels
         */
        hbs.registerHelper('cat', (key) => Catalogue.getString(key));

        hbs.registerHelper('date', (val, format) => moment(val).format(format));

        hbs.registerHelper('eq', function (left, right, options) {
            if (left === right) {
                return options.fn(this);
            }
            else {
                return options.inverse(this);
            }
        });

        hbs.registerHelper('neq', function(left, right, options){
            if(left !== right){
                return options.fn(this);
            }
            else {
                return options.inverse(this);
            }
        });
    }
}

module.exports = new HandlebarsRegister();