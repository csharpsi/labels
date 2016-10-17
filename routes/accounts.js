"use strict";

var express = require('express');
var router = express.Router();
var models = require('../models');
var authorize = require('../authorize');
var utils = require('../util');
var crypto = require('crypto');

/* GET users listing. */
router.get('/', authorize, (req, res) => {
    res.send('respond with a resource');
});

router.get('/signup', (req, res) => {
    res.render('accounts/signup');
});

router.post('/signup', (req, res) => {

    const apiKey = `V1LAB${crypto.randomBytes(16).toString('hex').toUpperCase()}`;

    let user = models.user.build({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.pwd
    });

    let account = models.account.build({
        apiKey,
        planId: 'Free',
        name: req.body.accountName,
        Users: [user]
    });

    models.plan.findOne({ where: { planId: "Free" } })
        .then((plan) => {
            //account.setPlan(plan);
            return account.save({ include: [{ model: models.user, as: "Users" }] }).then((a) => {
                return a.setPlan(plan);
            });
        })
        .then((acc) => {
            console.log(acc);
        })
        .catch((err) => {
            console.log(err);
        });

    // models.account.create(account)
    //     .then((createdAccount) => {
    //         return createdAccount.addUser(user);
    //     })
    //     .then((u) => {
    //         utils.setAuthCookie(res, u);
    //         res.redirect(`/users/profile/${u.userId}`);
    //     })
    //     .catch((err) => {
    //         res.render('accounts/signup', { err, account: user });
    //     });
});

module.exports = router;
