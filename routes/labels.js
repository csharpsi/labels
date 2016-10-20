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

/**
 * list of labels for currently logged in user's account'
 */
router.get('/', (req, res) => {
    const lang = req.query.lang;
    let where = {
        account_id: req.user.account_id
    };

    if (lang) {
        where.language = lang;
    }

    models.sequelize.Promise.all([
        models.label.findAll({
            where: { account_id: req.user.account_id },
            attributes: ['language'],
            group: ['language']
        }),
        models.label.findAll({
            where: where,
            limit: 50,
            offset: req.query.offset || 0
        })
    ]).spread((languages, results) => {
        //const languages = results.map((r) => r.language).filter((val, index, self) => self.indexOf(val) === index);
        res.render('labels/list', { results, languages, lang });
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
        namespace: req.body["namespace"]
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