"use strict";

var express = require('express');
var router = express.Router();
var models = require('../../models');
var fs = require('fs');
var path = require('path');
var attributes = [['label_key', 'key'], ['text', 'value']];

/**
 * GET full dictionary for the given language
 */
router.get('/:lang', (req, res) => {
    const where = { language: req.params.lang, account_id: req.account.account_id };
    models.label.findAll({ attributes, where })
        .then((labels) => {
            res.status(200).json({ result: toResult(labels), language: req.params.lang });
        })
        .catch((err) => {
            res.status(500).json({ err });
        });
});

/**
 * GET dictionary for given language filtered by type
 */
router.get('/:lang/type/:type', (req, res) => {
    const where = { language: req.params.lang, label_type: req.params.type, account_id: req.account.account_id };
    models.label.findAll({ attributes, where })
        .then((labels) => {
            res.status(200).json({ result: toResult(labels), language: req.params.lang, type: req.params.type });
        })
        .catch((err) => {
            res.status(500).json({ err });
        });
});

/**
 * GET dictionary for given language filtered by namespace
 */
router.get('/:lang/namespace/:ns', (req, res) => {
    const where = { language: req.params.lang, namespace: req.params.ns, account_id: req.account.account_id };
    models.label.findAll({ attributes, where })
        .then((labels) => {
            res.status(200).json({ result: toResult(labels), language: req.params.lang, namespace: req.params.ns });
        })
        .catch((err) => {
            res.status(500).json({ err });
        });
});

/**
 * GET dictionary for given language filtered by type and namespace
 */
router.get('/:lang/type/:type/namespace/:ns', (req, res) => {
    const where = { language: req.params.lang, label_type: req.params.type, namespace: req.params.ns, account_id: req.account.account_id };
    models.label.findAll({ attributes, where })
        .then((labels) => {
            res.status(200).json({ result: toResult(labels), language: req.params.lang, type: req.params.type, namespace: req.params.ns });
        })
        .catch((err) => {
            res.status(500).json({ err });
        });
});

/**
 * POST install new data and append to existing
 */
router.post('/:lang/append', (req, res) => {
    const dictionary = parseTranslation(req.body, req.params.lang, req.account.account_id);
    const keys = dictionary.map((label) => label.label_key).filter((val, idx, arr) => arr.indexOf(val) === idx);

    models.label.count({        
        where: {
            label_key: {$in: keys}, 
            language: req.params.lang, 
            account_id: req.account.account_id
        }
    })
    .then((result) => {
        if(result > 0){            
            res.status(409).json({err: 'conflicting keys found'});
            throw new Error(409);
        }        
    })
    .then(() => {
        return models.label.bulkCreate(dictionary);
    })
    .then(() => {
        res.status(200).json({created: dictionary.length});
    })
    .catch((e) => {
        console.error(e);
    });
});

/**
 * PUT update the text for the given id
 */
router.put('/:lang/:id', (req, res) => {
    const where = { language: req.params.lang, label_key: req.params.key, account_id: req.account.account_id };

});

function parseTranslation(dictionary, language, accountId) {
    let result = [];
    let keys = Object.keys(dictionary);

    keys.forEach((key) => {
        let parts = key.split('_');
        let label_type = parts[0];
        let namespace = parts[1];
        const obj = { label_type, namespace, label_key: key, text: dictionary[key], language, account_id: accountId };
        result.push(obj);
    });

    return result;
}

function toResult(labels) {
    let obj = {};
    (labels || []).map((l) => l.dataValues).map((label) => {
        obj[label.key] = label.value;
    });
    return obj;
}

module.exports = router;