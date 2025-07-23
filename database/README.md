# 🗄️ CoDraw – Database Documentation

## Introduction

Cette documentation décrit la structure et la configuration de la base de données utilisée par l’application CoDraw.

## ⚙️ Système de base de données

- **Type** : MongoDB (NoSQL)
- **Chaîne de connexion** :
  ```
  mongodb://localhost:27017/codraw
  ```
- **Gestion via Mongoose** (ODM pour Node.js)

## 📦 Collections principales

- **users** : Stocke les informations des utilisateurs (username, email, mot de passe hashé, avatar...)
- **servers** : Contient les serveurs de jeu (nom, créateur, joueurs, etc.)
- **drawings** : Sauvegarde les dessins (données image, auteur, timestamp...)

## 📝 Setup Instructions

1. Assurez-vous que MongoDB est installé et en cours d’exécution sur votre machine ou accessible à distance.
2. Vérifiez que la variable d’environnement `MONGO_URI` dans le backend pointe bien vers :
   ```
   mongodb://localhost:27017/codraw
   ```
3. Les schémas sont définis dans le code via Mongoose (`/backend/src/models/`).

Aucune migration SQL ou script manuel n’est nécessaire : les collections sont créées automatiquement à la première utilisation.

---

## 🧩 Exemples de schémas Mongoose (TypeScript)

Les schémas des collections sont définis dans `/backend/src/models/`.

### User
```typescript
import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: String,
  createdAt: { type: Date, default: Date.now }
});

export default model("User", UserSchema);
```

### Server
```typescript
import { Schema, model, Types } from "mongoose";

const ServerSchema = new Schema({
  name: { type: String, required: true },
  creator: { type: Types.ObjectId, ref: "User", required: true },
  playerCount: { type: Number, default: 0 },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now }
});

export default model("Server", ServerSchema);
```

### Drawing
```typescript
import { Schema, model, Types } from "mongoose";

const DrawingSchema = new Schema({
  canvasData: { type: String, required: true }, // base64 ou SVG
  user: { type: Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model("Drawing", DrawingSchema);
```

1. **Database Creation**: 
   - Use the SQL commands in `schema.sql` to create the necessary tables in your database management system (e.g., MySQL, PostgreSQL).

2. **Configuration**:
   - Ensure that your backend application is configured to connect to the database. This typically involves setting environment variables for the database URL, username, and password.

3. **Running Migrations**:
   - If you are using a migration tool, ensure to run the migrations to keep your database schema up to date.

## Usage

The database is accessed through the backend API, which provides endpoints for user registration, server management, and drawing storage. Ensure that the backend is running to interact with the database effectively.

## Conclusion

This README serves as a guide for setting up and using the database for the CoDraw application. For further details on the API endpoints and usage, refer to the backend documentation.