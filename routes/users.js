"use strict";

var express = require('express');
var router = express.Router();
var models = require('../models');
var Catalogue = require('../catalogue');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('users/index');
});

router.get('/detail/:userId', (req, res) => {
  models.User.findById(req.params.userId)
  .then((instance) => {
    if(!instance){
      res.redirect('/404');
    }
    res.render('users/detail', {  user: instance.get({plain: true}) });
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
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };
  models.User.create(newUser)
    .then((user) => {
      res.redirect(`/users/detail/${user.id}`);
    })
    .catch((err) => {
      res.render('users/new', { err, user: newUser });
    });
});

module.exports = router;
