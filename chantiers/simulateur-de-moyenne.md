# Simulateur de moyenne — porter l'outil du dépôt `notes-bac-visualisateur` dans `/simulateur`

> À lancer dans une session **Cloud** sur `Thibaud888/bac-maths-1ere-spe-2026`.
> Prérequis : la PR #72 (« Le bac, mode d'emploi ») doit être mergée — elle apporte
> `content/bac/coefficients.json`, sur lequel ce chantier s'appuie.

## Prompt de handoff (coller tel quel)

Contexte : repo `Thibaud888/bac-maths-1ere-spe-2026` (site de révision bac, première +
terminale). La page `/simulateur` existe mais affiche encore le gabarit vide `EmptyState`.
L'outil, lui, existe déjà en entier dans un autre dépôt : `Thibaud888/notes-bac-visualisateur`
(page statique HTML/CSS/JS purs, zéro dépendance, ~590 lignes d'`app.js`, déployée sur
GitHub Pages). La session précédente a rempli `/le-bac` (PR #72) et, ce faisant, a créé
`content/bac/coefficients.json` : **la source unique des 104 coefficients du site**, validée
par `schemas/bac/` et lue par `src/lib/bac-content.ts`. Thibaud a tranché : le simulateur est
**refait en React dans le site**, branché sur ce fichier — pas d'insertion de la page telle
quelle, pas de second barème à maintenir.

Objectif de cette session : `/simulateur` utilisable depuis le menu.

Fais, dans l'ordre :
1. Lis `MAP.md` puis `CLAUDE.md` (dont le § 4.2 sur `content/bac/`, écrit pour ce chantier).
2. Récupère l'outil existant : `GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1
   https://github.com/Thibaud888/notes-bac-visualisateur /home/user/thibaud888/notes-bac-visualisateur`
   puis lis son `MAP.md`, son `CLAUDE.md` et `app.js`. Tout le moteur tient dans `app.js` :
   `SUBJECTS` (matières + coefficients), `average()`, `mentionFor()`, `nextStep()`,
   l'état persisté (`state`, `migrate()`, clé `bac2027.simulateur`), les rendus SVG faits main
   (`renderDonut` / `renderTreemap` / `renderRadar`) et le partage par lien (`encodeState`).
3. Branche les coefficients sur `content/bac/coefficients.json` au lieu de redéfinir `SUBJECTS`.
   Le champ `repartition` porte déjà le découpage première / terminale dont l'ancien outil avait
   besoin pour figer la moitié déjà connue (il le codait en dur : `hg_1` / `hg_2`, etc.) : les
   deux lignes d'une matière de contrôle continu s'en déduisent. Si un attribut manque côté
   simulateur (couleur, domaine, type d'évaluation), ajoute-le au schéma
   `schemas/bac/coefficient.schema.json` plutôt que de le remettre en dur dans un composant.
4. Porte l'interface en React + Tailwind, au style du site : un curseur et un cadenas par
   matière, moyenne et mention recalculées à chaque changement, répartition visuelle, les
   leviers les plus rentables. Décide ce qui vaut la peine d'être porté dès la v1 et ce qui
   attend — l'ancien outil a quatre vues (camembert, barres, treemap, radar), ce n'est pas
   forcément tout à reprendre d'un coup. Dis clairement ce que tu laisses de côté.
5. Persistance : préfixe `btl-2027-*` en LocalStorage. **Ne touche jamais** aux clés `bms-2026-*`
   (maths) ni `bfr-2026-*` (français).
6. Les notes de départ : l'ancien `app.js` contient un objet `DEFAULT_NOTES` présenté comme
   « valeurs réelles connues à ce jour », mais certaines ressemblent à des valeurs d'attente.
   **Demande à Thibaud** (une seule question, format § 0 de `CLAUDE.md`) ce qu'il veut :
   reprendre ces notes, repartir de 10 partout, ou ne rien pré-remplir.
7. Vérifie : `node scripts/verify.mjs` doit passer (88 tests de référence depuis la PR #72).
   Ajoute des tests sur le calcul de la moyenne et le choix de la mention — ce sont les deux
   endroits où une erreur ne se verrait pas.

Contraintes : réponses et commits en français ; branche + PR, jamais de push direct sur `main` ;
zéro dépendance nouvelle sans accord (pas de bibliothèque de graphiques : l'ancien outil fait ses
SVG à la main, garde ce principe) ; corps de PR avec une section `## Vérification`.
Definition of done : `/simulateur` utilisable depuis le menu, les coefficients viennent de
`content/bac/coefficients.json` et de nulle part ailleurs, `node scripts/verify.mjs` OK.
Termine en mettant à jour le `BACKLOG.md` (statut + lien PR).

## Notes pour plus tard (hors périmètre de cette session)

- Le dépôt `notes-bac-visualisateur` reste en ligne et fonctionnel. Une fois le portage fait,
  demander à Thibaud s'il veut l'archiver ou le garder comme version autonome hors-ligne.
- L'ancien outil sait partager un état par lien (`#s=<base64>`) et imprimer en PDF. À reprendre
  dans une session ultérieure si Thibaud en a l'usage.
