# Release Notes

## v0.3.2 - 2025-10-29
- Changement de licence : adoption d’une licence personnalisée **NoCommercial-NoDistribution**
  - Usage privé/éducatif autorisé
  - Interdiction de toute **distribution** et de tout **usage commercial**
  - Ajout de l’identifiant SPDX `LicenseRef-NoCommercial-NoDistribution`
  - Mise à jour du README et de la mention de licence dans `package.json`

## v0.3.1 - 2025-10-29
- Fix: rendu des cartes sur le dashboard (suppression propre puis ré-insertion, évite doublons/ordre instable)
- Amélioration: création de fichier plus robuste (try/catch, léger délai, rechargement depuis le serveur)
- Amélioration: rafraîchissement auto du dashboard au retour de focus de la fenêtre
- Divers: bind clavier et attributs ARIA conservés pour l’accessibilité

## v0.3.0 - 2025-10-29
- Redirection de la racine `/` vers le **dashboard**
- Nouveau **dashboard épuré** en grille avec **tuile “+”** pour créer un fichier
- Création d’un fichier → apparition immédiate d’une **carte de prévisualisation**
- Clic sur une carte → redirection vers l’**éditeur plein écran** (`/editor.html?id=<ID>`)
- Séparation de l’éditeur dans une page dédiée (UX plus claire)

## v0.2.0 - 2025-10-29
- Ajout d’un **dashboard** avec gestion de fichiers (CRUD)
- Stockage des fichiers en **MongoDB** (Atlas)
- API REST `/api/files` (GET/POST/PUT/DELETE)
- Serveur Express qui sert aussi le frontend
- Documentation README mise à jour

## v0.1.0 - 2025-10-29
- Initialisation du projet
- Éditeur Markdown + aperçu en temps réel
- Intégration Marked (parsing) et DOMPurify (sécurité)
- Mise en page responsive, styles de base
- README, licence, release notes
