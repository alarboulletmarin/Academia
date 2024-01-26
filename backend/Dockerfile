# Utilisation d'une image Node.js officielle
FROM node:20.9.0

# Création d'un répertoire pour l'application
WORKDIR /usr/src

# Copie des sources de l'application
COPY . .

# Installation des dépendances
RUN npm install

# Exposition du port sur lequel l'application s'exécute
EXPOSE 10000

# Définition de la variable d'environnement NODE_ENV
ENV NODE_ENV=production

# Commande pour démarrer l'application
CMD ["node", "index.js"]