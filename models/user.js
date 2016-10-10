'use strict';
let Catalogue = require('../catalogue');
let bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        firstName: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        lastName: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        password: {
            type: DataTypes.VIRTUAL,
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
            type: DataTypes.TEXT
        },
        passwordHash: {
            type: DataTypes.TEXT,
            validate: {
                notEmpty: true
            }
        }
    }, {
            tableName: 'loc_users',
            instanceMethods: {
                authenticate: function(value) {
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
                    this.hasMany(models.Account);
                }
            }
        });

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

    User.beforeCreate(buildUser);
    User.beforeUpdate(buildUser);

    return User;
};