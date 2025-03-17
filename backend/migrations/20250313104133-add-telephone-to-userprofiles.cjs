'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('UserProfiles', 'telephone', {
            type: Sequelize.STRING,
            allowNull: true, // Permet les valeurs nulles (modifiable selon ton besoin)
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('UserProfiles', 'telephone');
    }
};
