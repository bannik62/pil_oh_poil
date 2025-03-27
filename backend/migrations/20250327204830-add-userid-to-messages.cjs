'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
    // Ajouter la colonne userId à la table Messages si elle n'existe pas
        await queryInterface.addColumn('Messages', 'userId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',  // Table référencée
                key: 'id'        // Clé de la table référencée
            },
            onDelete: 'CASCADE', // Si l'utilisateur est supprimé, supprimer ses messages
        });
    },

    down: async (queryInterface, Sequelize) => {
    // Si tu veux annuler cette migration, supprime la colonne userId
        await queryInterface.removeColumn('Messages', 'userId');
    }
};
