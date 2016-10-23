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

    getString(key, replacementMap) {
        if(!Object.keys(dictionary).length) {
            throw new Error("Labels dictionary has not been initialised");
        }

        var text = dictionary[key];

        if(!text || !replacementMap) {
            return text;
        }

        const dic = Object.keys(replacementMap).map((key) => {
            return {key, value: replacementMap[key]};
        });

        if(dic.length > 0){
            dic.forEach((dic) => {
                text = text.replace(`{${dic.key}}`, dic.value);
            });
        }

        return text;
    }
}

module.exports = new Catalogue();