# Markdown Previewer

Un visualiseur Markdown simple : à gauche un éditeur de texte, à droite l’aperçu rendu en temps réel.

## Fonctionnalités

- Édition Markdown en direct
- Rendu sécurisé (DOMPurify)
- Support GFM (titres, listes, code, liens…)
- Mise en page responsive (2 colonnes / 1 colonne)
- Dashboard avec CRUD de fichiers stockés en MongoDB

## Démarrage rapide

### Prérequis

- Node.js 18+
- Un cluster MongoDB (Atlas)

### Installation

```bash
# Backend
cd server
cp .env.example .env     # Renseigne MONGODB_URI et PORT si nécessaire
npm install
npm run dev
# Le serveur écoute sur http://localhost:5174

## Utilisation

- Previewer standalone : ouvrir `http://localhost:5174/index.html`
- Dashboard CRUD : ouvrir `http://localhost:5174/dashboard.html`

Le backend Express expose l’API REST suivante :

- `GET /api/files` : lister les fichiers
- `GET /api/files/:id`: récupérer un fichier
- `POST /api/files`: créer `{ title, content }`
- `PUT /api/files/:id`: mettre à jour `{ title?, content? }`
- `DELETE /api/files/:id`: supprimer

## Structure

markdown-previewer/
  index.html
  dashboard.html
  src/
    style.css
    main.js
    dashboard.css
    dashboard.js
  server/
    .env.example
    .env              # non commité
    package.json
    src/
      index.js
      models/
        File.js
  .gitignore
  LICENSE
  README.md
  RELEASE_NOTES.md

## Sécurité

- Le HTML rendu côté client est nettoyé avec DOMPurify.
- Ne commitez jamais vos secrets. Le fichier server/.env est ignoré par Git

## Licence
MIT. Voir `LICENSE`.
```
