"use strict";

var express = require('express');
var router = express.Router();
var models = require('../models');
var Catalogue = require('../catalogue');

/**
 * Display the sign in form
 */
router.get('/signin', (req, res, next) => {
    res.render('auth/signin');
});

/**
 * Handle sign in form submission
 */
router.post('/signin', (req, res) => {    
    models.user.findOne({where: {email: req.body.email}}).then((user) => {
        if(!user || !user.authenticate(req.body.password)){
            return res.render('auth/signin', {err: Catalogue.getString('validation_auth_incorrectUserOrPassword')});
        }

        let tokenObj = {uid: user.id, uem: user.email};
        let rawToken = JSON.stringify(tokenObj);
        let token = new Buffer(rawToken).toString('base64');
        let expiry = new Date();
        expiry.setDate(expiry.getDate() + 5);

        res.cookie('_uauth', token, {signed: true, httpOnly: true, maxAge: expiry});
        res.redirect('/');
    });
});

module.exports = router;