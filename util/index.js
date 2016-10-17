"use strict";

class Utilities {

    setAuthCookie(res, user) {
        let tokenObj = { uid: user.userId, uem: user.email };
        let rawToken = JSON.stringify(tokenObj);
        let token = new Buffer(rawToken).toString('base64');
        let expiry = new Date();
        expiry.setDate(expiry.getDate() + 5);

        res.cookie('_uauth', token, { signed: true, httpOnly: true, maxAge: expiry });
    }

}

module.exports = new Utilities();