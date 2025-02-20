const { Sequelize } = require('sequelize');
const config = require('../config/config.json'); // Chemin vers le nouveau fichier de configuration

const env = process.env.NODE_ENV || 'development'; // Utiliser l'environnement
const dbConfig = config[env];

// Créer une instance Sequelize avec les paramètres de config.js
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password,{
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    JWT_SECRET: dbConfig.JWT_SECRET
});
sequelize.sync({ force: false }) // false pour ne pas écraser les données
    .then(() => console.log('Database synchronized!'))
    .catch(err => console.error('Database synchronization failed:', err));

sequelize.authenticate()
    .then(() => console.log('Database connected!'))
    .catch(err => console.error('Database connection error:', err));

// Tester la connexion
const connectWithRetry = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');
    } catch (err) {
        console.error('Database connection error:', err);
        console.log('Retrying in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();

module.exports = sequelize;
