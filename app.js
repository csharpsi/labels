"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var bodyParser = require('body-parser');
var Catalogue = require('./catalogue');
var hbsRegister = require('./config/handlebarsHelpers');
var hbs = require('hbs');
var models = require('./models');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbsRegister.registerHelpers();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('i am the lizard queen'));
app.use(csrf({ cookie:true }));
app.use(express.static(path.join(__dirname, 'public')));

app.disable('x-powered-by');

app.use((req, res, next) => {
    let lang = req.cookies.lang || "en-GB";
    Catalogue.initialise(lang);
    next();
});

let authorize = require('./authorize');

/**
 * Application routes
 */
app.use('/', require('./routes/index'));
app.use('/users', authorize, require('./routes/users'));
app.use('/labels', authorize, require('./routes/labels'));
app.use('/account', require('./routes/account'));
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api/index'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
