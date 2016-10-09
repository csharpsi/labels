"use strict";

var express = require('express');
var router = express.Router();
var models = require('../models');
var Catalogue = require('../catalogue');

router.get('/signin', (req, res, next) => {
  res.render('auth/signin');
});

module.exports = router;