'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('lab_user', [
            { email: 'simon@simonchilds.net', password_hash: '$2a$10$HCE1KA0rwkwkNvNUOkop7uIYxwg0Dc3YjGa3z8uLSRDQsE.zJWQNG', first_name: 'Simon', last_name: 'Childs', is_admin: true, created_at: new Date(), updated_at: new Date() }
        ], {});
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('lab_user', null, {});
    }
};
