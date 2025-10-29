# Markdown Previewer

Un visualiseur Markdown simple : à gauche un éditeur de texte, à droite l’aperçu rendu en temps réel.

## Fonctionnalités

- Édition Markdown en direct
- Rendu sécurisé (DOMPurify)
- Support GFM (titres, listes, code, liens…)
- Mise en page responsive (2 colonnes / 1 colonne)

## Utilisation

Ouvre `index.html` dans ton navigateur.  
Optionnel : lance un petit serveur local.

### Serveur local (facultatif)

- Python 3 : `python -m http.server 5173`
- Node (serve): `npx serve .`

## Structure

- `index.html`
- `src/main.js`
- `src/style.css`
- `.gitignore`
- `LICENSE`
- `README.md`
- `RELEASE_NOTES.md`

## Sécurité
Le HTML généré est nettoyé via [DOMPurify] avant insertion dans la page.

## Licence
MIT. Voir `LICENSE`.