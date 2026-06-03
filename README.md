# Bac Première · 2026 — Maths & Français

Application web statique de révision pour le baccalauréat session 2026, classe de Première. Elle regroupe **deux espaces indépendants** :

- **Maths** (`/`) — révision de l'**Épreuve Anticipée de Mathématiques** (vendredi 12 juin 2026, 2h, sans calculatrice, coefficient 2), Première spécialité mathématiques.
- **Français** (`/francais`) — révision de l'**Épreuve Anticipée de Français écrite** (4h, coefficient 5). L'oral EAF est hors périmètre v1.

Les deux volets partagent le même code applicatif mais sont **strictement isolés** : routes séparées, stores LocalStorage distincts (`bms-2026-*` pour les maths, `bfr-2026-*` pour le français), aucune dépendance croisée.

## Modules

### Maths (`/`)

- 📋 **Formulaire** — cartes de référence par chapitre
- ⚡ **Automatismes** — QCM rapides au format Partie 1 de l'EAM
- 📝 **Exercices classiques** — applications directes avec correction progressive
- 🎓 **Exercices type bac** — sujets multi-questions au format Partie 2

### Français (`/francais`)

- 📖 **Fiches** — fiches de méthode et de connaissances par module
- ⚡ **Quiz** — QCM, questions à choix multiples et exercices de remise en ordre
- ✍️ **Exercices** — exercices de repérage guidé avec correction progressive

Modules disponibles : `methode-commentaire`, `methode-dissertation`, `figures-de-style`, `mouvements-litteraires`, `registres-genres`.

## Stack

Vite · React 18 · TypeScript · Tailwind · KaTeX · Zustand · React Router

Déployé sur **GitHub Pages** via GitHub Actions.

## Démarrage

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build production
npm run preview  # prévisualiser le build
npm run test     # tests Vitest
```

## Structure

```
.
├── CLAUDE.md                       # référentiel pour Claude Code
├── .claude/
│   ├── skills/                     # skills : programmes officiels (maths + français)
│   ├── agents/                     # sub-agents (maths + français)
│   └── commands/                   # slash commands (maths + français)
├── schemas/                        # JSON Schema maths (validation Ajv)
│   └── francais/                   # JSON Schema français
├── content/
│   ├── chapters/<slug>/            # contenu maths (5 fichiers JSON par chapitre)
│   └── francais/<module>/          # contenu français (meta + fiches/quiz/exercices)
└── src/
    ├── ...                         # application React maths
    └── francais/                   # application React français (additive)
```

## Contenu pédagogique

Tout le contenu (formules, exercices, sujets) est en **JSON typé** sous `content/chapters/<slug>/`, séparé du code applicatif. Validation par schémas (Ajv) et revue pédagogique automatisée (sub-agent).

### Workflow d'ajout de contenu

**Maths :**
1. `/new-chapter <slug>` — scaffolding
2. Sub-agent `chapter-author` — génération
3. Sub-agent `pedagogical-reviewer` — validation 2-passes
4. `/verify-conformity` — validation globale avant commit

**Français** (sous `content/francais/`, validation `node scripts/validate-francais.mjs`) :
1. `/new-module-francais <slug>` — scaffolding
2. Sub-agent `french-content-author` — génération
3. Sub-agent `french-reviewer` — validation 2-passes (dont passes factuelle et citations bloquantes)
4. `/verify-francais` — validation globale avant commit

Le contenu français est en **JSON typé** sous `content/francais/<module>/`, validé par les schémas de `schemas/francais/`.

## Programme couvert

Programme de spécialité mathématiques de Première (BO spécial n°1 du 22 janvier 2019), en vigueur pour l'année scolaire 2025-2026. Cinq parties :

- **Algèbre** : suites numériques, second degré
- **Analyse** : dérivation, fonction exponentielle, trigonométrie
- **Géométrie** : produit scalaire, géométrie repérée du plan
- **Probabilités-Statistiques** : probabilités conditionnelles, variables aléatoires
- **Algorithmique et programmation** (transversal — non couvert en v1)

Détail complet : `.claude/skills/bac-maths-premiere-spe-2026/SKILL.md`

Pour le français : programme de l'EAF (4 objets d'étude — poésie, littérature d'idées, roman, théâtre). Détail complet : `.claude/skills/bac-francais-premiere-2026/SKILL.md`.

## Périmètre v1

**Maths** — trois chapitres pilotes :

1. Suites numériques
2. Dérivation
3. Probabilités conditionnelles

**Français** — cinq modules de méthodologie et de connaissances génériques (commentaire, dissertation, figures de style, mouvements littéraires, registres et genres). Les modules liés aux œuvres précises au programme (dissertation et commentaire ancrés sur les œuvres étudiées) sont prévus en phase ultérieure.

## Déploiement

Push sur la branche `main` → workflow GitHub Actions → déploiement automatique sur GitHub Pages.

URL de déploiement : `https://<user>.github.io/bac-maths-1ere-spe-2026/`

## Licence et usage

Outil personnel à usage privé. Le contenu pédagogique est généré à partir des programmes officiels (textes publics). Pas de redistribution prévue.
