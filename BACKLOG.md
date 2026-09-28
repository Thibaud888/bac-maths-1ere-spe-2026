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
- [x] Laisser les sessions ouvrir le site du ministère — le 2026-09-23, le réseau de la session
  a refusé `www.education.gouv.fr` (proxy : CONNECT refusé, politique de l'environnement) ;
  la page « Exposé » a dû être vérifiée sur les extraits relevés par la vérification (#76).
  À faire par Thibaud (en cours depuis le 2026-09-24) : menu de l'environnement dans la
  barre de titre → Edit → accès réseau → **Personnalisé**, cocher la case qui garde la liste
  par défaut (« Also include default list of common package managers ») pour conserver les
  sites de confiance, puis une adresse par ligne : `*.education.gouv.fr` (ministère et
  éduscol), `*.legifrance.gouv.fr`, `*.apmep.fr` et `*.labolycee.org` (sujets de bac passés
  de maths et de physique-chimie). La recherche web marche déjà sans ce réglage ; c'est
  l'ouverture des pages qui était bloquée. Le réglage vaut pour les **nouvelles** sessions.
  DoD : une session ouvre `https://www.education.gouv.fr/bo/2026/Special4/MENE2622694N`.
  Constat du 2026-09-24 (session du référentiel maths) : le réglage marche — le proxy laisse
  passer —, mais c'est désormais **le site** qui refuse la machine Cloud (page Cloudflare
  « Sorry, you have been blocked », code 403) sur les pages HTML `education.gouv.fr/bo/…`,
  `eduscol.education.gouv.fr/` et `legifrance.gouv.fr` ; aucun réglage de l'environnement n'y
  peut rien. Les **PDF** passent : `education.gouv.fr/sites/default/files/…`,
  `cache.media.education.gouv.fr/…`, `eduscol.education.gouv.fr/sites/default/files/…` ;
  `apmep.fr` répond aussi. Contournement utilisé : le PDF du Bulletin entier (sommaire →
  numéro de page). Refusés par la politique réseau : `enseignementsup-recherche.gouv.fr`,
  sites d'académie (`ac-*.fr`).
  Clos au bilan du 2026-09-24 : le but (lire les textes officiels depuis une session) est
  atteint par les PDF ; la page HTML de la DoD reste refusée par le site, sans remède côté
  environnement. Textes de lancement à jour : `chantiers/terminale/reprise-phase-1.md`.
  Marche à suivre écrite pour toutes les sessions (2026-09-24, choix de Thibaud) :
  `docs/sources-officielles.md` — sujets de bac via APMEP / Labolycée, textes réglementaires
  sur le PDF officiel, sinon fournis par Thibaud (texte collé ou PDF dans
  `docs/textes-officiels/`) ; renvois dans CLAUDE.md § 0, MAP.md, `annales-indexeur`.
  `node scripts/verify.mjs` OK. PR : #89.
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
- [x] Relire la page « L'épreuve » du grand oral sur le texte intégral du Bulletin officiel —
  la session du 2026-09-22 n'a pas pu ouvrir education.gouv.fr (les pages HTML refusent les
  sessions cloud ; le PDF du Bulletin passe, `docs/sources-officielles.md`) : chaque affirmation
  vient d'extraits du texte `s-grand-oral` obtenus par moteur de recherche et recoupés. À confirmer sur le texte : la place du projet d'orientation dans
  l'exposé (la page n'en fait pas une règle), et le contenu de la grille indicative (annexe,
  non reproduite). DoD : fiches `content/terminale/grand-oral/epreuve.json` et `deroule.json`
  conformes au texte, `node scripts/verify.mjs` OK.
  Relu le 2026-09-23 sur le texte intégral (BO spécial n° 4 du 17 septembre 2026, annexe 1
  comprise) : rapport [`chantiers/verification-contenu-bac-2027.md`](chantiers/verification-contenu-bac-2027.md),
  n° 69 à 88. Le projet d'orientation n'apparaît plus dans le texte ; la grille compte cinq
  rubriques et quatre niveaux, sans points. Les écarts sont devenus les items ci-dessous.
  `node scripts/verify.mjs` OK, 152 tests. PR : #76.
- [ ] Afficher le compte à rebours des épreuves — dès que les dates officielles de la session 2027
  sont publiées (aucune date inventée en attendant) : bandeau sur l'accueil et rappel dans le menu.
  DoD : dates sourcées, affichage sur l'accueil.
  Prêt à démarrer : les dates sont publiées (BO spécial n° 2 du 25 août 2026) et portées par
  `content/bac/calendrier.json` depuis la PR #76 (partie pratique de physique-chimie comprise).

## Terminale : maths et physique-chimie (cadré le 2026-09-24)

> Plan directeur : `chantiers/terminale/README.md` · règles : `.claude/skills/terminale-charte/SKILL.md`
> · procédure d'un chapitre : `/tle-chapitre`. Les phases 1 et 2 peuvent tourner en parallèle.

- [x] Cadrer les espaces maths et physique-chimie de terminale — ce que l'élève y trouvera
  (cours, exercices en trois marches, type bac, mémo), comment l'important passe devant, et
  comment les prochaines sessions les rempliront. Aucun contenu écrit.
  Détail : plan directeur `chantiers/terminale/README.md` ; découpage proposé
  `chantiers/terminale/chapitres-maths.md` (15 chapitres) et `chapitres-physique-chimie.md`
  (16 chapitres), priorités estimées ; charte `.claude/skills/terminale-charte/SKILL.md`
  (modèle de données, blocs de cours, marches, priorités 3/2/1 et quotas, couverture du
  programme, règles des pages) ; agents `tle-architecte`, `tle-auteur-cours`,
  `tle-auteur-exercices`, `tle-auteur-bac`, `tle-relecteur`, `tle-eleve-testeur`,
  `annales-indexeur` ; commande `/tle-chapitre` ; CLAUDE.md § 14, MAP.md.
  `node scripts/verify.mjs` OK. Session du 2026-09-24. PR : #85.

**Phase 1 — les fondations** (dans de nouvelles sessions ; textes officiels lus sur les PDF
du ministère, voir `docs/sources-officielles.md` ; textes à coller prêts dans
`chantiers/terminale/reprise-phase-1.md`)

- [x] (P1) Écrire la liste officielle de ce qu'il faut savoir en maths de terminale — référentiel :
  skill `bac-maths-terminale-2027` (format de l'épreuve 2027 relevé dans la note de service
  de septembre 2026, liste hors programme, notations) + `content/terminale/maths/programme.json`
  (texte exact du BO spécial n° 8 du 25 juillet 2019, une ligne = un identifiant `bo-m-…`
  rattaché à un chapitre ou au chapitre transverse `methodes-maths`, `exigible: false` pour
  les approfondissements possibles) + son schéma ; relève aussi le programme évalué à
  chaque session depuis 2021 (mars 2021-2023 : parties exclues) et tranche le logarithme
  décimal (dans le programme de spécialité ou non). Confirme ou corrige
  `chantiers/terminale/chapitres-maths.md`. Prérequis : accès réseau au site du ministère
  (item plus haut). DoD : `programme.json` validé, `node scripts/verify.mjs` OK.
  Fait le 2026-09-24, tout depuis les PDF officiels (les pages HTML du BO sont refusées, voir
  l'item réseau) : skill `.claude/skills/bac-maths-terminale-2027/` ; `programme.json` =
  205 lignes (173 exigibles, 32 approfondissements), texte relu sur l'image des pages pour
  les formules ; schéma `schemas/terminale/programme.schema.json` ; garde-fou
  `scripts/programme-conforme.mjs` (mot à mot contre l'extraction du BO gardée dans
  `texte-officiel/`, branché dans `validate-content.mjs`). Établi : programme de 2019 en
  vigueur en 2026-2027 ; épreuve 2027 = note MENE2622642N (4 h, quatre exercices de 4 à
  8 points, **calculatrice selon le sujet**, 2 points sur 20 de maîtrise de la langue) ;
  périmètre de 2021, 2022, 2023 relevé, tout le programme depuis 2024 ; **logarithme décimal
  hors programme** ; `chapitres-maths.md` relu (4 corrections, un point à trancher sur
  l'ordre). Au passage : la page demandée pour tester l'accès (MENE2622694N) est la note du
  **grand oral**. `node scripts/verify.mjs` OK. PR : #87.
- [ ] (P1) Écrire la liste officielle de ce qu'il faut savoir en physique-chimie de terminale —
  même travail : `bac-physique-chimie-terminale-2027` + `programme.json` (`bo-pc-…`, avec
  capacités expérimentales et numériques, et les acquis de première mobilisables `bo-pc1-…`),
  format de l'écrit et de l'épreuve pratique. DoD : idem.
  Repris des maths : le schéma accepte déjà `bo-pc-` et `bo-pc1-` ; `programme-conforme.mjs`
  sert tel quel (extraction du PDF dans `.claude/skills/bac-physique-chimie-terminale-2027/texte-officiel/programme*.txt`,
  y_tolerance=6 pour garder les indices sur leur ligne ; formules relues sur l'image des
  pages) ; `validate-content.mjs` attend les préfixes `bo-pc-`/`bo-pc1-`. Programme :
  BO spécial n° 8 du 25-7-2019 (PDF complet : `education.gouv.fr/sites/default/files/imported_files/documents/SP8_MENJ_1159506.pdf`) ;
  épreuve 2027 : MENE2622644N dans le PDF du BO spécial n° 4 du 17-9-2026.
- [x] (P2) Mettre à jour les références officielles des épreuves de spécialité —
  `content/bac/sources.json` : `s-spe-maths` et `s-spe-physique-chimie` pointent vers les notes
  de 2020 ; les notes de service du BO spécial n° 4 du 17 septembre 2026 redéfinissent les
  épreuves à partir de 2027 (physique-chimie : `MENE2622644N` ; maths : `MENE2622642N`,
  relevée dans le référentiel maths § 3). Relire `epreuves.json` sur ces textes ;
  `node scripts/faits-inchanges.mjs` dira ce qui bouge. Déjà vu : `ep-spe-maths` affiche
  « La calculatrice est autorisée. », que le texte ne dit pas (« Le sujet précise si l'usage
  de la calculatrice […] est autorisé ») ; la note de 2026 ajoute 2 points sur 20 de maîtrise
  de la langue. PDF du BO : `education.gouv.fr/sites/default/files/document/20260917boenjsspe4pdf-520753.pdf`.
  DoD : sources à jour, `node scripts/verify.mjs` OK.
  Fait le 2026-09-27 avec les corrections de la vérification : `s-spe-maths` → MENE2622642N,
  `s-spe-physique-chimie` → MENE2622644N, `ep-spe-maths` corrigé sur la calculatrice.
  `node scripts/verify.mjs` OK, 222 tests. PR : #76.

**Phase 2 — la mécanique du site**

- [x] (P1) Préparer les fichiers et les contrôles des chapitres de terminale — `schemas/terminale/*`
  d'après la charte § 3, dont un `figure.schema.json` propre (chemins
  `terminale/<matiere>/<slug>/<nom>`, celui de première n'accepte qu'un niveau) ; chargeur
  `src/lib/terminale/` ; validation dans `validate-content.mjs` ;
  `scripts/couverture-terminale.mjs <matiere> <chapitre> [--partie cours|exercices]`
  (charte § 9.3) ; `scripts/sans-reponses.mjs` (version des exercices sans réponses pour
  l'élève-testeur) ; chapitre-témoin dans `tests/fixtures/terminale/` (jamais dans
  `content/`), chargé en plus par le chargeur **en développement seulement** quand
  `VITE_TEMOIN=1`, pour que les pages puissent l'afficher. N'attend pas le référentiel.
  DoD : `node scripts/verify.mjs` OK, nouveaux tests.
  Livré le 2026-09-24 : onze schémas `schemas/terminale/` (instance Ajv à part : l'`$id`
  `figure.schema.json` reste à la première) ; précisions fixées par les schémas notées en tête
  de la charte § 3. `scripts/lib/terminale.mjs` (lecture, schémas, intégrité : renvois,
  doublons, totaux de points) partagé par `validate-content.mjs` et les deux scripts ;
  `couverture-terminale.mjs` sépare écarts bloquants et avertissements, finit par le tableau
  « compté / plancher » (`--racine`, `--json`) ; `sans-reponses.mjs --sortie`. Chargeur
  `src/lib/terminale/` (`content.ts` : accesseurs, `segmentNotion`, `trierParPriorite` ;
  `indexer.ts` pur et testé). Témoin : `temoin-maths` (les seize types de bloc, les six
  types de réponse), `temoin-methodes-maths` (transverse), `temoin-physique-chimie`
  (expérience, unités) — rapport de couverture vide ; `npm run dev:temoin`. Vérifié : le
  build de production ne contient pas le témoin, même avec `VITE_TEMOIN=1` (nouvelle étape de
  `verify.mjs`). Aucun schéma ni composant de première modifié.
  `node scripts/verify.mjs` OK, 222 tests (177 + 45). PR : #86.
- [x] (P1) Construire les pages « Aperçu » et « Cours » d'un chapitre de terminale — routes
  `/terminale/<matiere>/:slug` et `/cours`, onglets, `sections()` de `tle-maths` et
  `tle-physique-chimie`, **une page par notion** dans le cours (`/cours/<notion>`, sommaire
  des notions, précédente / suivante — charte § 11), rendu de chaque type de bloc
  (charte § 4.2) sur `PageLongue`, dont
  les blocs de code en chasse fixe (jamais passés par le rendu du texte), étiquette de
  priorité, progression par notion (`btm-2027-`, `bpc-2027-`), accueil de la matière, page
  `/terminale/<matiere>/methodes` (chapitre transverse). Mêmes composants pour les deux
  matières. DoD : chapitre-témoin affiché, captures
  relues (clair, sombre, ordinateur, téléphone), `node scripts/verify.mjs` OK.
  Livré le 2026-09-28 : accueil de la matière (`MatiereAccueilPage` : reprendre, incontournables
  à revoir, chapitres par domaine avec anneau de maîtrise ; page d'attente tant qu'aucun
  chapitre n'est écrit) ; cadre d'un chapitre (`routes/terminale/chapitre/ChapitreLayout`,
  onglets Aperçu · Cours, `/methodes` pour le transverse) ; Aperçu (l'essentiel, où en est
  l'élève, carte des notions par priorité, « ce que le bac demande », rappels) ; une page par
  notion (`CoursPage`, `/cours` seul = dernière lue), sommaire des notions à droite ; rendu des
  seize blocs (`components/terminale/BlocCours`), questions vérifiables
  (`QuestionVerifiable`, logique `lib/terminale/reponses.ts`) ; progression par notion
  (`lib/terminale/progression.ts`, seuils réglables) dans `btm-2027-progression` /
  `bpc-2027-progression`. Barre latérale et fil d'Ariane alimentés par le contenu. Les gabarits
  partagés (`PageLongue`, `Sommaire`, `Essentiel`) acceptent les accents bleu et violet ;
  première inchangée. « Réviser l'essentiel » mène pour l'instant au cours du premier
  incontournable non maîtrisé (le mémo le remplacera). Captures relues (clair, sombre,
  1280 px, 390 px). `node scripts/verify.mjs` OK.

- [x] (P1) Construire les pages d'entraînement : exercices, type bac, mémo — trois marches
  filtrables par notion ; réponses vérifiables (QCM, vrai-faux, numérique avec unité, remise
  en ordre, auto-évaluation) ; indices + « revoir le cours » ; type bac (réutilise
  `ExamRunner`, `Timer`) ; mémo et questions éclair (`FormulaCard`, `QcmRunner`) ; états de
  maîtrise (logique pure testée). Première inchangée. DoD : idem.
  Livré le 2026-09-28 : onglets Exercices · Type bac · Mémo (« Méthodes » sans type bac).
  Exercices : trois marches filtrables par marche et par notion (`?niveau=&notion=`, gardé
  dans l'adresse d'un exercice), incontournables d'abord, carte avec durée, calculatrice et
  état ; un exercice par page (`/exercices/<num>`, précédent / suivant) : réponses
  vérifiables corrigées tout de suite (`pourquoiFaux`, unités), indices progressifs avec
  « revoir le cours », solution, erreur fréquente, auto-évaluation réussi / à moitié / raté ;
  résultat de l'exercice = moyenne des questions (`lib/terminale/entrainement.ts`, testé),
  enregistré dans la progression. Type bac : barème par (sous-)question, chronomètre
  facultatif (`Timer` de première), « ce qu'attend le correcteur », points estimés, source
  citée. Mémo : cartes par priorité, détaillé / simplifié ; « Teste-toi » : questions éclair
  une par une, premier essai compté. Les runners de première ne sont pas réutilisés tels
  quels (ils écrivent dans `bms-2026-progress` et n'ont que deux niveaux d'auto-évaluation) :
  composants propres sous `components/terminale/`, `Timer` réutilisé. « Réviser l'essentiel »
  mène au mémo ; fin de chaque notion du cours : « S'entraîner sur cette notion ».
  `node scripts/verify.mjs` OK (262 tests).

**Phase 3 — les chapitres pilotes**

- [ ] (P1) Écrire le premier chapitre de maths, pour valider la méthode — `/tle-chapitre maths
  <slug>` sur le chapitre que Thibaud désigne (par défaut le premier de l'ordre proposé,
  `recurrence-suites`), partie cours
  puis partie exercices ; Thibaud relit, la charte est ajustée à la suite ; la session ajoute
  ici un item par chapitre suivant. DoD : chapitre fini au sens de la charte § 9, retours de
  Thibaud notés dans la charte. À trancher au passage (`chapitres-maths.md`, fin) : le ch. 1
  ne porte que 3 lignes exigibles du programme (il tient seul ou rejoint les limites de
  suites ?) ; l'espérance de la loi binomiale est au ch. 15, loin du ch. 11.
- [ ] (P1) Écrire le premier chapitre de physique-chimie, pour valider la méthode — même
  chose, sur le chapitre que Thibaud désigne (par défaut `acides-bases`). DoD : idem.

**Phase 4 — la production**

- [ ] (P2) Écrire la page « Méthodes » de chaque matière — chapitre transverse
  `methodes-maths` (logique, raisonnements, Python, rédaction, calculatrice) et
  `methodes-physique-chimie` (mesure et incertitudes, chiffres significatifs, analyse
  dimensionnelle, résolution de problème, Python) ; `/tle-chapitre <matiere> methodes-<matiere>`,
  sans type bac (charte § 2.1). DoD : § 9.4 de la charte.
- [ ] (P2) Écrire les chapitres suivants, un par session — dans l'ordre de la classe, deux
  items par chapitre (« le cours », « les exercices »), ajoutés ici par les sessions pilotes ;
  plusieurs sessions en parallèle possibles, un chapitre chacune.
- [ ] (P2) Compter ce qui tombe vraiment au bac de maths — `annales-indexeur` sur les sujets
  2021-2026 **de tous les lieux d'examen** (métropole, centres étrangers, Amérique du Nord et
  du Sud, Asie, Polynésie, Nouvelle-Calédonie, Antilles-Guyane, La Réunion, sujets de secours
  publiés) → `content/terminale/maths/annales.json` (objet `{ complet, depuis, sujets }`) ;
  `scripts/frequences-annales.mjs <matiere> <chapitre>` (par notion : sujets où au moins une
  de ses lignes est mobilisée, sur les sujets où elle pouvait tomber — sessions 2021-2023
  limitées à leur périmètre, relevé ligne à ligne dans le référentiel maths § 4 ; refuse de
  publier tant que l'index n'est pas
  complet) ; priorités des chapitres déjà écrits recalculées (`tle-architecte`, mode
  `priorites`).
  Prérequis : référentiel maths ; sujets sur apmep.fr (`docs/sources-officielles.md`).
  DoD : index complet, rapport de fréquences dans la PR.
- [ ] (P3) Compter ce qui tombe vraiment au bac de physique-chimie — même travail.

**Phase 5 — réviser et donner envie**

- [ ] (P3) Faire revenir les questions au bon moment — répétition espacée des questions éclair
  (1, 3, 7, 14, 30 jours), « tes questions du jour » sur l'accueil de la matière, « mes
  erreurs » rejouables.
- [ ] (P3) Réviser pour le bac en commençant par l'essentiel — page `/terminale/<matiere>/reviser` :
  incontournables puis fréquents, tous chapitres, selon ce que l'élève maîtrise déjà.
- [ ] (P3) Passer des sujets complets de terminale chronométrés — maths 4 h, physique-chimie
  3 h 30 ; réutilise `BacBlancRunner` ; format pris dans le référentiel.
- [ ] (P3) Comprendre en manipulant : figures animées — composants JSXGraph chargés à la
  demande (suite qui converge, tangente, valeurs intermédiaires, aire sous une courbe, loi
  binomiale ; projectile, charge d'un condensateur, courbe de titrage), appelés par le bloc
  `anime` du cours.
- [ ] (P3) Préparer l'épreuve pratique de physique-chimie — espace
  `/terminale/physique-chimie/pratique` : capacités expérimentales, protocoles commentés,
  incertitudes.
- [ ] (P3) Imprimer le mémo d'un chapitre sur une page — feuille de style d'impression, sans
  dépendance.

## Corriger le contenu réglementaire (vérification du 2026-09-23)

> Chaque item corrige une affirmation fausse (F) ou imprécise (I) relevée dans
> [`chantiers/verification-contenu-bac-2027.md`](chantiers/verification-contenu-bac-2027.md) ;
> les numéros renvoient au tableau du rapport, qui donne l'extrait officiel et l'adresse.
> DoD commune : texte corrigé et sourcé sur le texte officiel en vigueur pour 2027,
> `node scripts/verify.mjs` OK. Tous les items sont traités (PR #76 et #92).

- [x] Ne plus dire que la calculatrice est autorisée en spécialité maths — c'est le sujet qui
  le précise le jour même. `content/bac/epreuves.json` ep-spe-maths · resume (n° 29, F).
  Source à citer : note du 11-9-2026 MENE2622642N.
  Fait le 2026-09-27 dans la PR de vérification : « Le sujet précise si la calculatrice est
  autorisée » ; `s-spe-maths` pointe la note de 2026. `node scripts/verify.mjs` OK, 222 tests.
  PR : #76.
- [x] Afficher la mention « très bien avec les félicitations du jury » à partir de 18 — c'est
  une mention officielle, pas une décision libre du jury. `content/bac/mentions.json` :
  me-felicitations (libellé officiel, `resume`, retirer `reglementaire: false`), me-tres-bien
  `plafond: 18` ; textes en dur `src/routes/outils/LeBacPage.tsx:407` et
  `src/routes/outils/SimulateurPage.tsx:132` ; source s-presentation-bac (n° 50 I, n° 51 F).
  Mettre à jour les tests du simulateur qui portent sur les paliers.
  Fait le 2026-09-27 dans la PR de vérification : félicitations sur l'échelle de 0 à 20 (nom
  court « Félicitations » par le champ `court`, le libellé officiel restant pour le simulateur),
  très bien plafonné à 18 ; `reglementaire` retiré du schéma, du type, des deux pages et du test
  des paliers (les seuils du simulateur n'ont pas bougé, ses tests passent tels quels).
  `node scripts/verify.mjs` OK, 222 tests. PR : #76.
- [x] Donner les dates officielles de la partie pratique de physique-chimie : du 1er au 4 juin
  2027 — publiées au BO spécial n° 2 du 25 août 2026. `content/bac/calendrier.json`
  ca-pratique-physique-chimie (`precision: periode`, source s-calendrier-2027) ;
  `content/bac/epreuves.json` ep-spe-physique-chimie · quand, detail (n° 40, F).
  Fait le 2026-09-27 dans la PR de vérification. `node scripts/verify.mjs` OK, 222 tests.
  PR : #76.
- [x] Remplacer les textes officiels périmés cités en source — `content/bac/sources.json` :
  s-spe-physique-chimie → MENE2622644N (texte de 2020 abrogé, n° 63 F) ; s-spe-maths →
  MENE2622642N (n° 62 I) ; s-eam-bo → note du 10 juin 2025 MENE2515469N et arrêté du 10 juin
  2025 JORFTEXT000051714285, le texte cité valant pour la session 2028 (n° 60 F) ; s-mentions →
  s-presentation-bac, la brochure citée datant de 2005 (n° 67 F) ; libellés « BO spécial n° 4
  du 17 septembre 2026 » (n° 64 I) ; note de s-eps sans « coefficient 6 » (n° 65 I). Au passage,
  ajouter les sources manquantes des lignes vraies mais mal sourcées (n° 12, 20, 30, 32, 34, 48,
  53, 54), dont la note de philosophie MENE2622661N.
  Fait le 2026-09-27 dans la PR de vérification : les quatre textes remplacés (`s-eam-bo` → note
  du 10-6-2025, BO n° 24 du 12 juin 2025, qui vaut « pour les épreuves présentées au titre de la
  session 2027 » ; `s-mentions` retirée, ses entrées citent `s-presentation-bac`) et les dates
  des BO complétées. Reste l'item suivant. `node scripts/verify.mjs` OK, 222 tests. PR : #76.
- [x] Compléter les sources de quelques lignes du mode d'emploi — la note de `s-eps` parle d'un
  « coefficient 6 » que le texte EPS ne donne pas (n° 65, I) ; lignes vraies mais mal sourcées
  (n° 12, 20, 30, 32, 34, 48, 53, 54), dont la note de philosophie MENE2622661N à déclarer.
  Fait le 2026-09-28. `node scripts/verify.mjs` OK, 222 tests. PR : #92.
- [x] Écrire que les maths anticipées comptent pour la session 2027, pas 2026 — ep-maths-anticipee
  · detail et note de s-eam (n° 26, F).
  Fait le 2026-09-28. `node scripts/verify.mjs` OK, 222 tests. PR : #92.
- [x] Grand oral : dire que l'échange porte sur le programme « en lien avec ta question » — le
  texte limite l'interrogation au lien avec le premier temps. `content/terminale/grand-oral/`
  deroule.json gt-echange, entretien.json go-ent-cours (n° 83, I).
  Fait le 2026-09-27 dans la PR de vérification : « en lien avec ton exposé ».
  `node scripts/verify.mjs` OK, 222 tests. PR : #76.
- [x] Grand oral : donner les trois façons autorisées de construire ses deux questions, et ce qui
  arrive si elles ne sont pas conformes — une sur chaque spécialité, une sur une spécialité et
  une transversale, ou deux transversales ; sinon pas d'épreuve, puis 0 à la session de
  remplacement. epreuve.json go-epreuve-questions (n° 69, I) ; remarque « question non
  conforme » du rapport.
  Fait le 2026-09-27 dans la PR de vérification. `node scripts/verify.mjs` OK, 222 tests.
  PR : #76.
- [x] Grand oral : dire ce qui est permis dans la salle — de quoi écrire, et un tableau si on le
  souhaite. epreuve.json go-epreuve-preparation-du-jour · conseil ; la page annonce « ce qui est
  autorisé » (`src/routes/terminale/grand-oral/EpreuvePage.tsx:66`) sans le dire (n° 78, I).
  Fait le 2026-09-28. `node scripts/verify.mjs` OK, 222 tests. PR : #92.
- [x] Grand oral : ne plus présenter le projet d'orientation comme une attente du jury — le texte
  de 2026 demande seulement pourquoi la question a été choisie « pendant sa formation ».
  entretien.json go-ent-orientation ; `src/components/grand-oral/QuestionForm.tsx:125-126` ;
  catégorie de relances « Ton projet » (n° 86, I).
  Fait le 2026-09-28. `node scripts/verify.mjs` OK, 222 tests. PR : #92.
- [x] Grand oral : trois nuances sur la page « L'épreuve » — grille « sur laquelle le jury peut
  s'appuyer » et non « qu'il utilise » (go-epreuve-note, n° 80 I) ; jury pas forcément
  non spécialiste (go-epreuve-jury · conseil, n° 75 I) ; les sept critères, et non quatre,
  dans le mode d'emploi du bac (ep-grand-oral · detail, n° 36 I).
  Fait le 2026-09-28. `node scripts/verify.mjs` OK, 222 tests. PR : #92.
- [x] Rattrapage : prévenir qu'on ne peut pas choisir deux fois les maths — spécialité et épreuve
  anticipée s'excluent au second groupe. `src/routes/outils/LeBacPage.tsx:419-424`, source
  s-presentation-bac (n° 52, I).
  Fait le 2026-09-27 dans la PR de vérification : carte « Entre 8 et 10 » ; ses deux cartes
  citent `s-presentation-bac`. `node scripts/verify.mjs` OK, 222 tests. PR : #76.
- [x] Calendrier : dire que ses deux écrits de spécialité tombent le mercredi 16 et le jeudi
  17 juin — annexe III du calendrier 2027 : maths et physique-chimie n'ont pas d'épreuve le
  vendredi 18. calendrier.json ca-specialites · detail (n° 45, I) ; ca-grand-oral : la date
  figure sur la convocation (n° 46, I).
  Fait le 2026-09-28. `node scripts/verify.mjs` OK, 222 tests. PR : #92.
- [x] Notes de première : écrire « connues » plutôt que « définitives » — les notes anticipées
  restent provisoires jusqu'au jury, et la commission d'harmonisation peut modifier les
  moyennes. co-specialite-abandonnee · profilNote, co-francais-ecrit · comment,
  ep-francais-ecrit · detail, ca-epreuves-anticipees-2026 · detail,
  `src/routes/outils/LeBacPage.tsx:329` et `:336` (n° 8, 22, I).
  Fait le 2026-09-28. `node scripts/verify.mjs` OK, 222 tests. PR : #92.
- [x] Physique-chimie : ne plus dire que c'est la seule épreuve pratique du bac — SVT, NSI et
  sciences de l'ingénieur en ont aussi une ; c'est la seule de ses épreuves.
  co-specialite-physique-chimie · comment (n° 17, I).
  Fait le 2026-09-28. `node scripts/verify.mjs` OK, 222 tests. PR : #92.
