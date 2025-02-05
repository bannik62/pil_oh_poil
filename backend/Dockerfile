# Utiliser une image Node.js légère
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de configuration pour installer les dépendances
COPY package*.json ./app

# Installer express, sequelize et sequelize-cli explicitement
RUN npm install express sequelize mysql2 dotenv sequelize-cli jsonwebtoken bcrypt bcryptjs joi cors cookie-parser 

# Copier le reste des fichiers de l'application
COPY . ./

# Générer la configuration Sequelize CLI
# RUN node config/generateConfCli/generateConfCli.cjs

# Exposer le port pour l'API Express
EXPOSE 3000

# Démarrer le serveur Express
CMD ["node", "src/servYou.cjs"]
