"use strict";

var express = require('express');
var router = express.Router();
var models = require('../models');
var authorize = require('../authorize');
var utils = require('../util');
var crypto = require('crypto');

router.get('/signup', (req, res) => {
    res.render('account/signup');
});

router.post('/signup', (req, res) => {

    const apiKey = `V1LAB${crypto.randomBytes(16).toString('hex').toUpperCase()}`;

    models.account.create({
        api_key: apiKey,
        plan_id: 'Free',
        name: req.body.accountName
    }).then((account) => {
        return models.user.create({
            email: req.body.email,
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            password: req.body.pwd,
            account_id: account.account_id
        });
    }).then((user) => {
        utils.setAuthCookie(res, user);
        res.redirect(`/users/${user.user_id}/profile`);
    }).catch((err) => {
        console.error(err);
        res.render('account/signup', { err, account: req.body });
    });
});

module.exports = router;
