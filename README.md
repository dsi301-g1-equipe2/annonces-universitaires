# [Nom du projet] – Plateforme d'annonces universitaires

Plateforme web permettant aux étudiants de publier et consulter des annonces au sein de la faculté, avec modération par les agents.

## Technologies

- **Backend** : Node.js + Express
- **Back office** (agents) : EJS, servi par le backend
- **Frontend** (étudiants) : Angular

## Structure du dépôt

- `backend/` : API Express et back office EJS
- `frontend/` : application Angular (à venir)

## Installation

### Prérequis

- Node.js (version LTS)
- Git

### Backend

```bash
cd backend
npm install
```

Copier le fichier `.env.example` en `.env` puis renseigner les variables.

### Frontend

Instructions à venir.

## Organisation du travail

- Le backlog est géré avec les **Issues** et le tableau **GitHub Projects**.
- Chaque issue est réalisée sur une **branche dédiée** créée à partir de `main`.
- Il est **interdit de pousser directement sur `main`**.
- Une fois la fonctionnalité terminée, on ouvre une **Pull Request** vers `main`, en mentionnant l'issue (`Closes #numéro`).
- Une PR n'est fusionnée qu'après **validation par la reviewer** ([ton nom]).

### Conventions

- Branches : `feature/nom-court` ou `fix/nom-court`
- Commits : `feat: ...`, `fix: ...`, `docs: ...`

## Équipe

- [Nom 1]
- [Nom 2]
- [Nom 3]
- [Nom 4]
- [Nom 5]