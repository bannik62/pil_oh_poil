'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('./index.cjs');

const

    User = sequelize.define('Users', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user'
        },
        isvalid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

    });

User.associate = (models) => {
    User.hasOne(models.UserProfile, {
        foreignKey: 'userId',
        as: 'userProfile'
    });
    User.hasMany(models.Appointment, {
        foreignKey: 'userId',
        as: 'appointments'
    });
    User.hasMany(models.Message, {
        foreignKey: 'userId',
        as: 'messages'
    });
};

module.exports = { User };  // Export correct du modèle

