# Bac Maths Première Spé 2026 — Application de révision

## 1. Mission du projet

Application web statique destinée à un élève précis en classe de Première spécialité mathématiques (année scolaire 2025-2026) pour préparer l'**Épreuve Anticipée de Mathématiques (EAM)** du baccalauréat session 2026 (vendredi 12 juin 2026, 8h-10h, 2h, sans calculatrice, coefficient 2).

L'application offre quatre modes de travail :

- **Formulaire** : cartes de référence par chapitre
- **Automatismes** : QCM rapides (Partie 1 de l'EAM, 6 points)
- **Exercices classiques** : applications directes des notions, avec correction progressive
- **Exercices type bac** : sujets multi-questions au format Partie 2 de l'EAM

## 2. Lecture obligatoire avant toute génération de contenu

Le fichier **`.claude/skills/bac-maths-premiere-spe-2026/SKILL.md`** est la **source de vérité** pour tout contenu pédagogique. Il contient :

- Le programme officiel de spécialité (BO spécial n°1 du 22 janvier 2019)
- Le format réglementaire de l'EAM (décret du 10 juin 2025)
- La liste des automatismes évaluables (note de service du 10 juin 2025)
- La liste des notions hors-programme à exclure

**Toute génération ou modification de contenu pédagogique doit commencer par la lecture de ce skill.** Les sub-agents `chapter-author` et `pedagogical-reviewer` y font référence systématiquement.

## 3. Stack technique

| Couche | Choix |
|---|---|
| Build | Vite + React 18 + **TypeScript strict** |
| Style | Tailwind CSS (utility-first, pas de CSS custom hors animations) |
| Math | **KaTeX** (pas MathJax) |
| Géométrie | JSXGraph, **lazy-loaded** uniquement dans les composants qui l'utilisent |
| Routing | React Router v6 |
| État | **Zustand** |
| Persistance | LocalStorage (préfixe `bms-2026-`) |
| Validation JSON | **Ajv** contre les schémas dans `schemas/` |
| Tests | Vitest (logique) + Playwright (runners critiques) |
| CI/CD | GitHub Actions → GitHub Pages |

Cible navigateur : Chrome/Firefox/Safari récents (desktop). Pas d'effort spécifique mobile en v1.

## 4. Structure du dépôt

```
bac-maths-1ere-spe-2026/
├── CLAUDE.md                                       ← ce fichier
├── README.md
├── .claude/
│   ├── skills/bac-maths-premiere-spe-2026/SKILL.md ← référentiel programme
│   ├── agents/                                     ← sub-agents
│   │   ├── chapter-author.md
│   │   └── pedagogical-reviewer.md
│   └── commands/                                   ← slash commands
│       ├── new-chapter.md
│       └── verify-conformity.md
├── schemas/                                        ← JSON Schema (Ajv)
│   ├── formula.schema.json
│   ├── automatism.schema.json
│   ├── classic-exercise.schema.json
│   └── exam-exercise.schema.json
├── content/
│   └── chapters/<slug>/
│       ├── meta.json
│       ├── formulas.json
│       ├── automatisms.json
│       ├── classics.json
│       └── exam-style.json
├── src/
│   ├── components/
│   │   ├── layout/         (Sidebar, Header, ChapterTabs)
│   │   ├── formulary/      (FormulaCard, FormulaSearch)
│   │   ├── automatisms/    (QcmRunner, QcmResult)
│   │   ├── exercises/      (ExerciseRunner, HintSystem, ProgressiveSolution)
│   │   ├── exam/           (ExamRunner, Timer)
│   │   └── math/           (MathInline, MathBlock — wrappers KaTeX)
│   ├── lib/
│   │   ├── content-loader.ts
│   │   ├── progress.ts
│   │   ├── randomizer.ts
│   │   └── validate.ts
│   ├── routes/
│   ├── stores/
│   └── App.tsx
└── tests/
```

## 5. Conventions de code

- **TypeScript strict** : `"strict": true`, `"noUncheckedIndexedAccess": true`
- **Composants fonctionnels** uniquement, hooks
- **Pas de classe CSS custom** : Tailwind utility-first ; CSS additionnel uniquement pour ce que Tailwind ne couvre pas (animations complexes)
- **Nommage** : `PascalCase` pour composants, `kebab-case` pour utils/fichiers de données, `camelCase` pour variables/fonctions
- **Imports** : alias `@/` pointant vers `src/`
- **LaTeX** : toujours dans des chaînes JSON, encadré par `$...$` (inline) ou `$$...$$` (block). Pas de fichiers `.tex`.
- **Pas de logging en production** : retirer `console.log` avant commit (lint rule)

## 6. Conventions de contenu

| Type | ID format | Convention |
|---|---|---|
| Formule | `f-<slug>` | `f-suite-arith-terme-general` |
| Automatisme | `a-<slug>` | `a-fact-x2-9` |
| Exercice classique | `c-<chapitre>-<num>` | `c-suites-001` |
| Exercice type bac | `e-<chapitre|transverse>-<num>` | `e-derivation-001` |

Notations conformes au BO :

- `uₙ` (et non `u_n` en texte courant ; en LaTeX : `u_n` correct)
- `f'(x)` (et non `f^{(1)}(x)` ou `\\dot f`)
- `eˣ` ou `e^x` en LaTeX (et non `\exp`)
- Vecteurs : `\vec{u}` en LaTeX, `u⃗` en texte
- Probabilités : `P(A)`, `P_B(A)`, `P(A \cap B)`

## 7. Workflow obligatoire de génération de contenu : système 2 passes

**Aucun fichier JSON de contenu pédagogique ne doit être commité sans avoir passé les 2 étapes suivantes :**

```
   ┌─────────────────────┐      ┌──────────────────────────┐
   │   chapter-author    │  →   │  pedagogical-reviewer    │
   │  (génère contenu)   │      │  (valide conformité)     │
   └─────────────────────┘      └──────────────────────────┘
              ↓                              ↓
        Fichier JSON brut             Fichier JSON validé
                                       + rapport de revue
```

**Étape 1 — `chapter-author`** : produit le contenu en suivant les schémas et le skill.

**Étape 2 — `pedagogical-reviewer`** : vérifie :

- Conformité au programme (rien hors-programme)
- Tous calculs faisables sans calculatrice
- Notations BO respectées
- LaTeX valide (subset KaTeX)
- Cohérence des réponses
- Niveau cognitif approprié au type d'exercice

En cas de problème détecté, le reviewer renvoie un rapport ; le author corrige ; nouvelle revue. **Maximum 3 itérations** avant escalade à l'utilisateur.

## 8. Slash commands disponibles

- `/new-chapter <slug>` : scaffolding d'un nouveau chapitre (5 fichiers JSON vides + meta)
- `/verify-conformity` : passe l'ensemble du contenu au crible (schémas + reviewer pédagogique)

## 9. Règles d'or pour le contenu pédagogique

1. **Sans calculatrice** : tout calcul doit être faisable mentalement ou à la main avec rigueur. Pas de valeurs exotiques (`√7`, `e^3.14`, etc.). Privilégier valeurs entières, fractions simples (`1/2`, `1/3`, `1/4`, `2/3`, `3/4`), racines simples (`√2`, `√3`), valeurs trigo usuelles (`0`, `π/6`, `π/4`, `π/3`, `π/2`, `π`).
2. **Programme strict** : si une notion ne figure pas dans SKILL.md sections 2.x, elle est interdite. En cas de doute, voir SKILL.md section 6 (liste hors-programme).
3. **Niveau cognitif** :
   - Automatismes : réponse en < 60s, pas de rédaction
   - Classiques : application directe d'une méthode du cours, rédaction simple (3-5 lignes)
   - Type bac : multi-étapes (3-7 questions), rédaction structurée
4. **LaTeX valide KaTeX** : pas de `\require`, pas de macros TeX customs, pas de `\newcommand`
5. **Tolérance numérique** : pour les automatismes de type `numeric`, toujours préciser `tolerance` (typiquement `0` pour entier, `0.01` pour décimal)

## 10. Phases de développement

| Phase | Description | Sortie attendue |
|---|---|---|
| 1 | Init projet | Repo Vite+React+TS+Tailwind+KaTeX, CI GitHub Pages opérationnelle |
| 2 | Fondations | Layout (sidebar/header/tabs), routing, wrappers math, store Zustand, loader JSON+Ajv |
| 3 | Runners génériques | FormulaCard, QcmRunner, ExerciseRunner avec HintSystem 3-niveaux, ExamRunner avec Timer |
| 4 | Chapitre **Suites** | Contenu complet validé par 2 passes |
| 5 | Chapitres **Dérivation** + **Probabilités conditionnelles** | Contenus complets validés |
| 6 | Polish + déploiement | Tests, build prod, mise en ligne GitHub Pages |

Chaque phase se termine par un commit `git` propre et un build qui passe.

## 11. En cas de doute

- Sur une notion mathématique → **relire SKILL.md**
- Sur un format de fichier → **vérifier le schéma** dans `schemas/`
- Sur une décision technique → suivre les conventions ci-dessus
- Si vraiment ambigu → **demander à l'utilisateur**, ne pas inventer

## 12. Anti-patterns à éviter

- ❌ Générer un fichier JSON sans passer par les 2 sub-agents
- ❌ Inventer des notations non conformes au BO
- ❌ Inclure des notions de terminale (ln, intégrale, récurrence formelle, etc.)
- ❌ Proposer des exercices nécessitant une calculatrice
- ❌ Mélanger CSS custom et Tailwind sans nécessité
- ❌ Utiliser MathJax au lieu de KaTeX
- ❌ Ajouter des dépendances NPM sans justification (et sans accord utilisateur)

---

## 13. Volet Français — EAF écrit 2026

### 13.1 Mission

Préparer l'**Épreuve Anticipée de Français** dans le **même dépôt** que le volet maths : l'**écrit** (4h, coeff 5 — commentaire ou dissertation) **et l'oral** (20 min après 30 min de préparation, coeff 5). Voir SKILL.md § 6bis pour le format de l'oral.

Principe directeur : **strictement additif**. Aucune modification des fichiers maths. Le français vit sous `/francais/*`.

### 13.2 Source de vérité

Le fichier **`.claude/skills/bac-francais-premiere-2026/SKILL.md`** est la source de vérité pour tout contenu pédagogique français. Il contient le cadre EAF, les 4 objets d'étude, les données factuelles (mouvements, figures, registres), la méthodologie attendue et les règles de citation.

**Toute génération de contenu français doit commencer par la lecture de ce skill.**

### 13.3 Architecture additionnelle

```
content/francais/<module>/
  meta.json        # FrenchModuleMeta
  fiches.json      # Fiche[]
  quiz.json        # QuizItem[]
  exercices.json   # FrenchExercise[]
content/francais/oral/          # espace spécial Oral (comme express/)
  oral-meta.json                # OralMeta (jamais meta.json → évite la collision de glob)
  epreuve.json methode.json grammaire-fiches.json   # OralFiche[]  — COMMUN à tous les élèves
  grammaire-quiz.json           # QuizItem[] (ids oq-)             — COMMUN
  eleves/<id>/                  # descriptif PROPRE à chaque élève (un dossier = un élève)
    profil.json                 # OralStudent (id = slug d'URL, nom, œuvres, contexte)
    textes.json                 # OralText[]  (analyses linéaires, ids ot-)
    entretien.json              # EntretienQuestion[] (ids eq-)

schemas/francais/
  fiche.schema.json  quiz.schema.json  french-exercise.schema.json  french-subject.schema.json
  oral-text.schema.json  entretien-question.schema.json
  oral-fiche.schema.json  oral-quiz.schema.json  oral-meta.schema.json  oral-student.schema.json

src/francais/
  components/layout/  (FrenchLayout, FrenchSidebar, FrenchHeader, FrenchTabs, FrenchModuleLayout)
  components/text/    LiteraryText.tsx  (fork TextWithMath, sans KaTeX)
  components/fiches/  FicheCard.tsx
  components/quiz/    QuizRunner.tsx   (types qcm | multi | ordering)
  components/exercices/ FrenchExerciseRunner.tsx
  components/oral/    (OralStudentLayout, OralTabs, OralTextCard, OralTextDetail, OralTextBody,
                       EntretienQuestionList, RevealPanel, AdjustableTimer, OralSimulator)
  lib/  (french-content-loader.ts, french-validate.ts, french-types.ts)
  stores/  (french-progress-store.ts, french-app-store.ts)
  routes/  (FrenchHomePage.tsx, module/{FichesPage, QuizPage, ExercicesPage, SujetsPage},
            oral/{OralSelectPage, OralHomePage, OralTextesPage, OralTextDetailPage, OralMethodePage,
                  OralGrammairePage, OralEntretienPage, OralSimulateurPage})
```

Route : `/francais/*` (ajout additif dans `src/App.tsx`), dont l'oral **par élève** :
`/francais/oral` (sélecteur d'élève) puis `/francais/oral/:eleve/*` (descriptif de l'élève).

### 13.4 LocalStorage — isolation garantie

| App | Préfixe |
|---|---|
| Maths (existant) | `bms-2026-*` — **JAMAIS touché par le code français** |
| Français (nouveau) | `bfr-2026-*` |

### 13.5 Conventions de contenu

| Type | Préfixe d'ID | Exemple |
|---|---|---|
| Fiche | `fi-` | `fi-figure-metaphore` |
| Quiz | `qz-` | `qz-mouvement-romantisme-dates` |
| Exercice | `ex-<module>-<num>` | `ex-commentaire-001` |
| Analyse linéaire (oral) | `ot-` | `ot-rimbaud-dormeur-du-val` |
| Question d'entretien (oral) | `eq-` | `eq-manon-choix-oeuvre` |
| Quiz grammaire (oral) | `oq-` | `oq-subordonnee-relative-1` |
| Élève (oral) | `<id>` slug du dossier | `j`, `marie-l` (= `profil.id` + `eleves/<id>/`) |

Modules v1 (génériques) : `methode-commentaire`, `methode-dissertation`, `figures-de-style`, `mouvements-litteraires`, `registres-genres`

Espace **oral** (`content/francais/oral/`) : voir SKILL.md § 9. Le contenu commun (épreuve, méthode, grammaire) est partagé ; le **descriptif est propre à chaque élève** sous `eleves/<id>/` (textes + entretien + `profil.json`). Ajouter un élève = déposer un dossier `eleves/<id>/` (textes via le workflow 2 passes ; **jamais** de texte sous copyright → `domainePublic:false` + collage local) ; le bouton et l'URL `/francais/oral/<id>` apparaissent automatiquement. Le contenu pédagogique oral suit le même workflow 2 passes (`french-content-author` → `french-reviewer`) ; le `profil.json` (contexte non pédagogique) ne requiert que la validation Ajv.

### 13.6 Workflow obligatoire (2 passes)

```
french-content-author  →  french-reviewer  →  commit
```

Aucun fichier JSON de contenu français ne doit être commité sans avoir passé les 2 étapes.

Le **`french-reviewer`** effectue 7 passes dont **5 BLOQUANTES** :
- A — Schéma JSON (Ajv)
- B — Conformité programme EAF
- D — Exactitude factuelle (dates, attributions, siècles) ← renforcée
- E — Exactitude des citations (domaine public, textuellement exacts) ← renforcée
- F — Cohérence réponses QCM/ordering

### 13.7 Slash commands

- `/new-module-francais <slug>` : scaffolding d'un nouveau module (meta.json + 3 fichiers JSON vides)
- `/verify-francais [slug]` : validation Ajv + french-reviewer sur tous les modules (ou un seul)

### 13.8 Règles de citation

1. Textes du **domaine public** uniquement (auteur décédé avant 1926 en France).
2. Citations **textuellement exactes** (pas de reformulation).
3. Toujours indiquer : auteur + titre de l'œuvre + date.
4. En cas de doute sur l'exactitude → ne pas citer ou demander le texte source.

### 13.9 Non-régression maths

À chaque commit lié au volet français :
1. `npm run typecheck` passe sans erreur supplémentaire.
2. `npm run build` produit un build valide.
3. `npm run test` — 71 tests passent (score de référence).
4. Routes maths (`/`, `/chapitre/:slug/*`, `/bac-blanc`) inchangées.
5. LocalStorage maths `bms-2026-app` / `bms-2026-progress` **intactes**.
