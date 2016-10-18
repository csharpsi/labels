"use strict";

var express = require('express');
var router = express.Router();
var models = require('../models');
var Catalogue = require('../catalogue');
var utils = require('../util');

/**
 * Display the sign in form
 */
router.get('/signin', (req, res) => {
    res.render('auth/signin');
});

/**
 * Handle sign in form submission
 */
router.post('/signin', (req, res) => {
    models.user.findOne({ where: { email: req.body.email } }).then((user) => {
        if (!user || !user.authenticate(req.body.password)) {
            return res.render('auth/signin', { err: Catalogue.getString('validation_auth_incorrectUserOrPassword') });
        }

        utils.setAuthCookie(res, user);
        res.redirect('/');
    });
});

/**
 * Sign out and redirect to root
 */
router.get('/signout', (req, res) => {
    utils.destroyAuthCookie(res);
    res.redirect('/');
});

module.exports = router;