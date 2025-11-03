# Markdown Previewer

Application de prévisualisation Markdown avec dashboard et stockage MongoDB.

## Caractéristiques
- Dashboard épuré en grille affichant les fichiers sous forme de cartes.
- Tuile “+” pour créer un fichier. La carte de prévisualisation apparaît immédiatement.
- Bouton “…” sur chaque carte pour renommer ou supprimer un fichier.
- Clic sur une carte pour ouvrir l’éditeur plein écran.
- Éditeur Markdown avec aperçu en temps réel (Marked + DOMPurify).
- Rafraîchissement automatique du dashboard au retour de focus de la fenêtre.
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
- Ouvrir `http://localhost:5174/` → redirection automatique vers le dashboard.
- Créer un fichier via la tuile “+”.
- Renommer ou supprimer un fichier via le bouton “…” sur la carte.
- Ouvrir l’éditeur via un clic sur la carte, route `/editor.html?id=<ID>`.

## Raccourcis et interactions
- Navigation clavier sur le dashboard et dans le menu “…” (flèches, Entrée, Échap).
- Le dashboard se rafraîchit automatiquement quand la fenêtre retrouve le focus.

## API
- `GET /api/files` — lister
- `GET /api/files/:id` — lire
- `POST /api/files` — créer { title, content }
- `PUT /api/files/:id` — mettre à jour { title?, content? }
- `DELETE /api/files/:id` — supprimer

## Structure
```
markdown-previewer/
  dashboard.html
  editor.html
  index.html                 # previewer standalone, optionnel
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

## Licence

Ce projet est sous une licence
- Usage autorisé : privé et éducatif uniquement.
- Conservez les mentions de droit d’auteur et le texte de la licence.