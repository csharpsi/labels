"use strict";

var express = require('express');
var router = express.Router();
var models = require('../../models');

router.use((req, res, next) => {
  let apiKey = req.headers["api-key"];
  next();

});

/**
 * /api/labels routes
 */
router.use('/labels', require('./labels'));


router.get('/', function(req, res, next) {
  res.render('apidocs');
});

router.get('/status', (req, res) => {
  res.json({heads: req.headers})
});

module.exports = router;
