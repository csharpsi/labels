"use strict";

var express = require('express');
var router = express.Router();
var models = require('../models');
var authorize = require('../authorize');
var Catalogue = require('../catalogue');
var querystring = require('querystring');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage });

const defaultLimit = 100;
const defaultOffset = 0;

/**
 * list of labels for currently logged in user's account'
 */
router.get('/', (req, res) => {
    const lang = req.query.lang;
    const type = req.query.type;
    const ns = req.query.ns;    
    let where = {
        account_id: req.user.account_id
    };

    if (lang) {
        where["language"] = lang;
    }

    if (type) {
        where["label_type"] = type;
    }

    if (ns) {
        where["namespace"] = ns;
    }

    let limit = parseInt(req.query.size || defaultLimit);

    if(isNaN(limit)) {
        limit = defaultLimit;
    }

    let offset = parseInt(req.query.offset || defaultOffset);

    if(isNaN(offset)){
        offset = defaultOffset;
    }    

    models.sequelize.Promise.all([
        models.label.findAll({
            where: { account_id: req.user.account_id },
            attributes: ['language'],
            group: ['language']
        }),
        models.label.findAll({
            where: where,
            attributes: ['namespace'],
            group: ['namespace']
        }),
        models.label.findAll({
            where: where,
            attributes: ['label_type'],
            group: ['label_type']
        }),
        models.label.findAndCountAll({
            where: where,
            limit: limit,
            offset: offset*limit
        })
    ]).spread((languages, namespaces, types, model) => {
        const pageStart = (offset*limit)+1;
        let pageEnd = limit*(offset+1);
        if(pageEnd > model.count){
            pageEnd = model.count;
        }        
        res.render('labels/list', { model, languages, namespaces, types, lang, type, ns, pageStart, pageEnd });
    }).catch((err) => {
        console.log(err);
        res.render('error', { message: Catalogue.getString('error_webui_labelsListError'), error: err });
    });
});

/**
 * Handle filters
 */
router.post('/', (req, res) => {
    let filters = {
        lang: req.body.lang,
        type: req.body.type,
        ns: req.body.ns
    };

    Object.keys(filters).forEach((key) => {
        if (!filters[key]) {
            delete filters[key];
        }
    });

    res.redirect(`/labels?${querystring.stringify(filters)}`);
});

/**
 * label bulk upload view
 */
router.get('/upload', (req, res) => {
    res.render('labels/upload');
});

/**
 * handle bulk upload of labels
 */
router.post('/upload', upload.single('translation'), (req, res) => {
    let data = {};
    const lang = req.body.lang;

    if (!lang) {
        return res.render('labels/upload', { err: Catalogue.getString('validation_labels_noLanguageCode') })
    }

    try {
        data = JSON.parse(req.file.buffer.toString());
    }
    catch (e) {
        console.error(e);
        return res.render('labels/uplaod', { err: e });
    }

    const keys = Object.keys(data);

    if (!keys.length) {
        return res.render('labels/upload', { err: Catalogue.getString('error_labels_emptyDictionary') });
    }

    let invalid = keys.filter((k) => k.split('_').length !== 3);

    if (invalid.length !== 0) {
        return res.render('labels/upload', { err: Catalogue.getString('error_labels_invalidDictionaryKeys') });
    }

    const batch = [];

    keys.forEach((key) => {
        let parts = key.split('_');
        batch.push({
            label_type: parts[0],
            namespace: parts[1],
            label_key: key,
            language: lang,
            text: data[key],
            account_id: req.user.account_id
        });
    });

    models.label.bulkCreate(batch)
        .then(() => {
            res.redirect('/labels');
        })
        .catch((err) => {
            res.render('labels/upload', { err });
        });
});

module.exports = router;