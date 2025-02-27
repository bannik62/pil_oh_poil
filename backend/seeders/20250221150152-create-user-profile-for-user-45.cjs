'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert('UserProfiles', [
            {
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St, New York, NY',
                dateOfBirth: new Date('1990-01-01'),
                userId: 45,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('UserProfiles', {
            userId: 45
        });
    }
};

