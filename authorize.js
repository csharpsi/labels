"use strict";

let models = require('./models');

let authorizer = function (req, res, next) {
    let token = req.signedCookies["_uauth"];
    if (!token) {
        res.redirect('/auth/signin');
        return;
    }

    let obj = JSON.parse(new Buffer(token, 'base64').toString());
    models.user.findById(obj.uid).then((user) => {
        if (!user || user.email !== obj.uem) {
            res.clearCookie('_uauth');
            return res.redirect('/auth/signin');
        }

        req.user = user;
        res.locals = { user };
        next();
    });
};

module.exports = authorizer;
module.exports.admin = function (req, res, next) {
    authorizer(req, res, () => {
        if (req.user.is_admin !== true) {
            res.redirect('/404');
        }
        else {
            next();
        }
    });
}