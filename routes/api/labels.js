"use strict";

var express = require('express');
var router = express.Router();
var models = require('../../models');
var fs = require('fs');
var path = require('path');
var attributes = ['key', ['text', 'value']]; // select key, text as value from...

/**
 * GET full dictionary for the given language
 */
router.get('/:lang', (req, res) => {
    const where = { lang: req.params.lang };
    models.label.findAll({attributes, where})
    .then((labels) => {
        res.status(200).json({result: toResult(labels), language: req.params.lang});
    })
    .catch((err) => {
        res.status(500).json({err});
    });  
});

/**
 * GET dictionary for given language filtered by type
 */
router.get('/:lang/type/:type', (req, res) => {
    const where = {lang: req.params.lang, type: req.params.type};
    models.label.findAll({attributes, where})
    .then((labels) => {
        res.status(200).json({result: toResult(labels), language: req.params.lang, type: req.params.type});
    })
    .catch((err) => {
        res.status(500).json({err});
    });
});

/**
 * GET dictionary for given language filtered by namespace
 */
router.get('/:lang/namespace/:ns', (req, res) => {
    const where = {lang: req.params.lang, namespace: req.params.ns};
    models.label.findAll({attributes, where})
    .then((labels) => {
        res.status(200).json({result: toResult(labels), language: req.params.lang, namespace: req.params.ns});
    })
    .catch((err) => {
        res.status(500).json({err});
    });
});

/**
 * GET dictionary for given language filtered by type and namespace
 */
router.get('/:lang/type/:type/namespace/:ns', (req, res) => {
    const where = {lang: req.params.lang, type: req.params.type, namespace: req.params.ns};
    models.label.findAll({attributes, where})
    .then((labels) => {
        res.status(200).json({result: toResult(labels), language: req.params.lang, type: req.params.type, namespace: req.params.ns});
    })
    .catch((err) => {
        res.status(500).json({err});
    });
});

/**
 * POST install new data from the localisation directory
 */
router.post('/__install-data', (req, res) => {
    let dirPath = path.join(__dirname, '..', '..', 'localisation');    
    let dir = fs.readdirSync(dirPath);    
    let installData = [];

    dir.forEach((filename) => {
        let contents = fs.readFileSync(path.join(dirPath, filename));
        let parts = filename.split('.');
        let lang = parts[1];
        let data = JSON.parse(contents);
        let dictionary = parseTranslation(data, lang);
        installData = installData.concat(dictionary);
    });

    models.label.destroy({truncate: true}).then(() => {
        models.label.bulkCreate(installData)
        .then(() => {
            res.status(201).json({rowCount: installData.length});
        })
        .catch((err) => {
            res.status(500).json({err: err.original.detail});
        });
    });      
});

function parseTranslation(dictionary, lang){
    let result = [];
    let keys = Object.keys(dictionary);

    keys.forEach((key) => {
        let parts = key.split('_');
        let type = parts[0];
        let namespace = parts[1];        
        const obj = {type, namespace, key, text: dictionary[key], lang};
        result.push(obj);
    });

    return result;
}

function toResult(labels){
    let obj = {};
    (labels || []).map((l) => l.dataValues).map((label) => {               
        obj[label.key] = label.value;        
    }); 
    return obj;       
}

module.exports = router;