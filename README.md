# Bac Première · 2026 — Maths & Français

Application web statique de révision pour le baccalauréat session 2026, classe de Première. Elle regroupe **deux espaces indépendants** :

- **Maths** (`/`) — révision de l'**Épreuve Anticipée de Mathématiques** (vendredi 12 juin 2026, 2h, sans calculatrice, coefficient 2), Première spécialité mathématiques.
- **Français** (`/francais`) — révision de l'**Épreuve Anticipée de Français**, écrit (4h, coefficient 5) **et oral** (20 min après 30 min de préparation, coefficient 5).

Les deux volets partagent le même code applicatif mais sont **strictement isolés** : routes séparées, stores LocalStorage distincts (`bms-2026-*` pour les maths, `bfr-2026-*` pour le français), aucune dépendance croisée.

## Modules

### Maths (`/`)

- 📋 **Formulaire** — cartes de référence par chapitre
- ⚡ **Automatismes** — QCM rapides au format Partie 1 de l'EAM
- 📝 **Exercices classiques** — applications directes avec correction progressive
- 🎓 **Exercices type bac** — sujets multi-questions au format Partie 2
- 🧪 **Bac blanc** — sujets complets chronométrés (3 sujets EAM 2026)

Chapitres disponibles : `suites`, `derivation`, `second-degre`, `exponentielle`, `trigonometrie`, `produit-scalaire`, `geometrie-reperee`, `probas-cond`, `variables-aleatoires`.

Thème clair/sombre disponible (bouton dans l'en-tête).

### Français — Écrit (`/francais`)

- 📖 **Fiches** — fiches de méthode et de connaissances par module
- ⚡ **Quiz** — QCM, questions à choix multiples et exercices de remise en ordre
- ✍️ **Exercices** — exercices de repérage guidé avec correction progressive

Modules disponibles : `methode-commentaire`, `methode-dissertation`, `figures-de-style`, `mouvements-litteraires`, `registres-genres`, `poesie`, `litterature-idees`, `roman`, `theatre`, `express` (révision rapide).

### Français — Oral (`/francais/oral`)

Espace **par élève** (`/francais/oral/<eleve>`) : présentation de l'épreuve, méthode, fiches de grammaire + quiz, analyses linéaires des textes étudiés, questions d'entretien, œuvre choisie (2ᵈᵉ partie de l'oral), simulateur d'entretien chronométré. Le contenu commun (épreuve, méthode, grammaire) est partagé entre élèves ; les textes et l'entretien sont propres à chaque élève.

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

## Contenu disponible dans l'app

**Maths** — neuf chapitres du programme de spécialité (algèbre, analyse, géométrie, probabilités-statistiques) ; l'algorithmique et la programmation (transversale) ne sont pas couvertes.

**Français** — dix modules de l'écrit (méthodologie, connaissances génériques et par objet d'étude) et l'espace oral complet (par élève).

## Déploiement

Push sur la branche `main` → workflow GitHub Actions → déploiement automatique sur GitHub Pages.

URL de déploiement : `https://<user>.github.io/bac-maths-1ere-spe-2026/`

## Licence et usage

Outil personnel à usage privé. Le contenu pédagogique est généré à partir des programmes officiels (textes publics). Pas de redistribution prévue.
