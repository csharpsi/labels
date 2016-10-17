'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.bulkInsert('Person', [{
            name: 'John Doe',
            isBetaMember: false
          }], {});
        */
        return queryInterface.bulkInsert('lab_user', [
            { email: 'schilds@sonovate.com', password_hash: '$2a$10$HCE1KA0rwkwkNvNUOkop7uIYxwg0Dc3YjGa3z8uLSRDQsE.zJWQNG', first_name: 'Simon', last_name: 'Childs', is_admin: true, created_at: new Date(), updated_at: new Date() }
        ], {});
    },

    down: function (queryInterface, Sequelize) {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.bulkDelete('Person', null, {});
        */
        return queryInterface.bulkDelete('lab_user', null, {});
    }
};
