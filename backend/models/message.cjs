'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('./index.cjs');

const Message = sequelize.define('Message', {
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    response: {
        type: DataTypes.STRING,
        allowNull: true
    },
    checked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    }
});

Message.associate = (models) => {
    Message.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
    });
};

module.exports = { Message };