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
        return queryInterface.bulkInsert('lab_plan', [
            { plan_id: 'Free', description: 'Free developer plan', price: null, max_api_requests_per_second: 100, max_types: 2, max_namespaces_per_type: 5, max_labels_per_namespace: 10 },
            { plan_id: 'Mini', description: 'Small starter plan', price: 25, max_api_requests_per_second: 500, max_types: 5, max_namespaces_per_type: 10, max_labels_per_namespace: 50 },
            { plan_id: 'Pro', description: 'Pro plan', price: 150, max_api_requests_per_second: 1500, max_types: 50, max_namespaces_per_type: 100, max_labels_per_namespace: 150 },
            { plan_id: 'Enterprise', description: 'Enterprise plan', price: 500, max_api_requests_per_second: null, max_types: null, max_namespaces_per_type: null, max_labels_per_namespace: null },
        ], {});
    },

    down: function (queryInterface, Sequelize) {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.bulkDelete('Person', null, {});
        */
        return queryInterface.bulkDelete('lab_plan', null, {});
    }
};
