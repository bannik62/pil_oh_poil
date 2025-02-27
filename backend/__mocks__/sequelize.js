// Mock de base de Sequelize
const DataTypes = {
    STRING: 'STRING',
    INTEGER: 'INTEGER',
    DATE: 'DATE',
    BOOLEAN: 'BOOLEAN'
};

// Création du mock Sequelize
const sequelizeMock = {
    define: jest.fn((modelName, attributes) => ({
        modelName,
        attributes,
        findOne: jest.fn(),
        create: jest.fn(),
        findAll: jest.fn()
    })),
    authenticate: jest.fn(),
    sync: jest.fn(),
    DataTypes
};

// Mock du modèle User
const User = {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn()
};

module.exports = {
    sequelize: sequelizeMock,
    Sequelize: jest.fn(() => sequelizeMock),
    DataTypes,
    getDialect: () => 'sqlite',
    User
};
