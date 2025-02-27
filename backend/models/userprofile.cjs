'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('./index.cjs');

const UserProfile = sequelize.define('UserProfile', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

UserProfile.associate = (models) => {
    UserProfile.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
    });
};

module.exports = { UserProfile };