# Site d'annonces de la faculté

Plateforme web permettant aux étudiants de la faculté de publier et consulter des annonces (clubs, objets perdus, événements, etc.). Les annonces sont modérées par des agents administratifs avant leur publication.

## Équipe

- Eya Benali
- Arwa Barnat
- Anissa Ben Brahim
- Maram Ben Khemis
- Khadija Chakroun

## Stack utilisée

- Front office (étudiants) : Angular
- Back office (agents) : Node.js, EJS
- Back-end / API : Node.js
- Base de données : MongoDB

## Architecture

Le projet est composé de deux interfaces qui s'appuient sur un back-end commun en Node.js :

| Partie | Utilisateurs | Technologie |
|--------|--------------|-------------|
| Front office | Étudiants | Angular |
| Back office | Agents | Node.js avec EJS |
| API et logique métier | Les deux | Node.js |
| Base de données | Les deux | MongoDB |

Structure du dépôt :

```
.
├── backend/       # API Node.js et back office EJS (agents)
├── frontend/      # Application Angular (étudiants)
├── conception/    # Documents de conception (backlog, diagrammes, maquettes)
└── README.md
```

