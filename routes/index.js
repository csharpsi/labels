"use strict";

var express = require('express');
var router = express.Router();
var Catalogue = require('../catalogue');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: Catalogue.getString('title'), lang: Catalogue.currentLanguage });
});

router.get('/lang/:lang', (req, res) => {
  Catalogue.initialise(req.params.lang);
  res.cookie('lang', req.params.lang, {maxAge: new Date(2147483647000), httpOnly: true});
  res.redirect('/');
});

module.exports = router;
