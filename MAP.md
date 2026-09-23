# MAP — bac-maths-1ere-spe-2026

> Carte du repo pour démarrer sans explorer. Entretenue par le workflow MAP (fleet-kit).
> Le détail des conventions est dans CLAUDE.md — cette carte dit seulement OÙ aller.

## Quoi
Application de révision du bac couvrant **la première et la terminale**. Les textes restent
généraux : ni élève, ni année, ni matière dans les titres ; le barème du bac (`content/bac/`)
suit un profil pris **en exemple**. Cinq espaces (année × matière) + deux outils transverses :
- Terminale : `/terminale/maths`, `/terminale/physique-chimie` (pages créées, contenu à venir),
  `/terminale/grand-oral` (l'épreuve, préparation, exposé, entretien, oral blanc minuté ; « Mes 2
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
  terminale/grand-oral/ # grand oral : deroule (minutes), epreuve, preparation, expose, entretien,
                        # criteres, relances — sources prises dans content/bac/sources.json
src/
  lib/spaces.ts         # REGISTRE DES ESPACES : années, matières, outils → toute la navigation
                        # + SITE_NAME et pageTitle() (titre de l'onglet, tiré du fil d'Ariane)
  lib/themes.ts         # REGISTRE DES THÈMES (Clair, Sombre, Papier, Tableau, Lavande) ; les
                        # couleurs de chaque thème = variables CSS dans index.css
  lib/bac-content.ts    # chargeur validé de content/bac/ (+ bac-types.ts, bac-accents.ts)
  lib/simulateur.ts     # moteur du simulateur : découpe le barème en notes réglables,
                        # moyenne pondérée, mention, leviers (aucun coefficient en dur)
  lib/grand-oral-content.ts  # chargeur validé du grand oral (relit content/bac/ pour le
                        # coefficient, la période et les sources) ; lib/oral-blanc.ts = minuteur
  components/layout/    # AppLayout (cadre unique), MainSidebar (LA barre), SidebarShell,
                        # TopBar (repli + fil d'Ariane + ThemePicker), SectionTabs, ChapterLayout
  components/           # formulary, automatisms, exercises, exam, math (KaTeX)
  components/shared/    # EmptyState, Sommaire (encadré, ou colonne collée qui suit la lecture),
                        # Sources (appels [n] → liste en bas de page, registre
                        # content/bac/sources.json), PageLongue (gabarit des longues pages :
                        # sommaire à droite sur grand écran, sections numérotées), Essentiel
                        # (« L'essentiel » en tête de page : chiffres clés ou trois idées)
  components/simulateur/ # LigneNote (curseur + cadenas), Repartition (camembert SVG fait main)
  components/grand-oral/ # fiches, frise du déroulé, oral blanc minuté, cadre des 2 questions
  francais/             # volet français (components, lib, stores, routes) — cadre commun
  lib/                  # content-loader, progress, randomizer, validate (Ajv), use-is-compact,
                        # typographie (apostrophe ’ et espaces insécables, à l'affichage)
  routes/               # premiere/, chapter/, terminale/, outils/, HomePage
  stores/  App.tsx      # App.tsx porte aussi les redirections des anciennes adresses
scripts/
  verify.mjs            # LA vérification : typecheck + tests + validate-content(+fr) + build
  validate-content.mjs  validate-francais.mjs
  faits-inchanges.mjs   # garde-fou : nombres, dates, sources de content/bac/ et du grand
                        # oral, entrée par entrée, entre origin/main et l'arbre de travail
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
- **Ajouter un thème d'affichage** : une entrée dans `THEMES` (`src/lib/themes.ts`) + son bloc
  `:root[data-theme='<id>']` dans `src/index.css` (gris, blanc, police, arrondi) ; le sélecteur
  du bandeau le propose seul, un test vérifie que les deux sont alignés.
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
- Les gris `slate-*`, `white`, la police `font-sans` et les arrondis `rounded-*` passent par des
  variables CSS (`tailwind.config.js`) : ne pas écrire de gris en dur (`#…`, `gray-*`), sinon
  il ne suit plus le thème.
- Changer de page ramène en haut (`AppLayout`, sauf lien vers une ancre `#…`).
- `<main>` ne défile pas lui-même : c'est la fenêtre qui défile. Ne pas lui remettre
  `overflow-y-auto`, sinon les éléments `sticky` des pages (simulateur) décrochent.
- Les textes de `content/bac/` et du grand oral s'affichent via `typographie()` (apostrophe
  courbe, espaces insécables) : le JSON garde l'apostrophe droite, ne pas le réécrire pour ça.
- Reformuler un texte de `content/bac/` ou du grand oral : `node scripts/faits-inchanges.mjs`
  doit répondre « Aucun fait modifié ».
- Pas d'année (« 2027 »), d'élève (« pour lui ») ni de phrase d'accroche dans les titres et
  chapeaux de page ; une date n'apparaît que là où elle est un fait (calendrier, épreuves).
