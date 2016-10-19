"use strict";

var express = require('express');
var router = express.Router();
var models = require('../models');
var authorize = require('../authorize');
var Catalogue = require('../catalogue');
var multer = require('multer');
var upload = multer({ dest: '/tmp' });

/**
 * list of labels for currently logged in user's account'
 */
router.get('/', (req, res) => {
    models.label.findAll({
        where: { account_id: req.user.account_id },
        limit: 50,
        offset: req.query.offset || 0
    }).then((results) => {
        res.render('labels/list', { results });
    }).catch((err) => {
        console.log(err);
        res.render('error', { message: Catalogue.getString('error_webui_labelsListError'), error: err });
    });
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
router.post('/upload', upload.single('zipfile'), (req, res) => {
    let zipFile = req.file;
    res.render('labels/upload');
});

module.exports = router;