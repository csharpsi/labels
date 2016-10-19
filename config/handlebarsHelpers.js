"use strict";
var hbs = require('hbs');
var moment = require('moment');
var Catalogue = require('../catalogue');

class HandlebarsRegister {
    registerHelpers() {

        /**
         * Provides template support for localised labels
         */
        hbs.registerHelper('cat', (key) => {
            return Catalogue.getString(key);
        });

        hbs.registerHelper('date', (val, format) => {
            return moment(val).format(format);
        });
    }
}

module.exports = new HandlebarsRegister();