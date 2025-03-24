'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('./index.cjs');

const Appointment = sequelize.define('Appointments', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, // Incrémente automatiquement l'ID
        primaryKey: true, // Définit ce champ comme clé primaire
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        primaryKey: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    day: {
        type: DataTypes.DATEONLY, // Format YYYY-MM-DD
        allowNull: false,
    },
    timeSlot: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {});

Appointment.associate = function(models) {
    // Relation : Un rendez-vous appartient à un utilisateur
    Appointment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
    });
};

module.exports = { Appointment };
