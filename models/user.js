'use strict';
let Catalogue = require('../catalogue');
let bcrypt = require('bcrypt-nodejs');
let model = require('./base');
let Sequelize = require('sequelize');

let setPasswordHash = (user, options, cb) => {
    bcrypt.hash(user.get('password'), user.get('salt'), null, (err, hash) => {
        if (err) return cb(err);
        user.set('passwordHash', hash);
        return cb(null, options);
    });
};

let buildUser = (user, options, cb) => {
    user.email = user.email.toLowerCase();

    if (!user.salt) {
        user.salt = bcrypt.genSaltSync();
    }

    if (user.password) {
        setPasswordHash(user, options, cb);
    }
    else {
        return cb(null, options);
    }
};

let definition = {
    userId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    firstName: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    lastName: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    password: {
        type: Sequelize.VIRTUAL,
        allowNull: false,
        validate: {
            notEmpty: true,
            longEnough: (val) => {
                if (val.length < 7) {
                    throw new Error(Catalogue.getString('validation_user_passwordTooShort'));
                }
            }
        }
    },
    salt: {
        type: Sequelize.VIRTUAL
    },
    passwordHash: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: true
        }
    }
};

let config = {
    instanceMethods: {
        authenticate: function (value) {
            if (bcrypt.compareSync(value, this.passwordHash)) {
                return this;
            }
            else {
                return false;
            }
        }
    },
    classMethods: {
        associate: function (models) {
            this.belongsTo(models.account, { as: 'Account', foreignKey: 'account_id' });
        }
    },
    extend: function () {
        this.beforeCreate(buildUser);
        this.beforeUpdate(buildUser);
    }
};

module.exports = model('user', definition, config);
