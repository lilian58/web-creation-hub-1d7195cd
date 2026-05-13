## Objectif

Permettre à l'admin de choisir, lors de l'ajout d'une version de la Bible, entre :
1. **Import manuel** (fichier `.json` / `.txt`) — déjà en place
2. **Import via API en ligne gratuite** — nouveau

## Choix de l'API

Utiliser **bible-api.com** (gratuit, pas de clé requise, supporte plusieurs traductions dont français `lsg1910`, anglais `web`, `kjv`, etc.) en source primaire, avec **getbible.net v2** comme fallback (couvre plus de traductions, JSON public, sans clé).

Aucun secret nécessaire → l'admin sélectionne juste la traduction depuis une liste.

## Flux utilisateur (AdminDashboard → section Bible)

```text
[ Ajouter une version ]
   ├─ ◉ Importer un fichier (.json / .txt)
   │     └─ champs: code, nom, langue, fichier
   └─ ◯ Importer depuis une API gratuite
         ├─ Sélecteur de source: bible-api.com | getbible.net
         ├─ Sélecteur de traduction (chargé dynamiquement)
         ├─ Code/Nom pré-remplis, modifiables
         └─ [Importer] → progression livre par livre
```

## Modifications

### Frontend

**`src/lib/bible-api.ts`** (nouveau)
- `listBibleApiTranslations()` → liste statique des traductions bible-api.com
- `listGetBibleTranslations()` → fetch `https://api.getbible.net/v2/translations.json`
- `fetchBibleFromApi({ source, translation, onProgress })` → itère sur tous les livres/chapitres, agrège en `BibleVerse[]`, retourne `{ code, name, language, verses }`
- Gère les erreurs réseau et CORS (les deux APIs autorisent CORS)

**`src/lib/bible-store.ts`**
- Ajouter `addBibleVersionFromApi(input, onProgress)` qui :
  - Mode mock : appelle `fetchBibleFromApi`, stocke comme une version normale
  - Mode backend : POST `/api/bible/versions/import` avec `{ source, translation, code, name, language }`

**`src/components/admin/ImportBibleSheet.tsx`** (nouveau, extrait depuis AdminDashboard)
- Formulaire avec `RadioGroup` : « Fichier » vs « API en ligne »
- Onglet Fichier : champs actuels
- Onglet API : sélecteurs source + traduction, barre de progression (`Progress`)

**`src/pages/app/AdminDashboard.tsx`**
- Remplacer le formulaire inline par `<ImportBibleSheet />`

### Backend (préparation, pas de DB connectée)

**`server/controllers/bible.controller.js`**
- Nouvelle action `importVersionFromApi` :
  - `POST /api/bible/versions/import` (admin)
  - Body : `{ source: 'bible-api'|'getbible', translation, code, name, language }`
  - Récupère les versets côté serveur (évite CORS), upsert `BibleVersion`, `Verse.deleteMany` + `insertMany`
- Aucune dépendance externe ajoutée (utilise `fetch` natif de Node 18+)

**`server/routes/bible.routes.js`**
- Ajouter `router.post("/versions/import", protect, authorize("admin"), importVersionFromApi)`

## Détails techniques

- **bible-api.com** : `GET https://bible-api.com/?translation=lsg1910` non supporté pour récupérer toute la Bible d'un coup → on itère par livre/chapitre via la liste canonique des 66 livres (constante locale). Endpoint : `https://bible-api.com/{book}+{chapter}?translation=lsg1910`.
- **getbible.net v2** : `GET https://api.getbible.net/v2/{translation}/{bookNumber}/{chapter}.json` — plus structuré, fournit la liste des livres via `/v2/{translation}/books.json`.
- Progression rapportée en pourcentage (livre courant / total).
- Aucun secret à ajouter.

## Hors-scope

- Mise à jour incrémentale d'une traduction existante (toujours remplacement complet).
- Téléchargement offline pour usage hors ligne (le contenu reste stocké côté localStorage/Mongo après import).
