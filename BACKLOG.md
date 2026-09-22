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
- [ ] Reprendre le simulateur de moyenne dans le site — l'outil existe dans le dépôt
  `notes-bac-visualisateur` (HTML/CSS/JS purs, ~600 lignes, zéro dépendance) : décider entre
  portage en React et intégration telle quelle, puis brancher sur `/simulateur`.
  Préfixe LocalStorage à prévoir (`btl-2027-*`), sans toucher à `bms-2026-*` / `bfr-2026-*`.
  DoD : simulateur utilisable depuis le menu, `node scripts/verify.mjs` OK.
- [ ] Découper le programme de maths de terminale en chapitres — la liste des chapitres et leur
  ordre, avant toute écriture de contenu ; crée `content/terminale/maths/<slug>/` et alimente
  `sections()` de l'espace `tle-maths`. Nécessite un skill « programme de terminale » sur le
  modèle de celui de première.
  DoD : chapitres visibles dans le menu, schémas de contenu prêts.
- [ ] Découper le programme de physique-chimie en chapitres — même travail, avec ses quatre modes
  (formulaire, méthodes, exercices, type bac) ; le mode « méthodes » n'existe pas encore côté code.
  DoD : chapitres visibles dans le menu, gabarit de contenu défini.
- [ ] Remplir les cinq pages du grand oral — l'épreuve, les deux questions, la préparation,
  l'entretien, l'oral blanc minuté. Le simulateur de l'oral de français sert de base pour l'oral
  blanc. Contenu réglementaire pris sur les textes officiels de la session 2027.
  DoD : pages complètes, `node scripts/verify.mjs` OK.
- [ ] Afficher le compte à rebours des épreuves — dès que les dates officielles de la session 2027
  sont publiées (aucune date inventée en attendant) : bandeau sur l'accueil et rappel dans le menu.
  DoD : dates sourcées, affichage sur l'accueil.
