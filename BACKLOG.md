# Backlog

> 1 item = 1 session Claude (issue labellisée `claude` ou session Cloud) = 1 PR.
> Cocher + lien PR quand c'est mergé. `/dispatch` (claude-ops) lit ce fichier.
> Réserve détaillée : `.claude/figures-courbes-roadmap.md` (figures/lecture graphique par chapitre).

- [x] Exercices de lecture graphique dérivation `c-derivation-013` + `c-derivation-014` — specs
  complètes dans `.claude/figures-courbes-roadmap.md` §1 (parabole avec tangente, cubique) ;
  workflow 2 passes obligatoire (chapter-author → pedagogical-reviewer). DoD :
  `node scripts/verify.mjs` passe (validation contenu incluse).
  Déjà livré par la PR #16 (2026-05-12, `feat(derivation): exercices de lecture graphique`) ;
  contenu conforme aux specs vérifié en session #57, `node scripts/verify.mjs` OK. PR : #58.
- [x] Automatismes de lecture graphique dérivation (3 items : signe de f', intervalle de
  décroissance, f(x) ≥ g(x)) — specs dans le roadmap §1. DoD : verify passe, 2 passes respectées. ⚠️ Recadré le 2026-07-17 : « signe de f' » et « intervalle de décroissance » existent déjà (2 derniers items de `content/chapters/derivation/automatisms.json` + figures) — ne reste que l'automatisme f(x) ≥ g(x) (lecture graphique de comparaison) et sa figure.
  Livré par la PR #60 (2026-07-19) : `a-deriv-graph-comparaison-fg` + figure
  `public/figures/derivation/comparaison-courbes-fg.svg` (parabole $f(x)=x^2-x-1$ vs droite
  $g(x)=1$), workflow 2 passes respecté (PASS pedagogical-reviewer).

## Terminale, outils et mode d'emploi (ouvert le 2026-09-22)

- [x] Réorganiser le site pour accueillir la terminale — une seule barre de navigation groupée
  par année (première et terminale au même rang), repliable ; adresses `/terminale/*`,
  `/premiere/*`, `/simulateur`, `/le-bac` avec redirection des anciennes ; pages de terminale et
  d'outils créées à vide. Registre des espaces dans `src/lib/spaces.ts`.
  DoD : `node scripts/verify.mjs` OK, 77 tests. Session du 2026-09-22.
- [x] Remettre le site en ligne — la publication automatique échouait depuis juillet :
  `npm ci` refusait de s'installer, `package-lock.json` étant incomplet (paquet `esbuild` et ses
  binaires par plateforme absents du verrou). Lock régénéré (ajouts seuls, aucune version
  changée) ; les étapes du workflow rejouées à l'identique en local passent.
  DoD : run « Deploy to GitHub Pages » vert sur `main`. Session du 2026-09-22.
- [ ] Valider aussi le contenu français à la publication — le workflow `deploy.yml` lance
  `validate-content.mjs` mais pas `validate-francais.mjs` : un contenu français invalide
  passerait en ligne. DoD : étape ajoutée au workflow, run vert.
- [x] Remplir la page « Le bac, mode d'emploi » — ce qui compte et combien : épreuves, contrôle
  continu, coefficients, calendrier, mentions, options. Chaque chiffre rattaché à sa source
  officielle (education.gouv.fr, éduscol) ; le tableau des coefficients du dépôt
  `notes-bac-visualisateur` sert de point de départ (déjà vérifié).
  DoD : page `/le-bac` complète, sources citées, `node scripts/verify.mjs` OK.
  Livré le 2026-09-22 : contenu en JSON sous `content/bac/` (coefficients, épreuves,
  calendrier, mentions, sources), schémas `schemas/bac/`, chargeur `src/lib/bac-content.ts`.
  `coefficients.json` est la source unique des 104 coefficients — le simulateur la lira.
  Calendrier 2027 pris au BO spécial n° 2 du 25 août 2026 ; aucune date non publiée inventée
  (la partie pratique de physique-chimie reste en « printemps 2027 »). Profil confirmé avec
  Thibaud : musique suivie en terminale seulement, d'où un total de 104 et non 106.
  `node scripts/verify.mjs` OK, 88 tests (77 de référence + 11 nouveaux). PR : #72.
- [x] Reprendre le simulateur de moyenne dans le site — l'outil existait dans le dépôt
  `notes-bac-visualisateur` (HTML/CSS/JS purs, ~600 lignes, zéro dépendance) ; refait en React
  dans `/simulateur` plutôt qu'intégré tel quel.
  Livré le 2026-09-22 : moteur testé `src/lib/simulateur.ts` (découpe `coefficients.json` en
  21 notes réglables — une par épreuve, une par année pour le contrôle continu), store
  `btl-2027-simulateur`, écran avec curseurs + cadenas, camembert SVG fait main et leviers.
  Aucun coefficient en dur : le seul attribut qui manquait (`domaine`) a été ajouté au schéma
  `schemas/bac/coefficient.schema.json`. Laissés de côté pour l'instant : treemap, radar,
  partage par lien `#s=`, impression PDF (voir `chantiers/simulateur-de-moyenne.md`).
  `node scripts/verify.mjs` OK, 121 tests (88 de référence + 33 nouveaux). PR : #73.
- [ ] Compléter le simulateur de moyenne — ce que la v1 n'a pas repris de l'ancien outil :
  partager une simulation par lien (`#s=<base64>`), l'imprimer en PDF, et deux autres façons de
  voir la même répartition (treemap par matière, radar par domaine). À faire seulement si
  Thibaud en a l'usage — lui demander avant d'ouvrir le chantier.
  DoD : fonctions choisies livrées, `node scripts/verify.mjs` OK.
- [x] Rendre le site général et intégrer les retours de relecture du 2026-09-23 — l'onglet
  porte le nom de la page ouverte, plus d'année ni d'élève dans les textes, phrases d'accroche
  inutiles retirées, un seul bouton pour replier le menu, mentions en version courte, camembert
  du simulateur toujours visible, notes figées grisées.
  Détail : `SITE_NAME` + `pageTitle()` dans `src/lib/spaces.ts` (titre d'onglet tiré du fil
  d'Ariane) ; années retirées de `YEARS` ; badges « Session 2027 » retirés ; « Pour lui… » →
  « Exemple : … » dans `coefficients.json`, pastille « ton cas » → « selon le profil » ; le
  bouton « Menu » du bandeau n'apparaît que barre repliée ; `<main>` ne défile plus lui-même
  (la fenêtre défile, d'où le `sticky` du simulateur) ; simulateur en deux colonnes à partir
  de `xl` (camembert collant), bandeau réduit collant en dessous ; lignes partagées nommées
  « — moyenne de première / de terminale » (`nomLigne`). Mentions : échelle d'une ligne,
  placée après les options, tirée de `mentions.json`. Déploiement : le chemin du site suit le
  nom du dépôt. `node scripts/verify.mjs` OK, 155 tests (152 + 3). PR : #77.
- [x] Deuxième relecture du 2026-09-23 : alléger « Le bac » et le grand oral, régler le
  simulateur — « Le bac » sans les chiffres d'ouverture ni « La note finale » ; vrai sommaire
  numéroté (aussi sur le grand oral) ; simulateur en deux moitiés avec séparation à glisser,
  sans la liste par domaine, détail d'une part affiché dès le survol ; grand oral sans phrases
  d'accroche, bloc « Quand / Combien » réduit, sources numérotées en bas de page, « Conseil
  pratique » au lieu de « Conseil — pas une règle » ; changer de page ramène en haut.
  Détail : `components/shared/Sommaire.tsx` et `Sources.tsx` (`SourcesNumerotees`, `Refs`,
  `ListeSources`, partagés par `/le-bac` et le grand oral ; `SourcesCitees` supprimé) ;
  `largeurPanneau` (30–70 %, 50 par défaut) dans `btl-2027-simulateur` ; bulle de survol
  dessinée dans `Repartition.tsx` au lieu du `<title>` SVG (délai du navigateur) ;
  `window.scrollTo(0, 0)` au changement de `pathname` dans `AppLayout`.
  `node scripts/verify.mjs` OK, 159 tests (155 + 4). PR : #78.
- [x] Troisième relecture du 2026-09-23 : réordonner « Le bac » et épurer « L'épreuve » du grand
  oral — « Les options » juste après le contrôle continu ; sur « L'épreuve », case du
  coefficient retirée, « préparation » avant « face au jury », plus d'appels [n] dans le corps
  (liste des sources gardée en bas).
  Détail : prop `appels` de `FicheGrandOral` (vrai par défaut, faux sur « L'épreuve ») ;
  `DerouleFrise` sans appels. `node scripts/verify.mjs` OK, 159 tests. PR : #79.
- [x] Quatrième relecture du 2026-09-24 : alléger encore le grand oral et « Le bac » — plus de
  renvois [1] dans les titres et le texte des pages « Préparation », « Exposé » et
  « Entretien » (la source reste en bas de page) ; « Le bac » sans le bloc « La spécialité
  arrêtée pèse lourd ».
  Détail : `appels={false}` sur `FicheGrandOral` dans les trois pages, `Refs` retiré de
  `TempsOfficiel` (`ExposePage`). `node scripts/verify.mjs` OK.
- [x] Rendre « Le bac » et le grand oral plus lisibles, surtout sur ordinateur — l'essentiel
  en tête de chaque page, sommaire à droite qui suit la lecture, doublons retirés, mots
  techniques expliqués, apostrophes harmonisées ; aucun fait modifié.
  Détail : gabarit `components/shared/PageLongue.tsx` (sommaire collé à droite dès `xl`,
  section en cours surlignée) et `Essentiel.tsx` ; « Le bac » : « L'essentiel » réduit à la
  barre des 104 coefficients (une case par matière, bulle au survol ou au toucher qui nomme
  la matière — retour de Thibaud du 2026-09-23), épreuves en grille, tableaux première / terminale avec total, section
  « Les coefficients » retirée (elle recopiait les tableaux), calendrier en frise par phase,
  échelle des mentions proportionnelle de 0 à 20 ; grand oral : barre du temps
  (`BarreDuTemps.tsx`, lue dans `deroule.json`), déroulé avec les minutes en regard, fiches
  « texte officiel » et « conseil pratique » côte à côte, relances en deux colonnes, les deux
  questions côte à côte. `lib/typographie.ts` à l'affichage (JSON inchangé sur ce point) ;
  sept explications de mots ajoutées dans le JSON (académie, second groupe, descriptif,
  aménagement, adossées, professeur-documentaliste, note de service) et le renvoi cassé
  « voir plus haut » réparé. Garde-fou `scripts/faits-inchanges.mjs` : « Aucun fait modifié »
  sur 97 entrées. Les 7 faits signalés faux par la vérification (PR #76) sont laissés tels
  quels : leur correction est prévue par les items que cette PR ajoute au backlog.
  `node scripts/verify.mjs` OK, 165 tests (159 + 6). PR : #80.
- [x] Ajouter la page « Exposé » au grand oral, entre la préparation et l'entretien — les
  règles de ces minutes face au jury, puis comment les tenir : la première minute, garder le
  fil, tenir le temps, trou de mémoire et trac, conclure et passer à l'échange.
  Détail : `content/terminale/grand-oral/expose.json` (6 fiches `go-exp-*` : une
  réglementaire sourcée, `go-exp-salle` — support non évalué, de quoi écrire, tableau, aucun
  autre matériel —, cinq de méthode) ; section `expose` ajoutée au schéma `fiche`, aux types,
  au chargeur et à `validate-content.mjs` ; page `ExposePage.tsx` sur le gabarit `PageLongue`
  (durée et règles de l'exposé relues dans `deroule.json`, jamais recopiées) ; onglet dans
  `GRAND_ORAL_SECTIONS` ; un lien vers la fiche d'un autre onglet descend jusqu'à elle
  (`AppLayout`). Règles vérifiées sur les extraits du texte officiel relevés par la
  vérification (#76) : education.gouv.fr est bloqué par le réseau de cette session.
  `node scripts/verify.mjs` OK, 169 tests (165 + 4). PR : #81.
- [x] Choisir l'apparence du site parmi cinq thèmes — en plus de clair et sombre : « Papier »
  (crème, encre brune, police de livre), « Tableau » (vert tableau d'école, texte couleur craie)
  et « Lavande » (pastel, formes arrondies). Le bouton du bandeau ouvre la liste (nom et vignette de
  chaque thème, sans description — retour de Thibaud) ; le choix est gardé d'une visite à l'autre.
  Détail : registre `src/lib/themes.ts` ; gris `slate-*`, `white`, `font-sans` et arrondis
  `rounded-*` lus dans des variables CSS (`tailwind.config.js`), redéfinies par thème dans
  `src/index.css` — aucun composant retouché ; les thèmes sombres posent aussi la classe
  `dark`. `ThemePicker.tsx` remplace le bouton soleil/lune ; `setTheme` remplace `toggleTheme`
  (valeurs `light`/`dark` déjà enregistrées dans `bms-2026-app` inchangées) ; thème posé avant
  le premier rendu (`main.tsx`) ; `color-scheme: dark` pour les contrôles natifs en sombre.
  Relu en captures (accueil, le bac, simulateur, formulaire, exercices, bac blanc, grand oral,
  fiches de français, sélecteur sur ordinateur et téléphone).
  `node scripts/verify.mjs` OK, 177 tests (169 + 8). PR : #83.
- [ ] Laisser les sessions ouvrir le site du ministère — le 2026-09-23, le réseau de la session
  a refusé `www.education.gouv.fr` (proxy : CONNECT refusé, politique de l'environnement) ;
  la page « Exposé » a dû être vérifiée sur les extraits relevés par la vérification (#76).
  À faire par Thibaud : ajouter `www.education.gouv.fr` (et, pour les mêmes raisons,
  `eduscol.education.gouv.fr`, `www.legifrance.gouv.fr`) aux domaines autorisés de
  l'environnement cloud (menu de l'environnement dans la barre de titre → Edit → accès
  réseau). DoD : une session ouvre `https://www.education.gouv.fr/bo/2026/Special4/MENE2622694N`.
- [ ] Décider s'il faut un référentiel du grand oral avant d'ajouter d'autres conseils —
  CLAUDE.md § 4.3 : si le contenu « méthode » du grand oral prend de l'ampleur, écrire d'abord
  un skill « grand oral » et repasser au workflow 2 passes. Depuis #81, trois pages de méthode
  (préparation, exposé, entretien). À trancher par Thibaud. DoD : décision notée dans
  CLAUDE.md § 4.3 (skill écrit, ou statu quo confirmé).
- [ ] Donner au dépôt un nom général (proposé : « revisions-bac ») — à faire par Thibaud dans
  GitHub (Settings → General → Repository name) : l'outil de session ne sait pas renommer un
  dépôt. La mise en ligne suit le nouveau nom seule (`deploy.yml` lit le nom du dépôt), mais
  l'adresse du site change (`…github.io/revisions-bac/`) et les anciens favoris ne suivent pas.
  Ensuite : remplacer l'ancien nom dans README, MAP, CLAUDE, `package.json`,
  `playwright.config.ts`. DoD : site en ligne à la nouvelle adresse.
- [ ] Découper le programme de maths de terminale en chapitres — la liste des chapitres et leur
  ordre, avant toute écriture de contenu ; crée `content/terminale/maths/<slug>/` et alimente
  `sections()` de l'espace `tle-maths`. Nécessite un skill « programme de terminale » sur le
  modèle de celui de première.
  DoD : chapitres visibles dans le menu, schémas de contenu prêts.
- [ ] Découper le programme de physique-chimie en chapitres — même travail, avec ses quatre modes
  (formulaire, méthodes, exercices, type bac) ; le mode « méthodes » n'existe pas encore côté code.
  DoD : chapitres visibles dans le menu, gabarit de contenu défini.
- [x] Remplir les cinq pages du grand oral — l'épreuve, les deux questions, la préparation,
  l'entretien, l'oral blanc minuté. Le simulateur de l'oral de français sert de base pour l'oral
  blanc. Contenu réglementaire pris sur les textes officiels de la session 2027.
  DoD : pages complètes, `node scripts/verify.mjs` OK.
  Livré le 2026-09-22 : les cinq pages n'affichent plus le gabarit vide. Contenu sous
  `content/terminale/grand-oral/` (déroulé minuté, fiches, critères du jury, relances), schémas
  `schemas/grand-oral/` (fiche = jumelle de `oral-fiche`, avec `nature` et `sources`), chargeur
  `src/lib/grand-oral-content.ts` qui relit `content/bac/` (coefficient 8, période, sources)
  sans rien recopier. Méthode traitée comme `content/bac/` sans les deux passes (choix de
  Thibaud). « Mes 2 questions » est un cadre que l'élève remplit (rien d'inventé) ; oral blanc
  propre au grand oral (tirage, minuteur 20 + 10 + 10 lu dans `deroule.json`, relances,
  auto-évaluation sans points). Persistance `bgo-2027-grand-oral`, isolation vérifiée dans
  Chromium. `node scripts/verify.mjs` OK, 152 tests (121 de référence + 31 nouveaux). PR : #75.
- [ ] Relire la page « L'épreuve » du grand oral sur le texte intégral du Bulletin officiel —
  la session du 2026-09-22 n'a pas pu ouvrir education.gouv.fr (bloqué par le réseau de la
  session) : chaque affirmation vient d'extraits du texte `s-grand-oral` obtenus par moteur de
  recherche et recoupés. À confirmer sur le texte : la place du projet d'orientation dans
  l'exposé (la page n'en fait pas une règle), et le contenu de la grille indicative (annexe,
  non reproduite). DoD : fiches `content/terminale/grand-oral/epreuve.json` et `deroule.json`
  conformes au texte, `node scripts/verify.mjs` OK.
- [ ] Afficher le compte à rebours des épreuves — dès que les dates officielles de la session 2027
  sont publiées (aucune date inventée en attendant) : bandeau sur l'accueil et rappel dans le menu.
  DoD : dates sourcées, affichage sur l'accueil.
