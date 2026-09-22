# MAP — bac-maths-1ere-spe-2026

> Carte du repo pour démarrer sans explorer. Entretenue par le workflow MAP (fleet-kit).
> Le détail des conventions est dans CLAUDE.md — cette carte dit seulement OÙ aller.

## Quoi
Application de révision couvrant les **deux années** du bac session 2027 d'un élève.
Cinq espaces (année × matière) + deux outils transverses :
- Terminale : `/terminale/maths`, `/terminale/physique-chimie` (pages créées, contenu à venir),
  `/terminale/grand-oral` (l'épreuve, préparation, entretien, oral blanc minuté ; « Mes 2
  questions » = cadre rempli par l'élève)
- Première : `/premiere/maths` (EAM, 4 modes + bac blanc), `/premiere/francais` (EAF écrit + oral
  par élève) — complets
- Outils : `/simulateur` (régler ses notes, moyenne et mention en direct), `/le-bac` (mode
  d'emploi : épreuves, coefficients, calendrier, mentions) — complets

Vite + React 18 + TS strict, KaTeX, Zustand, contenu 100 % JSON validé par Ajv. GitHub Pages.

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
schemas/                # JSON Schema Ajv (maths à la racine, francais/, bac/, grand-oral/)
content/
  chapters/<slug>/      # maths : meta, formulas, automatisms, classics, exam-style (JSON)
  francais/<module>/    # français : meta, fiches, quiz, exercices
  francais/oral/        # commun (épreuve, méthode, grammaire) + eleves/<id>/ (par élève)
  bac/                  # mode d'emploi du bac : coefficients, epreuves, calendrier,
                        # mentions, sources — SOURCE UNIQUE des coefficients du site
  terminale/grand-oral/ # grand oral : deroule (minutes), epreuve, preparation, entretien,
                        # criteres, relances — sources prises dans content/bac/sources.json
src/
  lib/spaces.ts         # REGISTRE DES ESPACES : années, matières, outils → toute la navigation
  lib/bac-content.ts    # chargeur validé de content/bac/ (+ bac-types.ts, bac-accents.ts)
  lib/simulateur.ts     # moteur du simulateur : découpe le barème en notes réglables,
                        # moyenne pondérée, mention, leviers (aucun coefficient en dur)
  lib/grand-oral-content.ts  # chargeur validé du grand oral (relit content/bac/ pour le
                        # coefficient, la période et les sources) ; lib/oral-blanc.ts = minuteur
  components/layout/    # AppLayout (cadre unique), MainSidebar (LA barre), SidebarShell,
                        # TopBar (repli + fil d'Ariane), SectionTabs, ChapterLayout
  components/           # formulary, automatisms, exercises, exam, math (KaTeX), shared/EmptyState
  components/simulateur/ # LigneNote (curseur + cadenas), Repartition (camembert SVG fait main)
  components/grand-oral/ # fiches, frise du déroulé, oral blanc minuté, cadre des 2 questions
  francais/             # volet français (components, lib, stores, routes) — cadre commun
  lib/                  # content-loader, progress, randomizer, validate (Ajv), use-is-compact
  routes/               # premiere/, chapter/, terminale/, outils/, HomePage
  stores/  App.tsx      # App.tsx porte aussi les redirections des anciennes adresses
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
- **Ajouter une matière / un espace** : une entrée dans `SPACES` (`src/lib/spaces.ts`) + ses
  routes dans `App.tsx` ; la barre latérale et l'accueil se mettent à jour seuls.
- **Toucher l'UI maths** : `src/components/<domaine>/` ; l'état est dans `src/stores/` (Zustand).
- **Toucher l'UI français** : tout vit sous `src/francais/` (le cadre et la barre sont communs).
- **Ajouter un élève (oral)** : dossier `content/francais/oral/eleves/<id>/` — l'URL apparaît seule.
- **Toucher un coefficient du bac** : `content/bac/coefficients.json` et lui seul ; la page
  `/le-bac` et le simulateur de moyenne le lisent. Chaque ligne cite sa source
  officielle, déclarée dans `content/bac/sources.json`.
- **Toucher le grand oral** : contenu dans `content/terminale/grand-oral/` (CLAUDE.md §4.3 :
  réglementaire sourcé / méthode / personnel, jamais mélangés) ; les minutes des temps sont
  dans `deroule.json` seulement ; les questions de l'élève ne sont jamais écrites dans le dépôt.
- **Toucher le simulateur** : le calcul est dans `src/lib/simulateur.ts` (testé), l'état dans
  `src/stores/simulateur-store.ts`, l'écran dans `src/routes/outils/SimulateurPage.tsx`.
- **Fin de session** : `/bilan` (récap branch/PR, mise à jour BACKLOG.md) + `/handoff` (prépare la reprise).

## Flux de données
JSON de contenu → `content-loader` (+ Ajv `validate.ts`) → stores Zustand → runners React.
Progression en localStorage : `bms-2026-*` (maths) / `bfr-2026-*` (français) /
`btl-2027-*` (simulateur de moyenne) / `bgo-2027-*` (grand oral) — ne jamais croiser.

## Commandes
- Dev : `npm run dev` · Tests : `npm run test` · Typecheck : `npm run typecheck`
- **Vérif complète : `node scripts/verify.mjs`** (`--quick` = sans build)
- Déploiement : merger sur `main` (Pages via deploy.yml)

## Pièges
- Contenu pédagogique **sans les 2 passes** = interdit (CLAUDE.md §7 et §13.6).
- Hors-programme interdit (ln, intégrales… → SKILL.md §6) ; tout calcul **sans calculatrice**.
- KaTeX seulement (pas de `\require`/macros) ; LaTeX dans les chaînes JSON (`$...$`).
- TS strict + `noUncheckedIndexedAccess` : les accès indexés retournent `T | undefined`.
- Le volet français ne touche JAMAIS au localStorage maths (non-régression §13.9 : 77 tests).
- Aucun coefficient du bac en dur dans un composant : tout vient de `content/bac/coefficients.json`
  (un attribut qui manque au simulateur s'ajoute au schéma, pas au code).
- Les anciennes adresses (`/chapitre/*`, `/bac-blanc`, `/francais/*`) sont redirigées dans
  `App.tsx` — ne pas les supprimer.
