---
name: terminale-charte
description: Charte de construction des espaces de terminale (maths et physique-chimie, et toute matière de terminale ajoutée ensuite) — format des données, écriture du cours, niveaux d'exercices, priorités et quotas, rattachement au programme, règles des pages, circuit de production et définition de « chapitre fini ». À lire AVANT toute création ou modification de contenu, de schéma ou de page sous /terminale/maths ou /terminale/physique-chimie. Lue systématiquement par les agents tle-architecte, tle-auteur-cours, tle-auteur-exercices, tle-auteur-bac, tle-relecteur, tle-eleve-testeur et annales-indexeur.
---

# Charte de construction — terminale

Le plan d'ensemble (pourquoi, feuille de route) est dans `chantiers/terminale/README.md`.
Cette charte dit **comment** construire. En cas d'écart, la charte fait foi ; une fois les
schémas `schemas/terminale/` écrits, **le schéma fait foi** pour les noms de champs et la
§ 3 devient son commentaire (la mettre à jour dans la même PR si un champ change).

Ordre de lecture pour tout agent : cette charte → le **référentiel de la matière**
(`.claude/skills/bac-<matiere>-terminale-2027/SKILL.md` + `content/terminale/<matiere>/programme.json`)
→ les fichiers déjà écrits du chapitre.

> Tant que le référentiel d'une matière n'existe pas, **aucun contenu** de cette matière ne
> s'écrit. Un agent qui ne le trouve pas s'arrête et le dit.

---

## 1. Les huit règles d'or

1. **L'élève doit pouvoir apprendre seul.** Tout ce qu'il lit se comprend sans professeur :
   l'idée avant la règle, un exemple par définition, aucune étape sautée.
2. **Tout se rattache au programme.** Chaque notion, bloc de cours, exercice, carte ou
   question cite les lignes du programme qu'elle travaille (`capacites`). Rien d'autre.
3. **Tout le programme est couvert.** Chaque ligne du programme d'un chapitre appartient à
   une notion et reçoit cours, exercices et questions éclair (§ 9).
4. **L'important passe devant.** La priorité d'une notion (§ 5) décide de l'ordre, de la
   quantité et des parcours ; elle est affichée avec sa raison.
5. **La difficulté monte par marches.** Comprendre → S'entraîner → Approfondir → Type bac ;
   un exercice ne mobilise que ce que le cours du chapitre (ou les chapitres précédents,
   ou la première) a posé — sauf en type bac.
6. **Exact et recalculé.** Chaque résultat est recalculé par le relecteur ; en physique,
   chaque valeur a son unité et des chiffres significatifs cohérents.
7. **Pas de remplissage.** Les quotas sont des planchers ; au-delà du double, on s'arrête.
   Un item qui n'apprend rien de neuf à l'élève est retiré.
8. **Le contenu vit dans le JSON, jamais dans les composants.** Aucun texte pédagogique,
   aucune valeur de programme en dur dans le code.

---

## 2. Arborescence et identifiants

```
content/terminale/<matiere>/            matiere ∈ { maths, physique-chimie }
  programme.json                        lignes du programme (référentiel)
  annales.json                          index des sujets passés (annales-indexeur)
  methodes/                             page « Méthodes » de la matière (même format que cours.json)
  chapitres/<slug>/
    meta.json        notions.json       (tle-architecte)
    cours.json       memo.json          (tle-auteur-cours)
    exercices.json   flash.json         (tle-auteur-exercices)
    type-bac.json                       (tle-auteur-bac)
public/figures/terminale/<matiere>/<slug>/   figures statiques (SVG de préférence)
schemas/terminale/                      schémas Ajv (jamais ceux de première)
```

Les slugs de chapitre sont en `kebab-case`, sans accent, **uniques entre les matières**.

| Objet | Préfixe | Exemple |
|---|---|---|
| Ligne du programme (maths / physique-chimie / première de physique-chimie) | `bo-m-`, `bo-pc-`, `bo-pc1-` | `bo-m-suites-07` |
| Sujet d'annales | `an-` | `an-2024-metropole-j1` |
| Notion | `n-<chapitre>-<slug>` | `n-limites-suites-monotone-bornee` |
| Bloc de cours | `l-<chapitre>-<num3>` | `l-limites-suites-014` |
| Exercice (marches 1 à 3) | `x-<chapitre>-<num3>` | `x-limites-suites-007` |
| Exercice type bac | `tb-<chapitre>-<num3>` | `tb-limites-suites-002` |
| Carte du mémo | `m-<chapitre>-<slug>` | `m-limites-suites-gendarmes` |
| Question éclair | `fl-<chapitre>-<slug>` | `fl-limites-suites-q-puissance-n` |
| Question dans un exercice | `q<n>[a-z]?` | `q2`, `q3b` |

Ces préfixes ne recouvrent aucun préfixe existant (`f- a- c- e- bb-` maths de première,
`fi- qz- ex- ot- eq- oq-` français, `co- ep- ca- me- s-` bac, `go- gt- gc- gq-` grand oral).
Un identifiant publié **ne change plus** (la progression de l'élève y est accrochée) : on
retire un item, on n'en renomme pas.

Stockage local : `btm-2027-*` (maths de terminale), `bpc-2027-*` (physique-chimie). Jamais
croisés avec `bms-2026-*`, `bfr-2026-*`, `btl-2027-*`, `bgo-2027-*`.

---

## 3. Modèle de données (cahier des charges des schémas)

Tous les textes sont en Markdown + LaTeX KaTeX (`$…$`, `$$…$$`). Champs marqués `?` :
facultatifs.

### 3.1 `programme.json` — une ligne du programme

```json
{ "id": "bo-m-suites-07", "chapitre": "limites-suites", "partie": "Analyse",
  "section": "Suites", "rubrique": "capacite",
  "texte": "Établir la convergence d'une suite croissante et majorée.",
  "premiere": false }
```

`rubrique` ∈ `contenu`, `capacite`, `demonstration`, `algorithme`, `experimentale`,
`numerique`, `mathematique`. `texte` = **texte exact du Bulletin officiel**, jamais
reformulé. `premiere: true` pour les acquis de première mobilisables (physique-chimie).

### 3.2 `annales.json` — un sujet passé

```json
{ "id": "an-2024-metropole-j1", "annee": 2024, "lieu": "Métropole, jour 1",
  "url": "https://…", "programmeEvalue": "complet",
  "exercices": [
    { "numero": 1, "points": 5, "titre": "Suites et fonctions",
      "capacites": ["bo-m-suites-07", "bo-m-recurrence-01"],
      "formulations": ["Démontrer par récurrence que, pour tout entier naturel n, 0 ≤ uₙ ≤ 2."] } ] }
```

`programmeEvalue` ∈ `complet`, `partiel` ; pour `partiel`, champ `exclus: [ids]` relevé
dans la note de service de la session (sert au calcul des fréquences, § 5.1).

### 3.3 `meta.json`

```json
{ "slug": "limites-suites", "matiere": "maths", "titre": "Limites de suites",
  "titreCourt": "Limites de suites", "domaine": "analyse", "ordre": 20,
  "description": "Une phrase.",
  "essentiel": ["Trois idées", "à retenir du chapitre,", "une ligne chacune."] }
```

`domaine` : maths `analyse | geometrie | probabilites | combinatoire` ; physique-chimie
`matiere | mouvement | energie | ondes` (thèmes du programme). `ordre` : multiple de 10,
ordre de l'année.

### 3.4 `notions.json`

```json
{ "id": "n-limites-suites-monotone-bornee", "chapitre": "limites-suites",
  "titre": "Suite croissante et majorée", "ordre": 50,
  "priorite": 3, "priorisation": "annales",
  "pourquoi": "Tombé dans 31 sujets sur 38 depuis 2022.",
  "capacites": ["bo-m-suites-07"],
  "prerequis": ["n-recurrence-suites-recurrence", "1e:suites"],
  "attendusBac": ["Justifier que la suite (uₙ) est convergente."] }
```

`priorite` ∈ 1, 2, 3 (§ 5). `priorisation` ∈ `annales`, `estimation`. `pourquoi` : une
phrase en clair pour l'élève. `prerequis` : identifiants de notions, ou `1e:<slug>` pour un
chapitre de maths de première (lien vers `/premiere/maths/<slug>`). `attendusBac` : 1 à 3
formulations **réelles** relevées dans `annales.json` (vide tant que l'index n'existe pas).

### 3.5 `cours.json`

```json
{ "chapitre": "limites-suites",
  "sections": [ { "notion": "n-limites-suites-monotone-bornee", "blocs": [ … ] } ] }
```

Une section par notion, dans l'ordre des notions. Chaque bloc : `id`, `type`, `titre?`,
`capacites?` et les champs de son type (§ 4.2).

### 3.6 Réponses vérifiables (partagées par « vérifie », exercices, questions éclair)

| `type` | Champs | Contrôle |
|---|---|---|
| `qcm` | `choix` (2-5), `reponse` (index), `pourquoiFaux?` (un message par choix faux, `null` pour le bon) | automatique |
| `qcm-multiple` | `choix`, `reponses` (indices) | automatique |
| `vrai-faux` | `reponse` (booléen), `justification` | automatique |
| `numerique` | `reponse` (nombre ou `"a/b"`), `tolerance` (absolue) ou `toleranceRelative`, `unite?` (**obligatoire en physique-chimie** si la grandeur en a une), `chiffresSignificatifs?` | automatique |
| `ordre` | `elements` (dans le bon ordre ; mélangés à l'affichage) | automatique |
| `redaction` | — (l'élève compare à la solution et se note : réussi, à moitié, raté) | auto-évaluation |

### 3.7 `exercices.json` (marches 1 à 3)

```json
{ "id": "x-limites-suites-007", "chapitre": "limites-suites", "niveau": 2,
  "notions": ["n-limites-suites-monotone-bornee"], "capacites": ["bo-m-suites-07"],
  "titre": "…", "duree": 10, "calculatrice": false, "ordre": 70,
  "preambule?": "…", "figure?": { …figure.schema… }, "source?": "an-2023-…",
  "questions": [
    { "id": "q1", "label": "1.", "enonce": "…",
      "reponse?": { "type": "numerique", … },
      "indices": ["piste", "première étape faite", "presque la solution"],
      "revoir?": "l-limites-suites-014",
      "solution": "…", "erreurFrequente?": "…" } ] }
```

`notions[0]` est la notion principale (celle qui compte pour les quotas en marches 1 et 2).

### 3.8 `type-bac.json`

Comme un exercice, avec `points` (total), `duree`, `calculatrice`, et par question
`points`, `sousQuestions?`, `attenduCorrecteur` (ce qui rapporte les points), sans
`niveau`. `source?` : `{ "annale": "an-…", "adaptation": "données modifiées" }`.

### 3.9 `memo.json` et `flash.json`

Carte du mémo : `id`, `chapitre`, `notion`, `genre` (`definition | propriete | formule |
methode`), `titre`, `enonce`, `conditions?`, `exemple?`, `simplifie` (`coeur`,
`moyenMemo?`, `motCle?` unique dans le chapitre, `image?`) — même esprit que le mode
« simplifié » des formules de première.

Question éclair : `id`, `chapitre`, `notion`, `capacites`, `enonce`, `reponse` (§ 3.6, jamais
`redaction`), `explication` (1 à 3 lignes), `duree` (≤ 60 s).

---

## 4. Le cours

### 4.1 Déroulé d'une section (une notion)

1. `idee` — pourquoi cette notion, l'intuition, une situation ou une question (sans
   formalisme). **Toujours en premier.**
2. `rappel` — seulement si un prérequis est nécessaire tout de suite (lien vers la première
   ou vers une notion antérieure).
3. Le cœur, en alternance : `definition` / `propriete` → `exemple` → (`demonstration`) →
   `methode` → `exemple` ; un `verifie` après chaque idée importante.
4. `piege` — l'erreur que font les élèves, dès qu'elle existe.
5. `retenir` — **toujours en dernier** : 1 à 3 lignes.

### 4.2 Types de blocs

| Type | Contenu | Règles |
|---|---|---|
| `idee` | `texte` | ≤ 80 mots, tutoiement, aucune formule nouvelle non expliquée. |
| `definition` | `titre`, `texte` | Formulation fidèle au programme ; suivie d'un `exemple` dans les deux blocs. |
| `propriete` | `titre`, `texte`, `conditions`, `admise` | Hypothèses listées à part (`conditions`) : l'élève doit savoir **quand** elle s'applique. `admise: true` si le programme ne la démontre pas. |
| `demonstration` | `de` (id de la propriété), `exigible`, `etapes[]` | `exigible: true` seulement si le programme la liste (rubrique `demonstration`, citée dans `capacites`). |
| `exemple` | `titre`, `enonce`, `etapes[]` (`texte`, `pourquoi?`) | Dévoilé étape par étape ; dernière étape = conclusion rédigée comme au bac. |
| `methode` | `titre` (« Comment … ? »), `etapes[]` (3 à 6, impératif), `exemple?` (id) | Une méthode = un geste que le bac demande. |
| `piege` | `faux`, `juste`, `explication` | L'erreur réelle, sa correction, pourquoi. |
| `retenir` | `texte` | ≤ 3 lignes. |
| `rappel` | `texte`, `lien?` | Court ; renvoie à la première plutôt que de tout réécrire (maths). |
| `verifie` | `question` (§ 3.6, pas `redaction`), `explication` | < 1 min ; vérifie le bloc qui précède. |
| `figure` | `figure` (schéma `figure.schema.json`) | `alt` parlant ; SVG sous `public/figures/terminale/…`. |
| `anime` | `widget`, `parametres`, `consigne` | Nom d'un composant React existant (registre des figures animées) ; aucun code dans le JSON. N'utiliser qu'un widget déjà livré. |
| `experience` | `titre`, `protocole`, `observation`, `interpretation` | Physique-chimie : relie le cours à une manipulation du programme. |
| `lien-matiere` | `matiere`, `texte`, `lien?` | « Et en physique ? » / « Et en maths ? » — une ou deux phrases. |

### 4.3 Écrire pour être compris

- **L'idée avant la règle ; l'exemple juste après.** Jamais deux blocs formels de suite
  sans exemple.
- **Aucun mot technique sans explication** : un terme non vu en première ni plus haut dans
  le chapitre s'explique à sa première apparition, en une proposition.
- **Lire les notations** : la première fois, dire comment elle se lit (« se lit : limite de
  uₙ quand n tend vers plus l'infini »).
- **Aucune étape sautée** dans un exemple ou une démonstration : si un calcul intermédiaire
  n'est pas immédiat pour un élève moyen, il est écrit.
- Phrases ≤ 25 mots ; un bloc de texte ≤ 120 mots ; une idée par bloc.
- **Tutoiement** dans `idee`, `methode`, `piege`, `verifie`, indices et messages ; énoncés
  formels (`definition`, `propriete`) à l'impersonnel, au plus près du programme.
- Le cours **n'a pas de phrase d'accroche creuse** (« Dans ce chapitre passionnant… ») : il
  commence par l'idée.

---

## 5. Priorités

### 5.1 Échelle et mesure

| Valeur | Libellé affiché | Repère (part des sujets où la notion pouvait tomber) |
|---|---|---|
| 3 | **Incontournable** | ≥ 50 % |
| 2 | **Fréquent** | 20 à 50 % |
| 1 | **Plus rare** | < 20 % |

- Mesure : `annales.json` × `programme.json` → fréquence par ligne du programme → par notion
  (une notion compte dans un sujet si l'une de ses lignes y est mobilisée). Les sujets
  `partiel` ne comptent pas pour les lignes exclues cette année-là.
- **Correction « prérequis »** : une notion dont dépendent des notions incontournables
  monte d'un cran ; `pourquoi` le dit (« Indispensable pour étudier une fonction »).
- Sans index : `priorisation: "estimation"`, valeurs de `chantiers/terminale/chapitres-*.md`
  (révisables par `tle-architecte` avec justification) ; l'interface affiche « estimé ».

### 5.2 Effets sur le site

- **Affichage** : étiquette sur la notion partout où elle apparaît + `pourquoi`.
- **Ordre** : dans chaque liste d'une marche, d'un mémo ou d'un parcours, priorité
  décroissante puis `ordre`. Le **cours** garde l'ordre logique (on n'apprend pas le
  théorème avant la définition) mais son sommaire montre les étiquettes.
- **Parcours** : « Réviser l'essentiel » (chapitre) et « Réviser pour le bac » (matière) ne
  prennent que les priorités 3 et 2 ; tirage des questions éclair pondéré 3 : 2 : 1.
- **Progression** : la maîtrise d'un chapitre pondère ses notions par leur priorité.

### 5.3 Quotas (planchers par notion ; plafond indicatif = double)

| | ★★★ | ★★ | ★ |
|---|---|---|---|
| Exemples résolus (cours) | 2 | 1 | 1 |
| Blocs « vérifie » (cours) | 2 | 1 | 1 |
| Marche 1 — Comprendre (notion principale) | 4 | 3 | 2 |
| Marche 2 — S'entraîner (notion principale) | 4 | 2 | 1 |
| Marche 3 — Approfondir (notion citée) | 2 | 1 | 0 |
| Questions éclair | 5 | 3 | 2 |
| Cartes du mémo | 1 | 1 | 0 |
| Exercices type bac où la notion est citée | 2 | 1 | 0 |

Par chapitre : 3 à 5 exercices type bac. Chaque démonstration exigible a son bloc
`demonstration` ; chaque ligne `algorithme` ou `numerique` a au moins un exercice.

---

## 6. Les exercices (trois marches)

| Marche | Nom affiché | But | Forme |
|---|---|---|---|
| 1 | **Comprendre** | Vérifier une notion juste après le cours | 1 à 3 questions à réponse vérifiable (pas `redaction`), 1 notion, ≤ 5 min, indice 0 à 1, correction courte, `pourquoiFaux` sur les QCM |
| 2 | **S'entraîner** | Appliquer une méthode du cours | 2 à 5 questions, 1 notion principale, 5 à 15 min, **3 indices progressifs**, solution rédigée ; réponse vérifiable quand le résultat final est une valeur, sinon `redaction` |
| 3 | **Approfondir** | Combiner, raisonner, prendre une initiative | 3 à 6 questions, ≥ 2 notions, 15 à 30 min, 2-3 indices, solution rédigée |

- **Indices** : 1 = la piste (quelle notion, quelle méthode — avec `revoir` vers le bloc de
  cours) ; 2 = la première étape faite ; 3 = presque la solution. Trois indices
  différents, jamais trois reformulations.
- **Solution** : rédigée comme au bac (« or », « donc », théorème nommé et hypothèses
  vérifiées), dernière ligne = la réponse. `erreurFrequente` quand une erreur typique existe.
- **Calculatrice** : `calculatrice: true` si elle sert vraiment ; sinon les valeurs restent
  calculables à la main. Les arrondis demandés sont précisés (« à 10⁻³ près »).
- **Énoncé autonome** : toutes les données sont dans l'énoncé ; aucune référence à « la
  figure ci-dessus » sans figure.
- **Ordre dans une marche** : priorité décroissante, puis difficulté croissante.

---

## 7. Type bac

- Suit **le format de l'épreuve** relevé dans le référentiel (durée, points, structure,
  calculatrice). Un exercice type bac = un exercice d'épreuve (maths : ≈ 5 points ;
  physique-chimie : 4 à 10 points avec documents).
- Questions enchaînées mais **rattrapables** : résultats intermédiaires donnés (« On admet
  que… ») pour qu'un blocage n'arrête pas l'exercice.
- `attenduCorrecteur` pour chaque question : les éléments qui rapportent les points.
- Mélange volontaire des notions du chapitre (et des chapitres précédents).
- Adapté d'un vrai sujet : `source` obligatoire ; **les corrigés publiés par des tiers ne
  sont jamais recopiés** — la solution est écrite ici.
- Physique-chimie : documents fournis (texte, graphe décrit ou SVG, tableau), données en
  tête, au moins une question de résolution de problème par chapitre (marche 3 ou type bac).

---

## 8. Mémo et questions éclair

- **Mémo** : cartes rangées par priorité ; `coeur` = la formule ou la règle nue ;
  `motCle` unique dans le chapitre. Pas de carte pour une notion `★` sauf formule à
  connaître par cœur.
- **Questions éclair** : un fait, un réflexe, < 60 s ; distracteurs = erreurs typiques ;
  `explication` qui enseigne quelque chose. Elles nourrissent la répétition espacée.

---

## 9. Programme et couverture

- Chaque ligne de `programme.json` d'un chapitre appartient à **exactement une** notion.
- Tout `capacites` cite des identifiants existants ; un item ne cite que les lignes de ses
  notions, des chapitres précédents dans l'ordre, ou des acquis de première.
- **Interdit** : toute notion absente du programme de la matière (liste « hors programme »
  du référentiel : options, programme futur, supérieur). En maths : rien des maths
  expertes (complexes, arithmétique, matrices, graphes) ni des maths complémentaires hors
  tronc commun.
- Contrôle automatique : `scripts/couverture-terminale.mjs [matiere] [chapitre]` (écrit par
  l'item « mécanique ») — identifiants inconnus, lignes non couvertes, quotas, doublons.
  Un chapitre est **fini** quand son rapport est vide.

---

## 10. Style et notations

- Français courant, sans anglicisme ; décimales avec virgule : `0{,}5` en LaTeX.
- Intervalles à la française : `[a\,;\,b]`, `]0\,;\,+\infty[` ; loi binomiale
  `\mathcal{B}(n\,;\,p)`.
- Maths : `u_n`, `(u_n)`, `\lim\limits_{n \to +\infty} u_n`, `f'`, `f''`, `\ln`, `e^x`,
  `\int_a^b f(x)\,\mathrm{d}x`, `\vec{u}` et `\overrightarrow{AB}`, `\binom{n}{k}`, `P_A(B)`.
- Physique-chimie : grandeurs en italique LaTeX, unités droites (`\text{m·s}^{-1}` ou
  `\mathrm{m\,s^{-1}}`, un seul style par chapitre), puissances de dix, chiffres
  significatifs cohérents, notations du programme (`[\mathrm{H_3O^+}]`, `\mathrm{p}K_\mathrm{a}`).
- KaTeX seulement : ni `\newcommand`, ni `\require`, ni `\def` ; `aligned` pour les calculs
  sur plusieurs lignes.
- Textes d'interface : la règle du site s'applique (pas d'année, pas d'élève, pas de phrase
  d'accroche) ; typographie via `typographie()` si le chargeur l'emploie.

---

## 11. Les pages (règles d'interface)

- **Mêmes composants pour toutes les matières** de terminale, paramétrés par la matière
  (accent `blue` maths, `violet` physique-chimie, lus dans `SPACES`).
- Onglets du chapitre, dans cet ordre : **Aperçu · Cours · Exercices · Type bac · Mémo**
  (`SectionTabs`).
- **Cours** sur le gabarit `PageLongue` (sommaire à droite dès `xl`, section numérotée par
  notion, étiquette de priorité dans le titre). Rien de replié, **sauf** : réponses des
  `verifie`, étapes des `exemple` (bouton « tout afficher »), démonstrations non exigibles
  (titre visible). À confirmer avec Thibaud sur le chapitre pilote.
- **Étiquette de priorité** : un seul composant, trois niveaux, lisible sans la couleur
  (texte + ★), mention « estimé » si `priorisation: "estimation"`.
- **Progression par notion** : à découvrir → découverte (tous les `verifie` répondus) →
  comprise (≥ 75 % des marches 1 réussies) → maîtrisée (+ marches 2 et 3 / type bac réussis,
  questions éclair ≥ 80 %). Seuils réglables, logique pure testée.
- Couleurs par les variables de thème (jamais de gris en dur) ; ordinateur d'abord, lisible
  à 360 px ; une formule trop large défile dans son propre cadre, pas la page.
- Les runners de première (`ExerciseRunner`, `HintSystem`, `ExamRunner`, `Timer`,
  `FormulaCard`, `SimplifiedFormulaCard`, `QcmRunner`, `FigureRenderer`) sont réutilisés
  par adaptateurs ; **leurs schémas et leur comportement en première ne changent pas**.

---

## 12. Circuit de production d'un chapitre

Procédure détaillée : `.claude/commands/tle-chapitre.md`.

1. `tle-architecte` → `meta.json`, `notions.json` (toutes les lignes du chapitre réparties).
2. `tle-auteur-cours` → `cours.json`, `memo.json`.
3. `tle-auteur-exercices` → `exercices.json`, `flash.json` (après le cours).
4. `tle-auteur-bac` → `type-bac.json` (après le cours).
5. `tle-relecteur` sur chaque fichier → PASS obligatoire (3 tours de correction au plus,
   puis question à Thibaud).
6. `tle-eleve-testeur` sur le cours et un échantillon d'exercices → points bloquants
   corrigés (étape sautée, mot non expliqué, énoncé ambigu).
7. `node scripts/verify.mjs` + `scripts/couverture-terminale.mjs` → OK, rapport vide.
8. Captures relues (cours, une marche, un type bac ; clair et sombre ; ordinateur et
   téléphone).
9. `BACKLOG.md` mis à jour ; PR avec le résumé des rapports.

Les agents n'écrivent que leurs fichiers ; seul l'orchestrateur (la session) lance les
scripts, commite et ouvre la PR.

---

## 13. Anti-patterns

- ❌ Écrire du contenu sans référentiel de la matière, ou citer une ligne du programme de
  mémoire.
- ❌ Une définition sans exemple ; un théorème sans ses hypothèses ; un exemple qui saute
  une étape.
- ❌ Un exercice de marche 1 ou 2 qui demande une notion non encore vue dans le cours.
- ❌ Trois indices qui disent la même chose ; une solution d'une ligne.
- ❌ Une réponse numérique de physique sans unité ; des chiffres significatifs fantaisistes.
- ❌ Une priorité sans `pourquoi` ; une estimation présentée comme une mesure.
- ❌ Des formulations « du bac » inventées dans `attendusBac` (elles viennent des annales).
- ❌ Recopier un corrigé publié par un tiers.
- ❌ Du texte pédagogique dans un composant ; un widget animé écrit dans le JSON.
- ❌ Modifier un schéma, un composant ou un contenu de première pour la terminale.
