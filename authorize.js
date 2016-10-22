"use strict";

let models = require('./models');
let Catalogue = require('./catalogue');
const select = ['email', 'first_name', 'last_name', 'is_admin', 'account_id'];

let authorizer = function (req, res, next) {
    let token = req.signedCookies["_uauth"];
    if (!token) {
        res.redirect('/auth/signin');
        return;
    }

    let obj = {};

    try {
        obj = JSON.parse(new Buffer(token, 'base64').toString());
    }
    catch (error) {
        res.clearCookie('_uauth');
        return res.redirect('/auth/signin');
    }

    models.user.findById(obj.uid, { attributes: select }).then((user) => {
        if (!user || user.email !== obj.uem) {
            res.clearCookie('_uauth');
            return res.redirect('/auth/signin');
        }

        req.user = user;
        res.locals = { user };
        next();
    }).catch((error) => {
        return res.render('error', { error });
    });
};

module.exports = authorizer;
module.exports.admin = function (req, res, next) {
    authorizer(req, res, () => {
        if (req.user.is_admin !== true) {
            delete req.user;
            delete res.locals.user;
            res.redirect('/404');
        }
        else {
            next();
        }
    });
}