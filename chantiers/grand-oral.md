# Grand oral — remplir les cinq pages de `/terminale/grand-oral`

> **Livré le 2026-09-22** (voir `BACKLOG.md`). Ce prompt est gardé pour mémoire ; la suite
> (relecture sur le texte intégral du BO) est un item distinct du backlog.

> À lancer dans une session **Cloud** sur `Thibaud888/bac-maths-1ere-spe-2026`.
> Prérequis : aucun. Les cinq pages existent déjà (gabarits vides), les routes et les onglets
> sont en place, et `content/bac/` porte déjà la ligne officielle du grand oral.

## Prompt de handoff (coller tel quel)

Contexte : repo `Thibaud888/bac-maths-1ere-spe-2026` (site de révision bac, première +
terminale). L'espace **Grand oral** existe : cinq pages routées sous
`/terminale/grand-oral/{epreuve,questions,preparation,entretien,oral-blanc}`, coiffées par
`GrandOralLayout` + `SectionTabs`, listées dans `GRAND_ORAL_SECTIONS` (`src/lib/spaces.ts`).
Les cinq affichent encore le gabarit vide `EmptyState` : leurs `planned[]` disent déjà ce
qu'on attend de chacune — lis-les, c'est le cahier des charges.
Les deux sessions précédentes ont livré `/le-bac` (PR #72) et `/simulateur` (PR #73) : elles
ont posé le motif à suivre — contenu en JSON sous `content/`, schéma Ajv dans `schemas/`,
chargeur validé dans `src/lib/`, aucun chiffre en dur dans un composant.

Objectif de cette session : les cinq pages du grand oral ne sont plus des gabarits vides.

Fais, dans l'ordre :

1. Lis `MAP.md` puis `CLAUDE.md`. Ouvre les cinq `EmptyState` sous
   `src/routes/terminale/grand-oral/` : leurs `planned[]` et `footnote` sont le contenu attendu.

2. **Trois natures de contenu, à ne pas mélanger** — c'est la décision structurante :
   - **Réglementaire** (page « L'épreuve ») : déroulé, jury, grille, coefficient. Ça se rattache
     à un texte officiel, exactement comme `content/bac/`. Le grand oral y est déjà :
     `ep-grand-oral` dans `content/bac/epreuves.json` (coefficient 8 via `co-grand-oral`,
     « 20 min, après 20 min de préparation », « entre le 21 juin et le 2 juillet 2027 ») et la
     source `s-grand-oral` (Bulletin officiel). **Reprends ces données, ne les recopie pas** :
     lis-les par `src/lib/bac-content.ts`, comme le fait `/le-bac`.
     ⚠️ Le format du grand oral a changé plusieurs fois (3 temps → 2 temps ; coefficient 10 → 8
     en 2027). Va relire le BO derrière `s-grand-oral` avant d'écrire la moindre minute ou le
     moindre point de barème — rien de mémoire.
   - **Méthodologique** (pages « Préparation » et « Entretien ») : comment construire une
     question, bâtir un exposé de 10 minutes, tenir l'échange, relancer. C'est du contenu
     pédagogique.
   - **Personnel** (page « Mes 2 questions ») : dépend des questions réellement choisies par
     l'élève, adossées à ses spécialités (maths et physique-chimie). **Ne les invente pas.**
     Si elles ne sont pas connues, livre la page comme un cadre à remplir (formulation, plan,
     sources, « pourquoi cette question ») et dis-le à Thibaud, plutôt que de meubler.

3. **Une question à poser à Thibaud, une seule, au format § 0 de `CLAUDE.md`** : le contenu
   méthodologique du grand oral est pédagogique, mais aucun référentiel n'existe pour lui — les
   deux skills en place (`bac-maths-premiere-spe-2026`, `bac-francais-premiere-2026`) ne le
   couvrent pas, et les sub-agents `chapter-author` / `french-content-author` y sont adossés.
   Propose-lui le choix entre écrire d'abord un skill « grand oral session 2027 » (plus lent,
   mais le contenu est alors vérifié comme le reste du site) et traiter ces pages comme
   `content/bac/` (validation Ajv + source officielle sur chaque affirmation réglementaire,
   sans les deux passes). Recommande la seconde pour cette session, la première si le contenu
   méthodologique prend de l'ampleur. Attends sa réponse avant d'écrire du contenu pédagogique.

4. **Le modèle à copier existe : l'oral de français.** `content/francais/oral/` porte déjà
   `epreuve.json` et `methode.json` (des `OralFiche[]`, Markdown enrichi, validés par
   `schemas/francais/oral-fiche.schema.json` et chargés par
   `src/francais/lib/french-content-loader.ts`). Le grand oral appelle la même forme. Décide et
   dis clairement si tu réutilises ces schémas et ce chargeur, ou si tu en crées des jumeaux
   sous `content/terminale/grand-oral/` + `schemas/grand-oral/` — mais ne duplique pas un schéma
   sans le dire.

5. **Oral blanc** : `src/francais/components/oral/` contient déjà `OralSimulator`,
   `AdjustableTimer`, `RevealPanel` et `EntretienQuestionList`. L'oral blanc du grand oral est
   le même besoin avec d'autres durées (10 min d'exposé + 10 min d'échange). Choisis entre
   remonter ces composants dans `src/components/` pour les partager et en écrire une version
   propre au grand oral ; explique ton choix. Ne casse aucune route française au passage.

6. **Persistance** : préfixe LocalStorage à choisir pour le grand oral (propose `bgo-2027-`).
   Ne touche jamais `bms-2026-*` (maths), `bfr-2026-*` (français) ni `btl-2027-*` (simulateur).
   Vérifie-le dans un navigateur, comme l'a fait la session du simulateur.

7. **Vérifie** : `node scripts/verify.mjs` doit passer. Score de référence : **121 tests**
   depuis la PR #73. Ajoute des tests là où une erreur ne se verrait pas (chargement et
   validation du nouveau contenu, minuteur de l'oral blanc). Regarde aussi le rendu réel dans
   un navigateur (Chromium est préinstallé : `/opt/pw-browsers/chromium`) en clair, en sombre
   et en largeur téléphone.

Si le budget de la session ne permet pas les cinq pages, **coupe après l'étape 5** : livre
« L'épreuve », « Préparation » et « Entretien » (le générique et le réglementaire), laisse
« Mes 2 questions » et « Oral blanc » à une session suivante, et dis-le explicitement dans le
corps de la PR et dans `BACKLOG.md`.

Contraintes : réponses et commits en français ; branche + PR, jamais de push direct sur `main` ;
aucune dépendance NPM nouvelle sans accord ; aucune date ni aucun barème inventé (règle
`content/bac/` : tant que ce n'est pas publié, on écrit la période, jamais le jour) ; corps de
PR avec une section `## Vérification`.
Definition of done : les pages traitées ne montrent plus `EmptyState`, chaque affirmation
réglementaire cite sa source officielle, `node scripts/verify.mjs` OK.
Termine en mettant à jour le `BACKLOG.md` (statut + lien PR).

## Notes pour plus tard (hors périmètre)

- Le compte à rebours des épreuves (item de `BACKLOG.md`) pourra s'appuyer sur la date du grand
  oral une fois le calendrier 2027 complété.
- Les pages de terminale maths et physique-chimie restent des gabarits vides : leur découpage en
  chapitres est un item distinct, à ne pas entamer ici.
