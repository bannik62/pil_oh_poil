# Utiliser une image Node.js légère pour le développement
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de configuration pour installer les dépendances
COPY package*.json ./app


# Installer les dépendances nécessaires pour Svelte et Vite
RUN npm install @sveltejs/vite-plugin-svelte@3.0.1 jwt-decode

# Copier le reste des fichiers du projet Svelte
COPY . .

# Exposer le port pour le serveur de développement Vite
EXPOSE 5173

# Démarrer Vite en mode développement
CMD ["npm", "run", "dev"] 