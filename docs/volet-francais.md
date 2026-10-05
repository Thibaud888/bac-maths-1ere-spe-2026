# Volet Français — EAF (première)

> Sorti de `CLAUDE.md` le 2026-10-05 (§ 13, numérotation gardée) pour alléger ce que chaque
> session et chaque agent chargent à chaque pas. **À lire avant tout travail sur le
> français** (`/premiere/francais`, `content/francais/`, `src/francais/`, agents
> `french-content-author` et `french-reviewer`, commandes `/new-module-francais` et
> `/verify-francais`). Les règles restent celles d'avant : seul l'endroit change.

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
  components/layout/  (FrenchModuleLayout — le cadre et la barre latérale sont communs)
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

Route : `/premiere/francais/*` (dans `src/App.tsx`), dont l'oral **par élève** :
`/premiere/francais/oral` (sélecteur d'élève) puis `/premiere/francais/oral/:eleve/*`
(descriptif de l'élève). Les anciennes adresses `/francais/*` redirigent vers celles-ci.

Depuis la réorganisation de la navigation, le français n'a plus de cadre ni de barre latérale
propres : il partage `AppLayout` et `MainSidebar` avec le reste du site. Seul l'espace oral d'un
élève garde une barre dédiée (`src/francais/components/oral/OralStudentSidebar.tsx`).

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
3. `npm run test` — 77 tests passent (score de référence).
4. Routes maths (`/premiere/maths/*`, dont `/premiere/maths/bac-blanc`) inchangées, et les
   anciennes (`/chapitre/*`, `/bac-blanc`) toujours redirigées.
5. LocalStorage maths `bms-2026-app` / `bms-2026-progress` **intactes**.
