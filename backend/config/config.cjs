require('dotenv').config(); // Charger les variables d'environnement à partir du fichier .env

module.exports = {
    development: {
        host: process.env.DB_HOST,
        username: process.env.DB_USER,    // Utiliser les variables définies dans le fichier .env
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        dialect: 'mysql'
    }
};
