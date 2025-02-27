'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('UserProfiles', [
            {
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St, New York, NY',
                dateOfBirth: new Date('1990-01-01'),
                userId: 45, // Associer ce UserProfile à l'utilisateur avec l'ID 45
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('UserProfiles', {
            userId: 45, // Supprimer le UserProfile associé à l'utilisateur avec l'ID 45
        });
    },
};