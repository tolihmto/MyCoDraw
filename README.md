# CoDraw - Jeu Multijoueur de Dessin en Ligne

## Présentation

CoDraw est une plateforme web qui permet à plusieurs utilisateurs de dessiner ensemble en temps réel sur un canevas partagé. Le projet est conçu pour offrir une expérience collaborative enrichissante, avec des fonctionnalités telles que la création de serveurs communautaires, la gestion de profils utilisateurs et une galerie personnelle pour sauvegarder les œuvres.

## Fonctionnalités

- **Système de serveurs de jeux** : Créez et rejoignez des serveurs de dessin, avec une liste dynamique des serveurs disponibles.
- **Session de dessin collaborative** : Dessinez ensemble en temps réel, avec des outils variés et la possibilité d'immortaliser vos créations.
- **Canevas de dessin** : Profitez d'une interface intuitive avec des outils de dessin, une palette de couleurs et des options de personnalisation.
- **Profils utilisateurs** : Créez un compte, gérez votre profil et accédez à votre galerie personnelle.
- **Musée des dessins** : Consultez les œuvres immortalisées par les utilisateurs dans un espace dédié.

## Installation

### Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn
- Une base de données SQL (MySQL, PostgreSQL, etc.)

### Étapes d'installation

1. **Clonez le dépôt** :
   ```bash
   git clone <URL_DU_DEPOT>
   cd codraw-app
   ```

2. **Installez les dépendances pour le frontend** :
   ```bash
   cd frontend
   npm install
   ```

3. **Installez les dépendances pour le backend** :
   ```bash
   cd ../backend
   npm install
   ```

4. **Configurez la base de données** :
   - Modifiez le fichier `database/schema.sql` pour adapter le schéma à votre base de données.
   - Exécutez le script SQL pour créer les tables nécessaires.

5. **Démarrez le serveur backend** :
   ```bash
   cd backend
   npm start
   ```

6. **Démarrez le frontend** :
   ```bash
   cd ../frontend
   npm start
   ```

## Utilisation

- Accédez à l'application via votre navigateur à l'adresse `http://localhost:3000`.
- Créez un compte ou connectez-vous pour accéder à toutes les fonctionnalités.
- Rejoignez un serveur de dessin ou créez-en un nouveau pour commencer à dessiner.

## Contributions

Les contributions sont les bienvenues ! Pour contribuer, veuillez suivre ces étapes :

1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`).
3. Commitez vos modifications (`git commit -m 'Ajout d\'une nouvelle fonctionnalité'`).
4. Poussez votre branche (`git push origin feature/ma-fonctionnalite`).
5. Ouvrez une Pull Request.

## Auteurs

- [Votre Nom](https://github.com/votreprofil)

## License

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.