"use strict";

var express = require('express');
var router = express.Router();
var labels = require('./labels');
var models = require('../../models');

router.use((req, res, next) => {
  let apiKey = req.headers["api-key"];
  next();

});

router.use('/labels', labels);

router.get('/', function(req, res, next) {
  res.render('apidocs');
});

router.get('/status', (req, res) => {
  res.json({heads: req.headers})
});

module.exports = router;
