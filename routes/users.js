"use strict";

var express = require('express');
var router = express.Router();
var models = require('../models');
var Catalogue = require('../catalogue');

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.render('users/index');
});

router.get('/:userId/profile', (req, res) => {

    models.user.findOne({ where: { user_id: req.params.userId } })
        .then((instance) => {
            if (!instance) {
                res.redirect('/404');
            }
            res.render('users/profile', { profile: instance.get({ plain: true }) });
        })
        .catch((err) => {
            let e = new Error(err);
            e.status = 404;
            throw e;
        });
});

router.get('/new', (req, res) => {
    res.render('users/new');
});

router.post('/new', (req, res) => {
    let newUser = {
        email: req.body.email,
        password: req.body.pwd,
        first_name: req.body.firstName,
        last_name: req.body.lastName
    };
    models.user.create(newUser)
        .then((user) => {
            res.redirect(`/users/${user.user_id}/profile`);
        })
        .catch((err) => {
            res.render('users/new', { err, profile: newUser });
        });
});

module.exports = router;
