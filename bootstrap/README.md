# Bac Maths Première Spé · 2026

Application web statique de révision pour l'**Épreuve Anticipée de Mathématiques** du baccalauréat session 2026 (vendredi 12 juin 2026, 2h, sans calculatrice, coefficient 2), classe de Première spécialité mathématiques.

## Modules

- 📋 **Formulaire** — cartes de référence par chapitre
- ⚡ **Automatismes** — QCM rapides au format Partie 1 de l'EAM
- 📝 **Exercices classiques** — applications directes avec correction progressive
- 🎓 **Exercices type bac** — sujets multi-questions au format Partie 2

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
├── CLAUDE.md                   # référentiel pour Claude Code
├── .claude/
│   ├── skills/                 # skill : programme officiel
│   ├── agents/                 # sub-agents (chapter-author, pedagogical-reviewer)
│   └── commands/               # slash commands (/new-chapter, /verify-conformity)
├── schemas/                    # JSON Schema (validation Ajv)
├── content/chapters/<slug>/    # contenu pédagogique (5 fichiers JSON par chapitre)
└── src/                        # application React
```

## Contenu pédagogique

Tout le contenu (formules, exercices, sujets) est en **JSON typé** sous `content/chapters/<slug>/`, séparé du code applicatif. Validation par schémas (Ajv) et revue pédagogique automatisée (sub-agent).

### Workflow d'ajout de contenu

1. `/new-chapter <slug>` — scaffolding
2. Sub-agent `chapter-author` — génération
3. Sub-agent `pedagogical-reviewer` — validation 2-passes
4. `/verify-conformity` — validation globale avant commit

## Programme couvert

Programme de spécialité mathématiques de Première (BO spécial n°1 du 22 janvier 2019), en vigueur pour l'année scolaire 2025-2026. Cinq parties :

- **Algèbre** : suites numériques, second degré
- **Analyse** : dérivation, fonction exponentielle, trigonométrie
- **Géométrie** : produit scalaire, géométrie repérée du plan
- **Probabilités-Statistiques** : probabilités conditionnelles, variables aléatoires
- **Algorithmique et programmation** (transversal — non couvert en v1)

Détail complet : `.claude/skills/bac-maths-premiere-spe-2026/SKILL.md`

## Périmètre v1

Trois chapitres pilotes :

1. Suites numériques
2. Dérivation
3. Probabilités conditionnelles

## Déploiement

Push sur la branche `main` → workflow GitHub Actions → déploiement automatique sur GitHub Pages.

URL de déploiement : `https://<user>.github.io/bac-maths-1ere-spe-2026/`

## Licence et usage

Outil personnel à usage privé. Le contenu pédagogique est généré à partir des programmes officiels (textes publics). Pas de redistribution prévue.
