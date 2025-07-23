# 🎨 CoDraw – Jeu Multijoueur de Dessin en Ligne ✏️🖌️

[![GitHub Repo](https://img.shields.io/badge/GitHub-CoDraw-blue?logo=github)](https://github.com/tolihmto/MyCoDraw.git)

## 🚀 Présentation

CoDraw est une plateforme web qui permet à plusieurs utilisateurs de dessiner ensemble en **temps réel** sur un canevas partagé. Vivez une expérience collaborative fun et créative ! 👥✨

## 🌟 Fonctionnalités

- 🖼️ **Canevas partagé** : Dessinez à plusieurs instantanément
- 🧑‍🤝‍🧑 **Serveurs de jeu** : Créez ou rejoignez des salons de dessin
- 🖌️ **Outils variés** : Brosses, couleurs, pot de peinture, gomme…
- 🏆 **Immortalisez vos œuvres** : Figez vos créations dans le musée virtuel
- 👤 **Profils & galeries** : Sauvegardez et exposez vos dessins
- 🖼️ **Musée communautaire** : Admirez les œuvres des autres joueurs

## ⚙️ Stack Technique

- Frontend : React + TypeScript + Socket.io-client
- Backend : Node.js + Express + TypeScript + Socket.io
- Base de données : MongoDB (Mongoose)

## 🛠️ Installation

### Prérequis
- Node.js (v14+)
- npm ou yarn
- **MongoDB** (local ou cloud)

### Étapes

1. **Clonez le dépôt**
   ```bash
   git clone https://github.com/tolihmto/MyCoDraw.git
   cd codraw-app
   ```

2. **Installez les dépendances frontend**
   ```bash
   cd frontend
   npm install
   ```

3. **Installez les dépendances backend**
   ```bash
   cd ../backend
   npm install
   ```

4. **Configurez vos variables d'environnement**
   - Créez un fichier `.env` dans `/backend` avec `MONGO_URI` et autres infos nécessaires.

5. **Démarrez le backend**
   ```bash
   cd backend
   npm start
   ```

6. **Démarrez le frontend**
   ```bash
   cd ../frontend
   npm start
   ```

## 💡 Utilisation

- Rendez-vous sur [http://localhost:3000](http://localhost:3000)
- Créez un serveur, invitez vos amis et commencez à dessiner !

## 📦 Dépôt GitHub

👉 [https://github.com/tolihmto/MyCoDraw.git](https://github.com/tolihmto/MyCoDraw.git)

---

✨ Amusez-vous bien sur CoDraw ! ✨

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