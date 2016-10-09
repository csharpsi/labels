"use strict";

const fs = require('fs');
const path = require('path');

let dictionary = {};

class Catalogue {

    initialise(lang) {
        if(this.currentLanguage === lang){
            return;
        }
        
        this.currentLanguage = lang;
        let dirPath = path.join(__dirname, 'localisation');
        let dir = fs.readdirSync(dirPath);
        let file = dir.filter((f) => f === `labels.${lang}.json`)[0];

        if(!file){
            throw new Error(`Cannot find labels file for language '${lang}'`);
        }

        let contents = fs.readFileSync(path.join(dirPath, file));
        dictionary = JSON.parse(contents);
    }

    getString(key, defaultValue) {
        if(!Object.keys(dictionary).length) {
            throw new Error("Labels dictionary has not been initialised");
        }

        return dictionary[key] || defaultValue;
    }
}

module.exports = new Catalogue();