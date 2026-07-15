# MAP — bac-maths-1ere-spe-2026

> Carte du repo pour démarrer sans explorer. Entretenue par le workflow MAP (fleet-kit).
> Le détail des conventions est dans CLAUDE.md — cette carte dit seulement OÙ aller.

## Quoi
Application de révision pour un élève de Première : **maths** (Épreuve Anticipée 2026, 4 modes :
formulaire, automatismes, exercices classiques, type bac) + volet **français** (EAF écrit + oral
par élève). Vite + React 18 + TS strict, KaTeX, Zustand, contenu 100 % JSON validé par Ajv.
Déployé sur GitHub Pages.

## Arborescence annotée
```
CLAUDE.md               # LA référence : conventions, workflow 2 passes, anti-patterns
.claude/
  skills/
    bac-maths-premiere-spe-2026/SKILL.md  # programme officiel maths (source de vérité)
    bac-francais-premiere-2026/SKILL.md   # cadre EAF français (source de vérité)
    bilan/  handoff/  reprends/SKILL.md   # rituel fin/transition de session (fleet-kit)
  agents/               # chapter-author, pedagogical-reviewer (+ équivalents français)
  commands/             # /new-chapter, /verify-conformity, /new-module-francais, /verify-francais
  figures-courbes-roadmap.md   # réserve de travail : figures/lecture graphique par chapitre
schemas/                # JSON Schema Ajv (maths à la racine, français dans francais/)
content/
  chapters/<slug>/      # maths : meta, formulas, automatisms, classics, exam-style (JSON)
  francais/<module>/    # français : meta, fiches, quiz, exercices
  francais/oral/        # commun (épreuve, méthode, grammaire) + eleves/<id>/ (par élève)
src/
  components/           # layout, formulary, automatisms, exercises, exam, math (KaTeX)
  francais/             # miroir isolé du volet français (components, lib, stores, routes)
  lib/                  # content-loader, progress, randomizer, validate (Ajv)
  routes/  stores/  App.tsx
scripts/
  verify.mjs            # LA vérification : typecheck + tests + validate-content(+fr) + build
  validate-content.mjs  validate-francais.mjs
tests/                  # Vitest ; Playwright pour les runners critiques
.github/workflows/
  deploy.yml            # Pages sur push main
  pr-ready.yml          # auto-mark PR comme ready (fleet-kit)
  map.yml  claude.yml   # stubs flotte : MAP auto + dispatch par issue `claude`
```

## Points d'entrée
- **Nouveau contenu maths** : `/new-chapter <slug>` puis workflow 2 passes
  (chapter-author → pedagogical-reviewer). JAMAIS de JSON pédagogique sans les 2 passes.
- **Nouveau contenu français** : `/new-module-francais`, mêmes règles (french-reviewer, 5 passes bloquantes).
- **Toucher l'UI maths** : `src/components/<domaine>/` ; l'état est dans `src/stores/` (Zustand).
- **Toucher l'UI français** : tout vit sous `src/francais/` — strictement additif, zéro modif maths.
- **Ajouter un élève (oral)** : dossier `content/francais/oral/eleves/<id>/` — l'URL apparaît seule.
- **Fin de session** : `/bilan` (récap branch/PR, mise à jour BACKLOG.md) + `/handoff` (prépare la reprise).

## Flux de données
JSON de contenu → `content-loader` (+ Ajv `validate.ts`) → stores Zustand → runners React.
Progression en localStorage : `bms-2026-*` (maths) / `bfr-2026-*` (français) — ne jamais croiser.

## Commandes
- Dev : `npm run dev` · Tests : `npm run test` · Typecheck : `npm run typecheck`
- **Vérif complète : `node scripts/verify.mjs`** (`--quick` = sans build)
- Déploiement : merger sur `main` (Pages via deploy.yml)

## Pièges
- Contenu pédagogique **sans les 2 passes** = interdit (CLAUDE.md §7 et §13.6).
- Hors-programme interdit (ln, intégrales… → SKILL.md §6) ; tout calcul **sans calculatrice**.
- KaTeX seulement (pas de `\require`/macros) ; LaTeX dans les chaînes JSON (`$...$`).
- TS strict + `noUncheckedIndexedAccess` : les accès indexés retournent `T | undefined`.
- Le volet français ne touche JAMAIS aux fichiers/localStorage maths (non-régression §13.9 : 71 tests).
