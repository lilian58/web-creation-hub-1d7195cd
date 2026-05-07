# SpiritLink — Backend Express + MongoDB

API REST + WebSocket (Socket.IO) pour l'application SpiritLink.

> ⚠️ Ce backend ne tourne **pas** dans l'environnement Lovable (qui est purement frontend Vite/React). Il est destiné à être déployé séparément (Render, Railway, Fly.io, VPS, Docker…).

## Stack

- **Express 4** — serveur HTTP & routing REST
- **MongoDB + Mongoose 8** — base de données et ODM
- **Socket.IO** — messagerie temps réel + signalisation WebRTC pour appels audio/vidéo
- **JWT + cookies httpOnly** — authentification
- **bcryptjs** — hash des mots de passe
- **multer** — upload de fichiers (audio, vidéo, PDF, EPUB)
- **helmet, cors, rate-limit, morgan** — sécurité & logs
- **express-validator** — validation des entrées

## Installation

```bash
cd server
cp .env.example .env   # puis renseigner MONGO_URI, JWT_SECRET, CLIENT_ORIGIN
npm install
npm run dev            # nodemon
# ou
npm start
```

API disponible sur `http://localhost:5000/api`.

## Architecture

```
server/
├── server.js                # Point d'entrée (HTTP + Socket.IO)
├── app.js                   # Express app, middlewares globaux, montage routes
├── config/
│   ├── db.js                # Connexion Mongoose
│   └── socket.js            # Init Socket.IO + handlers (chat & WebRTC)
├── middleware/
│   ├── auth.middleware.js   # protect (JWT) + authorize (roles)
│   ├── error.middleware.js  # notFound + errorHandler
│   ├── upload.middleware.js # multer (disque local /uploads)
│   └── validate.middleware.js
├── models/                  # Mongoose schemas
│   ├── User.js              # auth + rôle (user|creator|admin) + plan + contacts
│   ├── Predication.js       # sermons audio/vidéo
│   ├── Book.js              # bibliothèque (PDF/EPUB)
│   ├── Note.js              # journal personnel
│   ├── Conversation.js
│   ├── Message.js
│   ├── Call.js              # historique appels audio/vidéo
│   ├── Download.js          # contenu hors-ligne
│   ├── Subscription.js      # plans free/plus/family
│   ├── Report.js            # signalements de modération
│   └── Verse.js             # versets bibliques
├── controllers/             # logique métier (1 par ressource)
├── routes/                  # routage REST (1 par ressource)
└── utils/
    └── token.js             # signToken + setAuthCookie
```

## Endpoints principaux

| Méthode | Endpoint                              | Rôle requis      | Description                             |
|---------|---------------------------------------|------------------|-----------------------------------------|
| POST    | `/api/auth/register`                  | public           | Inscription                             |
| POST    | `/api/auth/login`                     | public           | Connexion (renvoie JWT + cookie)        |
| POST    | `/api/auth/logout`                    | public           | Déconnexion                             |
| GET     | `/api/auth/me`                        | auth             | Profil courant                          |
| GET     | `/api/users` `/api/users/:id`         | auth             | Annuaire / profil public                |
| PATCH   | `/api/users/me`                       | auth             | Mise à jour de son profil               |
| GET     | `/api/predications`                   | public           | Liste sermons (filtres q/type/category) |
| POST    | `/api/predications`                   | creator/admin    | Upload sermon (multipart `media`)       |
| POST    | `/api/predications/:id/like`          | auth             | Like / unlike                           |
| GET/POST| `/api/books`                          | public / creator | Bibliothèque PDF/EPUB                   |
| CRUD    | `/api/notes`                          | auth             | Journal personnel                       |
| GET/POST| `/api/conversations`                  | auth             | Conversations privées / groupes         |
| GET     | `/api/conversations/:id/messages`     | auth             | Historique paginé (`?before=...`)       |
| POST    | `/api/messages`                       | auth             | Envoi message (texte ou média)          |
| POST    | `/api/calls`                          | auth             | Démarre un appel audio/vidéo            |
| GET/POST| `/api/downloads`                      | auth             | Gestion contenu hors-ligne              |
| GET/POST| `/api/subscription`                   | auth             | Plan Free / Plus / Famille              |
| GET     | `/api/admin/stats`                    | admin            | KPIs dashboard                          |
| GET/PATCH| `/api/admin/reports`                 | admin            | Modération des signalements             |
| PATCH   | `/api/admin/users/:id/block`          | admin            | Bloquer un compte                       |
| GET     | `/api/bible/:book/:chapter`           | public           | Lecture chapitre                        |
| GET     | `/api/bible/search?q=`                | public           | Recherche plein texte                   |
| GET     | `/api/bible/daily`                    | public           | Verset du jour                          |

## Socket.IO — événements

Connexion : `io(URL, { auth: { token: JWT } })`

| Event client → serveur     | Payload                                              | Effet                            |
|----------------------------|------------------------------------------------------|----------------------------------|
| `conversation:join`        | `conversationId`                                     | Rejoindre la room                |
| `conversation:leave`       | `conversationId`                                     | Quitter la room                  |
| `message:send`             | `{ conversationId, body, type }`                     | Envoie + persiste + diffuse      |
| `typing`                   | `{ conversationId, isTyping }`                       | Indicateur de frappe             |
| `call:offer`               | `{ to, offer, callType, callId }`                    | Signalisation WebRTC SDP offer   |
| `call:answer`              | `{ to, answer, callId }`                             | SDP answer                       |
| `call:ice`                 | `{ to, candidate, callId }`                          | ICE candidate                    |
| `call:hangup`              | `{ to, callId }`                                     | Fin d'appel                      |

| Event serveur → client     | Payload                                              |
|----------------------------|------------------------------------------------------|
| `message:new`              | `Message`                                            |
| `typing`                   | `{ userId, isTyping }`                               |
| `call:incoming`            | `{ from, offer, callType, callId }`                  |
| `call:answered`            | `{ from, answer, callId }`                           |
| `call:ice`                 | `{ from, candidate, callId }`                        |
| `call:hangup`              | `{ from, callId }`                                   |

## Sécurité

- Mots de passe hashés avec bcrypt (10 rounds), `select: false` côté schema.
- JWT signé HS256, transporté via header `Authorization: Bearer …` **ou** cookie httpOnly.
- Middleware `protect` charge `req.user` depuis Mongo; `authorize('admin', …)` filtre les rôles.
- Helmet + CORS restreint à `CLIENT_ORIGIN` + rate-limit 600 req / 15 min.
- Validation des entrées via `express-validator` sur les routes sensibles.

## Branchement côté frontend (React)

Exemple côté client (à ajouter ensuite) :

```ts
// src/lib/api.ts
const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export async function api(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem("spiritlink:token");
  const res = await fetch(`${API}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) throw new Error((await res.json()).message ?? res.statusText);
  return res.json();
}
```

```ts
// src/lib/socket.ts
import { io } from "socket.io-client";
export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  auth: { token: localStorage.getItem("spiritlink:token") },
  autoConnect: false,
});
```
