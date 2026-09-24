---
name: bac-maths-terminale-2027
description: Référentiel officiel des maths de terminale (spécialité, voie générale) pour le bac session 2027 — programme en vigueur en 2026-2027 (annexe de l'arrêté du 19 juillet 2019, BO spécial n° 8 du 25 juillet 2019), ligne par ligne et au mot près dans content/terminale/maths/programme.json ; format de l'épreuve écrite et de l'oral de contrôle (note de service du 11 septembre 2026, BO spécial n° 4 du 17 septembre 2026) ; programme évalué à chaque session depuis 2021 ; précisions et limites posées par le programme ; hors programme (options, logarithme décimal, nouveau programme de 2026) ; notations. À lire, après la charte terminale-charte, avant toute création ou relecture de contenu sous /terminale/maths (agents tle-*, annales-indexeur).
---

# Maths de terminale (spécialité) — référentiel, session 2027

> Écrit le 2026-09-24, **texte officiel en main** : chaque affirmation ci-dessous vient d'un
> texte téléchargé ce jour-là sur `education.gouv.fr` ou `eduscol.education.gouv.fr` (§ 1),
> rien de mémoire. Les citations sont entre guillemets et exactes.
>
> Ordre de lecture pour un agent : la charte `.claude/skills/terminale-charte/SKILL.md` →
> ce fichier → `content/terminale/maths/programme.json` (les lignes du chapitre traité).

## 0. Ce qu'il contient et comment s'en servir

| Besoin | Où |
|---|---|
| Les lignes du programme (identifiants `bo-m-…`, texte exact, chapitre, rubrique, exigible) | `content/terminale/maths/programme.json` (schéma `schemas/terminale/programme.schema.json`) |
| Le programme en vigueur et ce qui s'applique en 2026-2027 | § 2 |
| **Format de l'épreuve** (écrit et oral de contrôle) | § 3 |
| Ce qui pouvait tomber à chaque session depuis 2021 (pour les annales) | § 4 |
| Comment le programme a été découpé en lignes, et quel chapitre porte quoi | § 5 |
| Les limites que le programme pose lui-même (admis, non exigible…) | § 6 |
| Le hors programme | § 7 |
| Les notations du programme | § 8 |
| Ce qui reste ouvert | § 9 |
| Le texte officiel brut, pour vérifier | `texte-officiel/` (ce dossier) |

Contrôle automatique : `node scripts/programme-conforme.mjs maths` vérifie que chaque ligne
de `programme.json` reprend **mot pour mot** le texte officiel enregistré dans
`texte-officiel/programme-2019.txt` (les formules, abîmées par l'extraction du PDF, sont
relues sur l'image des pages). `validate-content.mjs` l'appelle, donc
`node scripts/verify.mjs` aussi. Un identifiant publié ne change plus (charte § 2.2).

## 1. Sources (téléchargées le 2026-09-24)

Les pages HTML du Bulletin officiel (`education.gouv.fr/bo/…`) refusent la connexion depuis
les sessions Cloud (blocage Cloudflare, pas le réseau de l'environnement) ; les **PDF** du
même site s'ouvrent. Toutes les citations viennent de ces PDF.

| Texte | Référence | Fichier ouvert |
|---|---|---|
| Programme de spécialité de terminale (en vigueur en 2026-2027) | Arrêté du 19-7-2019, NOR MENE1921246A, BO spécial n° 8 du 25-7-2019 (p. 455-476) | Annexe : `https://cache.media.education.gouv.fr/file/SPE8_MENJ_25_7_2019/90/7/spe246_annexe_1158907.pdf` ; BO complet : `https://www.education.gouv.fr/sites/default/files/imported_files/documents/SP8_MENJ_1159506.pdf` (texte identique, vérifié mot à mot) |
| Nouveau programme de terminale (rentrée 2027) | Arrêté du 26-2-2026, NOR MENE2602919A, BO n° 14 du 2-4-2026 | `https://www.education.gouv.fr/sites/default/files/document/Bulletin%20officiel%20n%C2%B0%2014%20du%202%20avril%202026-515432.pdf` |
| Nouveau programme de première (rentrée 2026) | Arrêté du 26-2-2026, NOR MENE2602917A, même BO | idem |
| **Épreuve de spécialité maths, à partir de 2027** | Note de service du 11-9-2026, NOR MENE2622642N, BO spécial n° 4 du 17-9-2026 (p. 111-113) | `https://www.education.gouv.fr/sites/default/files/document/20260917boenjsspe4pdf-520753.pdf` (page en ligne : `https://www.education.gouv.fr/bo/2026/Special4/MENE2622642N`) |
| Maîtrise de la langue à tous les examens (2027) | Note de service du 11-9-2026, NOR MENE2623195N, même BO (p. 4-5) | idem |
| Déroulement des corrections (2027) | Note de service du 15-9-2026, NOR MENE2624395N, même BO (p. 185-…) | idem |
| Épreuve à partir de la session 2021 | Note de service n° 2020-029 du 11-2-2020, NOR MENE2001796N, BO spécial n° 2 du 13-2-2020 (p. 33) | `https://www.education.gouv.fr/sites/default/files/imported_files/documents/BOspe2_MENJ_1244589.pdf` |
| Adaptation à partir de la session 2022 | Note de service du 12-7-2021, NOR MENE2121273N, BO n° 30 du 29-7-2021 (p. 585) | `https://www.education.gouv.fr/sites/default/files/document/BO_30_MENJS_1416615.pdf-309180.pdf` |
| Programme d'examen à partir de la session 2023 | Note de service du 29-9-2022, NOR MENE2227884N, BO n° 36 du 30-9-2022 (p. 53-57) | `https://www.education.gouv.fr/sites/default/files/document/BOENJ_36_ok_5_1428730.pdf-329304.pdf` |
| Programme d'examen à partir de la session 2024 | Note de service du 26-9-2023, NOR MENE2323020N, BO n° 36 du 28-9-2023 (p. 55) | `https://www.education.gouv.fr/sites/default/files/document/Bulletin%20officiel%20n%C2%B0%2036%20du%2028%20septembre%202023-366075.pdf` |
| Version consolidée de l'épreuve (août 2024) | éduscol | `https://eduscol.education.gouv.fr/sites/default/files/document/nds-consolidee-definition-epreuve-bac-maths-102105.pdf` |
| Options de terminale (hors programme ici) | Arrêtés du 19-7-2019 : mathématiques expertes NOR MENE1921264A, mathématiques complémentaires NOR MENE1921265A, BO spécial n° 8 du 25-7-2019 | BO complet ci-dessus |

Extractions gardées dans `texte-officiel/` : `programme-2019.txt` (l'annexe entière) et
`note-epreuve-2026.txt` (la note MENE2622642N).

> Le registre des sources du site (`content/bac/sources.json`) pointe encore, pour
> `s-spe-maths`, vers la note de 2020 : c'est l'item de backlog « Mettre à jour les
> références officielles des épreuves de spécialité », pas ce référentiel.

## 2. Le programme en vigueur pour la session 2027

- Programme : **annexe de l'arrêté du 19 juillet 2019** (« Programme de spécialité de
  mathématiques de terminale générale »). Article 2 : « Les dispositions du présent arrêté
  entrent en vigueur à la rentrée scolaire 2020. »
- L'arrêté du 26 février 2026 (NOR MENE2602919A) : « Article 1 – L'annexe de l'arrêté du
  19 juillet 2019 susvisé est remplacée par l'annexe du présent arrêté. Article 2 – Les
  dispositions du présent arrêté entrent en application à la rentrée scolaire 2027-2028. »
  → en 2026-2027, **c'est l'annexe de 2019 qui s'applique** ; le programme de 2026 est hors
  programme ici (§ 7).
- La note de l'épreuve 2027 : « L'épreuve porte sur le programme de l'enseignement de
  spécialité de la classe de terminale en vigueur. Les notions du programme de la classe de
  première en vigueur peuvent être mobilisées dans le cadre de l'épreuve. »
- **Point d'attention (première)** : l'arrêté du 26 février 2026 (NOR MENE2602917A) remplace
  l'annexe du programme de spécialité de **première** « à la rentrée scolaire 2026-2027 ».
  Un élève de terminale en 2026-2027 a suivi en première le programme de 2019 (skill
  `bac-maths-premiere-spe-2026`), alors que « le programme de la classe de première en
  vigueur » en 2026-2027 est celui de 2026. Aucun texte lu ne dit comment la session 2027
  traite cet écart. Règle du site en attendant : les rappels de première s'appuient sur le
  programme de première de 2019 (celui de l'élève) ; si un sujet 2027 mobilise une notion de
  première absente de ce programme, le signaler plutôt que l'enseigner comme un acquis.

## 3. Format de l'épreuve

Source : note de service du 11-9-2026, NOR MENE2622642N (texte complet dans
`texte-officiel/note-epreuve-2026.txt`). Le coefficient est dans
`content/bac/coefficients.json` (`co-specialite-maths`), la date dans
`content/bac/calendrier.json` : ni l'un ni l'autre n'est recopié ici.

### 3.1 Épreuve écrite

| Élément | Texte officiel |
|---|---|
| Durée | « Durée : 4 heures » |
| Programme | « L'épreuve porte sur le programme de l'enseignement de spécialité de la classe de terminale en vigueur. Les notions du programme de la classe de première en vigueur peuvent être mobilisées dans le cadre de l'épreuve. » |
| Structure | « Le sujet comporte quatre exercices indépendants les uns des autres, qui permettent d'évaluer les connaissances et compétences des candidats. Le sujet aborde une grande variété des contenus du programme de spécialité. » |
| Calculatrice | « Le sujet précise si l'usage de la calculatrice, dans les conditions précisées par les textes en vigueur, est autorisé. » |
| Notation | « La note globale de l'épreuve est donnée sur 20 points. Chaque exercice est noté sur 4 à 8 points. » |
| Maîtrise de la langue | « La maîtrise de la langue est prise en compte à hauteur de deux points sur vingt, dédiés à la maîtrise des normes orthographiques et syntaxiques, ainsi qu'à la capacité à formuler un raisonnement et à utiliser un vocabulaire juste et adapté. Les attendus et observables rédactionnels sont précisés dans la grille annexée à la présente note de service. » |

La grille annexée (« Attendus et observables rédactionnels », relue sur l'image de la
page 113) croise quatre critères — « Orthographe » ; « Syntaxe/Construction des phrases » ;
« Lexique » ; « Mise en forme et organisation de la réflexion » — et quatre paliers : très
insuffisant, insuffisant, satisfaisant, très satisfaisant. Palier
« très satisfaisant » du lexique : « Le lexique, notamment celui de la discipline, est riche
et correctement utilisé. » ; de l'organisation : « Le propos est organisé de manière
cohérente. Il suit un fil conducteur perceptible et pertinent. »

Textes transverses du même BO qui s'appliquent aussi :

- MENE2623195N (maîtrise de la langue) : « à partir de la session 2027, la part accordée aux
  qualités rédactionnelles dans les définitions des épreuves est-elle mieux identifiée […].
  Cette exigence accrue suppose de faire davantage rédiger les candidats en limitant le
  recours à des exercices de type QCM ou à des consignes de type « réponse courte : un mot,
  une expression ou une citation de texte ». » ; « Un minimum de deux points est accordé à
  la maîtrise de la langue dans chacune des épreuves. »
- MENE2624395N (corrections) : « Les notes varient de 0 à 20 en points entiers, sauf si la
  réglementation de l'épreuve concernée en dispose autrement. » ; les barèmes nationaux
  « doivent être respectés » ; « Les correcteurs reportent le nombre de points attribués à
  chaque partie ou exercice du sujet ».

**Ce que cela impose aux exercices type bac du site** (`tle-auteur-bac`, charte § 7) :

- un exercice type bac = un exercice d'épreuve : **4 à 8 points** ; un sujet complet =
  **quatre exercices indépendants**, 4 heures ;
- `calculatrice` dit, exercice par exercice, si elle est permise : c'est le sujet qui le
  précise, elle **n'est pas toujours autorisée** ; les calculs d'un exercice « sans
  calculatrice » restent faisables à la main ;
- une rédaction attendue, jugée aussi sur la langue : `attenduCorrecteur` nomme le
  raisonnement et le vocabulaire justes, pas seulement le résultat ; pas de QCM ni de
  « réponse courte » comme forme dominante ;
- la note ne dit pas comment les 2 points de maîtrise de la langue s'articulent avec les
  points des exercices : ne pas l'inventer ; un barème d'exercice se donne sur ses propres
  points (4 à 8).

### 3.2 Épreuve orale de contrôle (second groupe)

« Temps de préparation : 20 minutes » ; « Durée : 20 minutes » ; « Le programme sur lequel
peut porter l'épreuve orale de contrôle est identique au programme de l'épreuve écrite. » ;
« Pour préparer l'entretien, l'examinateur propose au moins deux questions au candidat,
portant sur des parties différentes du programme de spécialité de terminale. » ; « L'usage
des calculatrices est autorisé, dans les conditions précisées par les textes en vigueur.
L'examinateur pourra fournir avec les questions certaines formules jugées nécessaires. »

## 4. Programme évalué, session par session (pour l'index des annales)

Tous les sujets depuis 2021 portent sur le **même programme** (annexe de 2019) ; seul le
**périmètre évaluable** a changé. L'`annales-indexeur` ne compte une ligne que dans les
sujets où elle **pouvait** tomber (README § 5.1).

| Session | Texte | Structure | Périmètre évaluable |
|---|---|---|---|
| 2021 | MENE2001796N | « de trois à cinq exercices » | Tout, « à l'exception des sections suivantes du programme de spécialité de terminale : fonctions sinus et cosinus ; calcul intégral ; concentration, loi des grands nombres. De plus, la section Combinatoire et dénombrement du programme de spécialité de terminale est mobilisable mais ne peut constituer le ressort essentiel d'un exercice. » |
| 2022 | MENE2121273N | « quatre exercices » | Tout, « à l'exception des sections suivantes du programme de spécialité de terminale : combinatoire et dénombrement ; fonctions sinus et cosinus ; calcul intégral ; somme de variables aléatoires ; concentration, loi des grands nombres. De plus, la section primitives, équations différentielles du programme de spécialité de terminale est mobilisable à l'exclusion du contenu suivant : équation différentielle y' = ay, où a est un nombre réel ; allure des courbes. Équation différentielle y' = ay + b. » |
| 2023 | MENE2227884N | (celle de 2022) | Liste positive : Algèbre et géométrie « uniquement » vecteurs, droites et plans ; orthogonalité et distances ; représentations paramétriques et équations cartésiennes. Analyse « uniquement » suites ; limites des fonctions ; compléments sur la dérivation ; continuité ; fonction logarithme ; « Primitives, équations différentielles, à l'exclusion du contenu suivant : - équation différentielle y' = ay, où a est un nombre réel ; allure des courbes. Équation différentielle y' = ay + b ». Probabilités « uniquement » succession d'épreuves indépendantes, schéma de Bernoulli. « Partie « Algorithmique et programmation » dans sa totalité ». |
| 2024, 2025, 2026 | MENE2323020N (« applicable à compter de la session 2024 ») ; version consolidée éduscol d'août 2024 | quatre exercices, 4 à 8 points | **Tout le programme** : « L'épreuve porte sur le programme de l'enseignement de spécialité de la classe de terminale en vigueur. » La note abroge les deux notes du 29-9-2022. |
| 2027 | MENE2622642N | quatre exercices, 4 à 8 points, 2 points de maîtrise de la langue | **Tout le programme** (§ 3). |

Traduction en identifiants de `programme.json` (lignes exclues du décompte d'une session) :

| Exclusion | Lignes |
|---|---|
| fonctions sinus et cosinus | `bo-m-trigonometrie-*` |
| calcul intégral | `bo-m-integrale-*` |
| concentration, loi des grands nombres | `bo-m-concentration-*` |
| combinatoire et dénombrement (2022, 2023 ; 2021 : « mobilisable » mais jamais « ressort essentiel ») | `bo-m-denombrement-*` |
| somme de variables aléatoires (2022, 2023) | `bo-m-sommes-*` |
| « équation différentielle y' = ay […] y' = ay + b » (2022, 2023) | `bo-m-primitives-03` (même texte) ; `bo-m-primitives-05` et `-08` portent sur ces équations |

Remarques : la note de 2023 ne cite pas la partie « Vocabulaire ensembliste et logique »
(transversale) ; les dates des épreuves de chaque session ne sont pas dans ces textes (le
BO n° 36 de 2022 donne, pour La Réunion, les écrits de spécialité 2023 les 27 et 28 mars).

## 5. Le programme découpé en lignes (`programme.json`)

**205 lignes**, dont **173 exigibles** : 73 contenus, 64 capacités attendues, 18
démonstrations, 18 exemples d'algorithme, 32 approfondissements possibles (non exigibles).

### 5.1 Règles de transcription

- **Mots exacts** du BO, dans l'ordre ; seule l'apostrophe est droite (`'`), comme dans tout
  le contenu du site. Les coquilles du BO sont gardées : « Pour toute primitive F d f »
  (`bo-m-integrale-15`).
- **Formules en LaTeX KaTeX** (`$…$`), relues sur l'image des pages : l'extraction du PDF
  les abîme (elle avait par exemple rendu $1/\sqrt{x}$ par « 1/x » et perdu le ω de
  $y'' + \omega^2 y = 0$). La lettre de fonction « ƒ » du BO s'écrit `$f$`. Les notations du
  BO sont gardées telles quelles dans `programme.json` ($[a,b]$, $\mathcal{B}(n,p)$) ; le
  contenu du site suit, lui, la charte § 10.
- **Une ligne = une puce** de « Contenus », « Capacités attendues », « Démonstration(s) »,
  « Exemple(s) d'algorithme », « Approfondissement(s) possible(s) ». S'y ajoutent quatre
  paragraphes normatifs : `bo-m-denombrement-01` (les notions ensemblistes introduites) et
  `bo-m-logique-01` à `-03` (notions et notations ensemblistes). Les items de la liste « Les
  élèves apprennent en situation à : » (`bo-m-logique-04` à `-14`) gardent leur minuscule
  initiale, sans le « ; » final.
- **Pas repris en lignes** : préambule, objectifs, « Histoire des mathématiques », textes
  d'introduction des sections. Ce qu'ils posent comme limite est cité au § 6.
- `exigible: false` pour les 32 « approfondissements possibles » (« en aucun cas
  obligatoires », dit le programme) ; tout le reste est exigible, y compris les **exemples
  d'algorithme** (le programme ne les dit pas non exigibles ; charte § 3.1). Le programme les
  présente comme des *exemples* : si leur couverture complète (charte § 9.2 : un bloc de code
  et un exercice chacun) s'avère démesurée, c'est au chapitre pilote de le proposer, pas à un
  auteur de les laisser de côté.
- **Deux lignes** passent le contrôle mot à mot par exception déclarée
  (`texte-officiel/ecarts-admis.json`) : l'extraction y éclate une fraction au milieu de la
  phrase ; elles ont été relues sur l'image de la page.

### 5.2 Rubriques

| Rubrique BO | `rubrique` | Couverture exigée (charte § 9.2) |
|---|---|---|
| Contenus | `contenu` | bloc formel + exercice + question éclair |
| Capacités attendues (et items de logique, de listes) | `capacite` | idem |
| Démonstration(s) | `demonstration` | un bloc `demonstration` `exigible: true` |
| Exemple(s) d'algorithme | `algorithme` | un bloc de code + un exercice |
| Approfondissement(s) possible(s) | `approfondissement` | rien (`exigible: false`) |

### 5.3 Qui porte quoi : lignes par chapitre

Découpage de `chantiers/terminale/chapitres-maths.md` (ordre de l'année). La section du BO
reste dans le champ `section` ; le champ `chapitre` dit où la ligne est enseignée.

| Chapitre | Lignes | Exigibles | contenu | capacité | démo | algo | approf. | Identifiants |
|---|---|---|---|---|---|---|---|---|
| `recurrence-suites` | 4 | 3 | 0 | 3 | 0 | 0 | 1 | `bo-m-suites-` 08–09, 17 ; `bo-m-logique-` 14 |
| `limites-suites` | 14 | 12 | 6 | 1 | 3 | 2 | 2 | `bo-m-suites-` 01–07, 10–12, 14–16, 18 |
| `limites-fonctions` | 9 | 8 | 4 | 2 | 2 | 0 | 1 | `bo-m-suites-` 13 ; `bo-m-limites-fonctions-` 01–08 |
| `continuite` | 10 | 7 | 3 | 2 | 0 | 2 | 3 | `bo-m-continuite-` 01–10 |
| `derivation-convexite` | 13 | 10 | 4 | 5 | 1 | 0 | 3 | `bo-m-derivation-` 01–13 |
| `vecteurs-espace` | 15 | 13 | 7 | 6 | 0 | 0 | 2 | `bo-m-vecteurs-` 01–15 |
| `logarithme` | 12 | 10 | 5 | 2 | 2 | 1 | 2 | `bo-m-logarithme-` 01–12 |
| `orthogonalite-espace` | 16 | 13 | 8 | 4 | 1 | 0 | 3 | `bo-m-orthogonalite-` 01–16 |
| `equations-espace` | 11 | 7 | 2 | 4 | 1 | 0 | 4 | `bo-m-representations-` 01–11 |
| `denombrement` | 16 | 15 | 8 | 2 | 2 | 3 | 1 | `bo-m-denombrement-` 01–16 |
| `loi-binomiale` | 14 | 12 | 4 | 4 | 1 | 3 | 2 | `bo-m-bernoulli-` 01–14 |
| `trigonometrie` | 4 | 3 | 1 | 2 | 0 | 0 | 1 | `bo-m-trigonometrie-` 01–04 |
| `primitives-equations-differentielles` | 10 | 9 | 3 | 3 | 2 | 1 | 1 | `bo-m-primitives-` 01–10 |
| `integration` | 21 | 19 | 8 | 6 | 2 | 3 | 2 | `bo-m-integrale-` 01–21 |
| `sommes-variables-aleatoires` | 19 | 15 | 7 | 4 | 1 | 3 | 4 | `bo-m-sommes-` 01–09 ; `bo-m-concentration-` 01–10 |
| `methodes-maths` (transverse) | 17 | 17 | 3 | 14 | 0 | 0 | 0 | `bo-m-listes-` 01–04 ; `bo-m-logique-` 01–13 |

Répartitions qui s'écartent de la section du BO, avec leur raison :

- La section « Suites » du BO est partagée : la récurrence et la modélisation
  (`bo-m-suites-08`, `-09`, l'approfondissement `-17` sur les récurrences linéaires d'ordre 2)
  et « démontrer une propriété par récurrence » (`bo-m-logique-14`) vont à
  `recurrence-suites` ; la démonstration « Limite en $+\infty$ et en $-\infty$ de la fonction
  exponentielle » (`bo-m-suites-13`) va à `limites-fonctions`, qui définit la limite d'une
  fonction ; le reste des limites de suites à `limites-suites`.
- L'étude de $u_{n+1} = f(u_n)$ avec $f$ continue (`bo-m-continuite-05`) est dans la section
  « Continuité » : elle va à `continuite`, pas aux chapitres de suites.
- « Application à l'espérance, la variance et l'écart type de la loi binomiale »
  (`bo-m-sommes-03`) et sa démonstration (`bo-m-sommes-08`) sont dans « Sommes de variables
  aléatoires » : elles vont à `sommes-variables-aleatoires`, pas à `loi-binomiale`.
- `bo-m-suites-15` (valeurs approchées de $\pi$, $e$, $\sqrt{2}$, …, $\ln(2)$) reste à
  `limites-suites` ; l'exemple de $\ln(2)$ ne peut être traité qu'après `logarithme`.

## 6. Limites posées par le programme lui-même (citations)

Elles valent pour tout contenu : ce qui est « admis » se présente comme admis, ce qui
« n'est pas un objectif » ou « pas un attendu » ne s'exige jamais (ni cours, ni exercice qui
le demande).

- Organisation : « Ce découpage n'est pas un plan de cours » ; « Le programme propose un
  certain nombre d'approfondissements possibles, mais en aucun cas obligatoires. »
- Géométrie : « L'étude générale des systèmes linéaires n'est pas un objectif du programme
  mais des exemples seront traités dans le contexte de la géométrie repérée : décomposition
  de vecteurs, intersections de plans, etc. » ; en géométrie repérée, le repère est celui
  « qu'on supposera orthonormé ».
- Analyse : « On explicite ensuite les définitions mais la maîtrise complète du formalisme
  n'est pas un attendu. » ; « L'intégrale est introduite à partir de la notion intuitive
  d'aire, sur laquelle on ne soulève aucune difficulté théorique. »
- Limites des fonctions : « Les opérations sur les limites sont admises. L'utilisation de la
  composition des limites se fait en contexte. »
- Continuité : « La justification de la continuité ou de la dérivabilité d'une fonction sur
  un intervalle n'est pas un objectif du programme. Hormis pour la fonction exponentielle,
  l'étude de la réciproque d'une fonction continue n'est pas au programme. »
- Primitives, équations différentielles : « Il est utile d'admettre ici que toute fonction
  continue sur un intervalle admet des primitives, résultat qui est démontré dans la section
  sur le calcul intégral. On note aussi que, pour certaines fonctions, on ne dispose pas de
  primitive explicite. » ; « Lorsque $b = 0$, on remarque que la somme de deux solutions et
  le produit d'une solution par une constante sont encore solutions. » ; « on peut donner
  d'autres exemples d'équations différentielles, dont on peut donner des solutions sans en
  faire de résolution complète : $y' = y^2$, $y'' + \omega^2 y = 0$. Aucune connaissance
  n'est exigible sur ces exemples. »
- Probabilités : « L'univers est formalisé par $\{0,1\}^n$ (ou $\{a,b\}^n$) mais il importe
  d'exploiter la représentation à l'aide d'arbres » ; « l'indépendance étant prise ici au
  sens d'indépendance mutuelle ».
- Sommes de variables aléatoires : la linéarité de l'espérance, « Le professeur peut choisir
  de l'admettre, ou de la justifier sur un exemple. » ; « Les variables indépendantes
  considérées dans le programme sont toujours envisagées dans le cadre de la succession
  d'épreuves indépendantes. L'hypothèse d'indépendance étant constitutive du modèle
  considéré, toute question visant à justifier l'indépendance de variables aléatoires
  données a priori est en dehors des objectifs du programme. » ; « L'additivité de la
  variance pour la somme de deux variables indépendantes est admise. La relation
  $E(XY) = E(X)E(Y)$ pour des variables indépendantes n'est pas un attendu du programme. »
- Algorithmique : « le programme reprend les programmes de seconde et de première sans
  introduire de notion nouvelle » ; « Afin d'éviter des confusions, on se limite aux listes
  sans présenter d'autres types de collections. »
- Vocabulaire : « La composition de deux fonctions est utilisée principalement dans le cadre
  des fonctions d'une variable réelle. » ; « Le symbole de somme Σ peut être introduit et
  utilisé pour écrire certaines expressions de façon concise, mais la manipulation de ce
  symbole pour démontrer des égalités n'est pas un objectif du programme. » ; « (les
  symboles ∀ et ∃ ne sont pas exigibles) ».

## 7. Hors programme

Interdit dans tout contenu de `/terminale/maths` (cours, exercices, type bac, mémo,
questions éclair), sauf mention contraire :

1. **Tout ce qui ne se rattache à aucune ligne** de `programme.json` ni aux acquis de
   première (programme de première de 2019, § 2).
2. **Les approfondissements possibles** (32 lignes `exigible: false`) : jamais exigés ;
   seulement dans un bloc `complement` du cours ou un exercice de marche 3 (charte § 3.1).
3. **Ce que le programme exclut lui-même** (§ 6) : étude générale des systèmes linéaires ;
   justification de la continuité ou de la dérivabilité sur un intervalle ; étude de la
   réciproque d'une fonction continue, hormis l'exponentielle (dont la réciproque est ln) ;
   résolution de $y' = y^2$ ou $y'' + \omega^2 y = 0$ ; justification de
   l'indépendance de variables aléatoires données a priori ; $E(XY) = E(X)E(Y)$ ; démonstration
   d'égalités par manipulation de Σ ; symboles ∀ et ∃ exigés ; collections Python autres que
   les listes.
4. **Les options de terminale**, programmes distincts du même BO spécial n° 8 :
   mathématiques expertes (NOR MENE1921264A), dont les parties sont « Nombres complexes »,
   « Arithmétique », « Graphes et matrices » ; mathématiques complémentaires
   (NOR MENE1921265A). Rien de ces programmes s'il n'est pas aussi dans `programme.json`.
5. **Le logarithme décimal** : **absent** du programme de spécialité (aucune occurrence dans
   l'annexe ; la seule fonction logarithme est « Fonction logarithme népérien, notée ln »).
   Dans le BO spécial n° 8 de 2019, il figure au programme de mathématiques de la voie
   **technologique** (« Fonction logarithme décimal ») et à celui de physique-chimie et
   mathématiques des séries technologiques, pas en spécialité générale ni dans les deux
   options. → **Hors programme** : ni `log`, ni « log décimal » en maths de terminale.
6. **Le programme de 2026** (arrêté du 26-2-2026, rentrée 2027-2028) : rien qui n'est que
   dans lui.

## 8. Notations du programme

| Objet | Dans le BO | Remarque |
|---|---|---|
| Fonction | « ƒ », `$f$` dans `programme.json` | Charte § 10 pour le contenu |
| Composée | $v \circ u$, $(v \circ u)' = (v' \circ u) \times u'$ | |
| Limite d'une suite | $(u_n)$ converge vers $\ell$ ; intervalle $[A;+\infty[$ | |
| Intégrale, primitive | $\int_a^b f(x)\,\mathrm{d}x$ ; $\left[F(x)\right]_a^b$ ; $F_a(x) = \int_a^x f(t)\,\mathrm{d}t$ | |
| Coefficient binomial | $\dbinom{n}{k}$ ; $n!$ | |
| Loi binomiale | $\mathcal{B}(n,p)$ | Charte § 10 : `\mathcal{B}(n\,;\,p)` dans le contenu |
| Intervalles | $[a,b]$, $[-\pi,\pi]$ | Charte § 10 : `[a\,;\,b]` dans le contenu |
| Plan | $\mathcal{P}$ ; vecteur normal $\vec{n}$ ; norme $\lVert \vec{u} \rVert$ | |
| Probabilités | $P(X = k)$, $P(X \leqslant k)$, $P(X \in I)$ ; espérance $\mu$, écart type $\sigma$ ; $E(X)$, $V(X)$ | |
| Échantillon | $(X_1,\dots,X_n)$, $S_n = X_1 + \dots + X_n$, $M_n = S_n/n$ | |
| Complémentaire | « la notation des probabilités $\bar{A}$, ou la notation $E \setminus A$ » | |
| Ensembles | « $\in$, $\subset$, $\cap$, $\cup$, ainsi que la notation des ensembles de nombres et des intervalles » | |
| Quantificateurs | « les symboles ∀ et ∃ ne sont pas exigibles » | on peut les employer, jamais les exiger |
| Algorithmes | « Les algorithmes peuvent être écrits en langage naturel ou utiliser le langage Python. On utilise le symbole « ← » pour désigner l'affection [sic] dans un algorithme écrit en langage naturel. » | Python : listes seulement |

## 9. Ce qui reste ouvert

- **Première « en vigueur »** en 2027 (§ 2) : à surveiller (sujets zéro, précisions
  officielles éventuelles).
- **Articulation des 2 points de maîtrise de la langue** avec les 4 à 8 points de chaque
  exercice : non précisée par la note (§ 3.1).
- **Priorités des notions** : mesurées par l'index des annales (`annales-indexeur`), en
  tenant compte du § 4.
- **Couverture des exemples d'algorithme** (§ 5.1) : à confirmer par le chapitre pilote.
