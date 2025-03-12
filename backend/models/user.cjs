'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('./index.cjs');

const User = sequelize.define('Users', {
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
        foreignKey: 'id',
        as: 'userProfile'
    });
};

module.exports = { User };  // Export correct du modèle

