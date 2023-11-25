# Utilisation d'une image Node.js officielle
FROM node:20.9.0

# Création d'un répertoire pour l'application
WORKDIR /usr/src

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source
COPY . .

# Exposition du port sur lequel l'application s'exécute
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["node", "index.js"]
