"use strict";

var express = require('express');
var router = express.Router();
var models = require('../../models');
var Catalogue = require('../../catalogue');

/**
 * Middleware to authorize API key
 */
router.use((req, res, next) => {
    let apiKey = req.query["api-key"] || req.headers["api-key"];

    if (!apiKey) {
        return res.status(403).json({ err: Catalogue.getString('error_api_missingApiKey') });
    }

    models.account.findOne({ where: { api_key: apiKey } })
        .then((account) => {
            if (!account) {
                return res.status(403).json({ err: Catalogue.getString('error_api_invalidApiKey') });
            }

            // todo check requests per second
            req.account = account;
            next();
        })
        .catch((err) => {
            res.status(500).json({ err });
        });
});

/**
 * /api/labels routes
 */
router.use('/labels', require('./labels'));


router.get('/', function (req, res, next) {
    res.render('apidocs');
});

router.get('/status', (req, res) => {
    res.json({ heads: req.headers })
});

module.exports = router;
