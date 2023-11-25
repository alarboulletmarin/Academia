# Utilisation de l'image officielle Node.js pour construire l'application
FROM node:20.9.0 as build

# Définition du répertoire de travail
WORKDIR /usr/src/app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install -g @angular/cli@17.0.3 && npm install

# Copie du reste du code source
COPY . .

# Construction de l'application en mode production
RUN ng build --configuration production

# Utilisation de l'image Nginx pour servir l'application
FROM nginx:latest

# Copie du résultat de la construction à partir de l'étape précédente
COPY --from=build /usr/src/app/dist/frontend /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

# Exposition du port 80 pour le serveur web
EXPOSE 80
