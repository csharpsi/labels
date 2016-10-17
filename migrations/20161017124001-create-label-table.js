'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('lab_label', {
            label_id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            label_type: Sequelize.TEXT,
            namespace: Sequelize.TEXT,
            label_key: Sequelize.TEXT,
            language: Sequelize.TEXT,
            text: Sequelize.TEXT,
            account_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'lab_account',
                    key: 'account_id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE
        }).then(function () {
            return queryInterface.addIndex('lab_label', ['label_key', 'language', 'account_id'], {
                indexName: 'unique_label_key_language_account',
                indiciesType: 'UNIQUE'
            });
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('lab_label');
    }
};
