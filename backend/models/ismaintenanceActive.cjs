'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('./index.cjs');

const isMaintenanceActive = sequelize.define('isMaintenanceActives', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    isActive: DataTypes.BOOLEAN
});

isMaintenanceActive.associate = (models) => {
    // define association here
};

module.exports = {isMaintenanceActive};

