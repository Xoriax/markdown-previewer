# Markdown Previewer

Application de prévisualisation Markdown avec dashboard et stockage MongoDB.

## Caractéristiques
- Dashboard épuré affichant les fichiers en cartes.
- Tuile “+” pour créer un fichier. La carte de prévisualisation apparaît immédiatement.
- Clic sur une carte pour ouvrir l’éditeur plein écran.
- Éditeur Markdown avec aperçu en temps réel (Marked + DOMPurify).
- API REST (Express + Mongoose) et MongoDB Atlas.

## Démarrage

### Prérequis
- Node.js 18+
- MongoDB Atlas (URI dans `server/.env`)

### Installation
```bash
cd server
cp .env.example .env   # Renseigner MONGODB_URI
npm install
npm run dev
```

## Utilisation

- Ouvre `http://localhost:5174/` → redirection automatique vers le dashboard.
- Clique sur la tuile “+” pour créer un fichier.
- Clique sur une carte pour ouvrir l’éditeur : `/editor.html?id=<ID>`.

## API

- `GET /api/files` : lister les fichiers
- `GET /api/files/:id`: récupérer un fichier
- `POST /api/files`: créer `{ title, content }`
- `PUT /api/files/:id`: mettre à jour `{ title?, content? }`
- `DELETE /api/files/:id`: supprimer

## Structure

```
markdown-previewer/
  dashboard.html
  editor.html
  index.html                 # (previewer standalone, optionnel)
  src/
    style.css
    dashboard.css
    dashboard.js
    editor.css
    editor.js
  server/
    .env.example
    .env                     # non commité
    package.json
    src/
      index.js
      models/
        File.js
  .gitignore
  LICENSE
  README.md
  RELEASE_NOTES.md
```

## Sécurité

- Le rendu HTML est nettoyé via DOMPurify.
- Ne commitez jamais vos secrets (server/.env ignoré).

## Licence
MIT. Voir `LICENSE`.
```
