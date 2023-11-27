# 📚 Academia

Bienvenue à Academia - une application développée pour aider les utilisateurs à gérer, suivre et organiser leurs
devoirs.

## 🛠 Technologies utilisées

- **Frontend** : Angular
- **Backend** : Node.js

## 🚀 Mise en route

### Pré-requis

- ✅ Avoir [Node.js](https://nodejs.org/) et [npm](https://www.npmjs.com/) installés.

### 🔧 Installation

1. 📥 Clonez le dépôt :

   ```bash
   git clone <lien_du_dépôt>
   cd <nom_du_dossier_du_dépôt>
   ```

2. 🔙 Naviguez vers le dossier backend et installez les dépendances pour le backend :

   ```bash
   cd backend
   npm install
   ```

3. 🔝 Naviguez vers le dossier frontend et installez les dépendances pour Angular :

   ```bash
   cd frontend
   npm install
   ```

### 🖥️ Exécution

#### Option 1 : Exécuter localement

1. Naviguez vers le dossier backend et démarrez le backend :

   ```bash
   cd backend
   node index.js
   ```

2. Dans un autre terminal, naviguez vers le dossier frontend et démarrez l'application Angular :

   ```bash
   cd frontend
   ng serve
   ```

3. 🌍 Ouvrez votre navigateur et allez à `http://localhost:4200`.

#### Option 2 : Exécuter avec Docker

1. À la racine du projet, exécutez la commande suivante pour construire les images Docker et démarrer les conteneurs :

   ```bash
   docker compose up --build
   ```

   Cette commande va construire les images Docker pour le backend, le frontend et la base de données MongoDB, puis
   démarrer les conteneurs.

2. 🌍 Ouvrez votre navigateur et allez à `http://localhost`.

## ⭐ Fonctionnalités

- ✨ **Ajouter un devoir** : Permet à l'utilisateur d'ajouter de nouveaux devoirs.
- 📋 **Liste des devoirs** : Affiche tous les devoirs enregistrés.
- 🔍 **Voir/Supprimer** : Permet de voir ou de supprimer des devoirs.
- ...

### Informations de Connexion

Pour tester les différentes fonctionnalités en fonction du rôle, vous pouvez utiliser les identifiants suivants :

- **Professeur** :
    - Email : `prof.admin@mail.com`
    - Mot de passe : `admin`

- **Élève** :
    - Email : `student.admin@mail.com`
    - Mot de passe : `admin`
