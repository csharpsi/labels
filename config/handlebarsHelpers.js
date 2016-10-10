"use strict";
var hbs = require('hbs');
var Catalogue = require('../catalogue');

class HandlebarsRegister {
    registerHelpers() {

        /**
         * Provides template support for localised labels
         */
        hbs.registerHelper('cat', (key) => {
            return Catalogue.getString(key);
        });

    }
}

module.exports = new HandlebarsRegister();