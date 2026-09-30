---
name: bac-physique-chimie-terminale-2027
description: Référentiel officiel de la physique-chimie de terminale (spécialité, voie générale) pour le bac session 2027 — programme en vigueur en 2026-2027 (annexe de l'arrêté du 19 juillet 2019, BO spécial n° 8 du 25 juillet 2019), ligne par ligne et au mot près dans content/terminale/physique-chimie/programme.json, avec les capacités expérimentales, numériques et mathématiques et les notions de première mobilisables (bo-pc1-…) ; format de la partie écrite, de la partie pratique et de l'oral de contrôle (note de service du 11 septembre 2026, BO spécial n° 4 du 17 septembre 2026) ; programme évalué à chaque session depuis 2021 ; limites posées par le programme ; hors programme ; notations. À lire, après la charte terminale-charte, avant toute création ou relecture de contenu sous /terminale/physique-chimie (agents tle-*, annales-indexeur).
---

# Physique-chimie de terminale (spécialité) — référentiel, session 2027

> Écrit le 2026-09-30, **texte officiel en main** : chaque affirmation ci-dessous vient d'un
> PDF téléchargé ce jour-là sur `education.gouv.fr` (§ 1), rien de mémoire. Les citations
> sont entre guillemets et exactes (apostrophe droite).
>
> Ordre de lecture pour un agent : la charte `.claude/skills/terminale-charte/SKILL.md` →
> ce fichier → `content/terminale/physique-chimie/programme.json` (les lignes du chapitre
> traité).

## 0. Ce qu'il contient et comment s'en servir

| Besoin | Où |
|---|---|
| Les lignes du programme (identifiants `bo-pc-…` et `bo-pc1-…`, texte exact, chapitre, rubrique) | `content/terminale/physique-chimie/programme.json` (schéma `schemas/terminale/programme.schema.json`) |
| Le programme en vigueur | § 2 |
| **Format de l'épreuve** (écrit, partie pratique, oral de contrôle) | § 3 |
| Ce qui pouvait tomber à chaque session depuis 2021 (pour les annales) | § 4 |
| Comment le programme a été découpé en lignes, et quel chapitre porte quoi | § 5 |
| Les limites que le programme pose lui-même | § 6 |
| Le hors programme | § 7 |
| Notations et conventions | § 8 |
| Ce qui reste ouvert | § 9 |
| Le texte officiel brut, pour vérifier | `texte-officiel/` (ce dossier) |

Contrôle automatique : `node scripts/programme-conforme.mjs physique-chimie` vérifie que
chaque ligne de `programme.json` reprend **mot pour mot** le texte officiel enregistré dans
`texte-officiel/programme-2019.txt`. `validate-content.mjs` l'appelle, donc
`node scripts/verify.mjs` aussi. Un identifiant publié ne change plus (charte § 2.2) ; le
champ `chapitre` peut, lui, être réattribué par `tle-architecte` si le découpage change.

## 1. Sources (téléchargées le 2026-09-30)

Les pages HTML du Bulletin officiel refusent les sessions Cloud ; les **PDF** du même site
s'ouvrent (`docs/sources-officielles.md`). Toutes les citations viennent de ces PDF.

| Texte | Référence | Fichier ouvert |
|---|---|---|
| **Programme de spécialité de terminale** (en vigueur en 2026-2027) | Arrêté du 19-7-2019, NOR MENE1921249A, BO spécial n° 8 du 25-7-2019 (p. 487-509) | `https://www.education.gouv.fr/sites/default/files/document/SP8_MENJ_1159506.pdf-232677.pdf` |
| **Épreuve de spécialité physique-chimie, à partir de 2027** | Note de service du 11-9-2026, NOR MENE2622644N, BO spécial n° 4 du 17-9-2026 (p. 117-119) | `https://www.education.gouv.fr/sites/default/files/document/20260917boenjsspe4pdf-520753.pdf` (page en ligne : `https://www.education.gouv.fr/bo/2026/Special4/MENE2622644N`) |
| Épreuve à partir de la session 2021 (abrogée en 2027) | Note de service n° 2020-031 du 11-2-2020, NOR MENE2001798N, BO spécial n° 2 du 13-2-2020 (p. 37-40) | `https://www.education.gouv.fr/sites/default/files/imported_files/documents/BOspe2_MENJ_1244589.pdf` |
| Périmètre à partir de la session 2022 | Note de service du 12-7-2021, NOR MENE2121275N, BO n° 30 du 29-7-2021 (p. 587-588) | `https://www.education.gouv.fr/sites/default/files/document/BO_30_MENJS_1416615.pdf-309180.pdf` |
| Programme d'examen à partir de la session 2023 | Note de service du 29-9-2022, NOR MENE2227884N, BO n° 36 du 30-9-2022 (p. 53, § 10 p. 58-59) | `https://www.education.gouv.fr/sites/default/files/document/BOENJ_36_ok_5_1428730.pdf-329304.pdf` |
| Programme d'examen à partir de la session 2024 | Note de service du 26-9-2023, NOR MENE2323020N, BO n° 36 du 28-9-2023 (p. 55) | `https://www.education.gouv.fr/sites/default/files/document/Bulletin%20officiel%20n%C2%B0%2036%20du%2028%20septembre%202023-366075.pdf` |
| Nouveaux programmes de 2026 (maths seulement) | BO n° 14 du 2-4-2026 : sept arrêtés du 26-2-2026, tous de mathématiques | `https://www.education.gouv.fr/sites/default/files/document/Bulletin%20officiel%20n%C2%B0%2014%20du%202%20avril%202026-515432.pdf` |

Extractions gardées dans `texte-officiel/` : `programme-2019.txt` (pages 487 à 509 du BO,
tableaux lus colonne par colonne ; « / » en début de ligne = italique, « * » = gras) et
`note-epreuve-2026.txt` (la note MENE2622644N et sa grille annexe).

## 2. Le programme en vigueur pour la session 2027

- Programme : **annexe de l'arrêté du 19 juillet 2019** (« Programme de physique-chimie de
  terminale générale »). Article 2 : « Les dispositions du présent arrêté entrent en vigueur
  à la rentrée scolaire 2020. »
- Aucun texte lu ne le remplace : le BO n° 14 du 2 avril 2026 ne publie que des programmes
  de mathématiques (sommaire relu). Pour la session 2027, **c'est l'annexe de 2019**.
- La note de l'épreuve 2027 : « L'épreuve porte sur les notions, contenus, capacités et
  compétences figurant au programme de l'enseignement de spécialité de la classe de
  terminale en vigueur. Les notions rencontrées en classe de première mais non approfondies
  en classe de terminale, doivent être connues et mobilisables. Elles ne peuvent cependant
  pas constituer un ressort essentiel du sujet. » ; « Les thématiques des sujets portent sur
  le programme de terminale et les compétences mobilisées sont celles du cycle terminal. »
- Le programme de terminale dit lui-même ce qui vient de première : chaque partie s'ouvre
  sur un paragraphe « Notions abordées en classe de première » (dix paragraphes, repris en
  lignes `bo-pc1-…`, § 5.1). C'est la liste des acquis de première que le site traite en
  blocs `rappel` (la physique-chimie de première n'a pas d'espace sur le site).
- Structure (préambule) : quatre thèmes, « Constitution et transformations de la
  matière », « Mouvement et interactions », « L'énergie : conversions et transferts »,
  « Ondes et signaux » ; plus une partie « Mesure et incertitudes » et une liste finale de
  « Capacités expérimentales ». « La présentation du programme n'impose pas l'ordre de sa
  mise en œuvre par le professeur ».

## 3. Format de l'épreuve

Source : note de service du 11-9-2026, NOR MENE2622644N (texte dans
`texte-officiel/note-epreuve-2026.txt`). « Elle entre en vigueur à compter de la session
2027. Elle abroge et remplace la note de service du 11 février 2020 modifiée
(NOR : MENE2001798N) ». Le coefficient est dans `content/bac/coefficients.json`
(`co-specialite-physique-chimie`), les dates dans `content/bac/calendrier.json` : ni l'un
ni l'autre n'est recopié ici.

### 3.1 Deux parties, une note

« L'épreuve de cette spécialité est constituée d'une partie écrite d'une durée de 3 heures
30 minutes et d'une partie pratique d'une durée de 1 heure. Chaque partie est notée sur
20 points. La note finale sur 20 points de l'épreuve de spécialité Physique-chimie est
obtenue en multipliant par 0,8 la note sur 20 points de la partie écrite et par 0,2 la note
sur 20 points de la partie pratique et en additionnant ces deux résultats. »

### 3.2 Partie écrite

| Élément | Texte officiel |
|---|---|
| Durée | « Durée : 3 heures 30 » |
| Structure | « La partie écrite comporte trois exercices indépendants et s'appuie de manière équilibrée sur différents thèmes des programmes. Le sujet accorde une place significative à la modélisation et à la résolution de questions avec prise d'initiative. » |
| Documents, expérience, numérique | « Les sujets traités lors de cette épreuve portent sur des situations contextualisées, peuvent contenir des documents et inclure des questions relatives aux aspects expérimentaux de la discipline et aux capacités numériques identifiées dans les programmes. » |
| Calculatrice | « Le sujet précise si l'usage de la calculatrice, dans les conditions précisées par les textes en vigueur, est autorisé. » |
| Notation | « Cette partie est notée sur 20 points. La note finale est composée de la somme des points obtenus à chacun des exercices. » |
| Maîtrise de la langue | « La maîtrise de la langue est prise en compte à hauteur de deux points sur vingt, dédiés à la maîtrise des normes orthographiques et syntaxiques ainsi qu'à la capacité à formuler un raisonnement et à utiliser un vocabulaire juste et adapté. Les attendus et observables rédactionnels sont précisés dans la grille annexée à la présente note de service. » |

La grille annexée (« Attendus et observables rédactionnels ») est la même que pour les
maths : quatre critères (« Orthographe lexicale et grammaticale » ; « Syntaxe/construction
des phrases » ; « Lexique » ; « Mise en forme et organisation de la réflexion ») sur quatre
paliers, de « Très insuffisant » à « Très satisfaisant ». Palier « très satisfaisant » du
lexique : « Le lexique, notamment celui de la discipline, est riche et correctement
utilisé. »

**Ce que la note ne fixe pas** : le nombre de points de chaque exercice (seulement « trois
exercices » et un total sur 20), ni la part des documents. Ne pas inventer de fourchette.

**Ce que cela impose aux exercices type bac du site** (`tle-auteur-bac`, charte § 7) :

- un sujet complet = **trois exercices indépendants**, 3 h 30, sur des thèmes différents ;
  un exercice type bac du site = un exercice d'épreuve, **contextualisé**, avec documents
  quand la situation s'y prête, et au moins une question de modélisation ou de « prise
  d'initiative » par chapitre ;
- questions possibles sur les **aspects expérimentaux** (protocole, mesure, incertitude) et
  sur les **capacités numériques** (lire ou compléter un programme Python) ;
- `calculatrice` dit, exercice par exercice, si elle est permise : le sujet le précise, elle
  n'est pas toujours autorisée ;
- réponses rédigées, jugées aussi sur la langue : `attenduCorrecteur` nomme le raisonnement,
  le vocabulaire juste et l'unité, pas seulement le résultat ;
- la note ne dit pas comment les 2 points de langue s'articulent avec les points des
  exercices : ne pas l'inventer.

### 3.3 Partie pratique : évaluation des compétences expérimentales (ECE)

- « Durée : 1 heure » ; « Cette partie est notée sur 20 points. »
- « Elle s'appuie sur les compétences de la démarche scientifique, les capacités
  expérimentales et les activités expérimentales support de la formation identifiées dans
  les programmes de la spécialité physique-chimie du cycle terminal. » Dans
  `programme.json` : lignes `rubrique: "experimentale"` (les activités support, en italique
  dans le BO, et la liste finale `bo-pc-experimentales-…`).
- « le candidat est ainsi conduit à s'approprier une problématique de nature expérimentale,
  à mettre en œuvre ou à élaborer un protocole, à réaliser une ou plusieurs expériences, à
  valider sa démarche et à communiquer ses résultats. L'épreuve valorise l'autonomie et
  l'initiative du candidat. »
- « Le candidat tire au sort sa situation d'évaluation parmi un sous-ensemble, renouvelé par
  demi-journée, d'au moins deux situations d'évaluation à dominante physique et deux
  situations d'évaluation à dominante chimie. Le candidat prend connaissance du contenu de
  la situation à l'entrée dans la salle d'évaluation. » Situations tirées d'une « banque
  nationale ».
- Candidats individuels, du Cned et du privé hors contrat : « dispensés de cette épreuve
  pratique » (la note est alors celle de l'écrit).
- « Il n'y a pas d'épreuve de remplacement pour la partie pratique ».

### 3.4 Épreuve orale de contrôle (second groupe)

« Temps de préparation : 20 minutes » ; « Durée : 20 minutes » ; « Le programme sur lequel
peut porter l'épreuve orale de contrôle est identique au programme de l'épreuve écrite. » ;
« Le candidat tire au sort un sujet comportant deux questions, portant sur deux domaines de
natures différentes du programme, et doit traiter les deux questions. » ; « En fonction du
contenu du sujet tiré au sort par le candidat, l'examinateur décide si l'usage d'une
calculatrice est autorisé ou interdit. » ; « des questions puissent être posées sur le
matériel expérimental et son utilisation, sans que le candidat soit conduit à manipuler. »

## 4. Programme évalué, session par session (pour l'index des annales)

Tous les sujets depuis 2021 portent sur le **même programme** (annexe de 2019) ; seul le
**périmètre évaluable** a changé. L'`annales-indexeur` ne compte une ligne que dans les
sujets où elle **pouvait** tomber (README § 5.1). Format de la partie écrite identique
depuis 2021 (3 h 30, trois exercices, calculatrice selon le sujet) ; les 2 points de
langue sont nouveaux en 2027.

| Session | Texte | Périmètre de la partie écrite |
|---|---|---|
| 2021 | MENE2001798N (annexe) | Tout, sauf : « Modélisation microscopique » (cinétique) ; « B) Modéliser l'évolution temporelle d'un système, siège d'une transformation nucléaire » ; « C) Forcer le sens d'évolution d'un système » ; « 3. Modéliser l'écoulement d'un fluide » ; « B) Décrire la lumière par un flux de photons ». |
| 2022 | MENE2001798N + MENE2121275N (« complétées comme suit ») | Exclusions de 2021, plus : « Stratégie de synthèse multi-étapes » ; « Bilan thermique du système Terre-atmosphère. Effet de serre. » ; « Effet Doppler. Décalage Doppler. » |
| 2023 | MENE2227884N (§ 10, liste de ce qui **peut** être évalué) | Constitution : partie 1 en totalité ; cinétique « uniquement » « Suivi temporel et modélisation macroscopique » ; partie 3 « uniquement » état d'équilibre, équilibre dynamique, $Q_r$, $K(T)$, critère d'évolution, transformation spontanée d'oxydo-réduction, oxydants et réducteurs usuels, et « Comparer la force des acides et des bases » ; synthèse « uniquement » « Structure et propriétés » et « Optimisation d'une étape de synthèse ». Mouvement : « Décrire un mouvement » ; « Relier les actions appliquées à un système à son mouvement ». Énergie : gaz parfait ; premier principe « uniquement » énergie interne, aspects microscopiques, premier principe, capacité thermique, modes de transfert, flux et résistance thermiques. Ondes : intensité sonore et atténuation, diffraction, interférences (dont lumineuses) ; « Former des images » ; « Étudier la dynamique d'un système électrique ». |
| 2024, 2025, 2026 | MENE2323020N (« applicable à compter de la session 2024 ») | **Tout le programme** : « L'épreuve porte sur le programme de l'enseignement de spécialité de la classe de terminale en vigueur. Les notions du programme de la classe de première en vigueur peuvent être mobilisées dans le cadre de l'épreuve. » La note abroge les deux notes du 29-9-2022. |
| 2027 | MENE2622644N | **Tout le programme** (§ 2, § 3). |

Traduction en identifiants de `programme.json` (lignes exclues du décompte d'une session ;
les capacités d'une même ligne de tableau sont rattachées à la notion qu'elles traitent) :

| Exclusion | Sessions | Lignes |
|---|---|---|
| Modélisation microscopique (cinétique) | 2021, 2022, 2023 | `bo-pc-cinetique-` 07–09, 18–20 |
| Transformation nucléaire | 2021, 2022, 2023 | `bo-pc-nucleaire-*` |
| Forcer le sens d'évolution | 2021, 2022, 2023 | `bo-pc-forcer-evolution-*` |
| Écoulement d'un fluide | 2021, 2022, 2023 | `bo-pc-fluides-*` |
| Lumière et photons | 2021, 2022, 2023 | `bo-pc-photons-*` |
| Synthèse multi-étapes | 2022, 2023 | `bo-pc-synthese-` 14–21 |
| Bilan Terre-atmosphère, effet de serre | 2022, 2023 | `bo-pc-premier-principe-` 08, 17, 18 |
| Effet Doppler | 2022, 2023 | `bo-pc-ondes-` 21–26 |
| Piles (non listées en 2023) | 2023 | `bo-pc-sens-evolution-` 07–09, 16–20 |
| Loi phénoménologique de Newton (non listée en 2023) | 2023 | `bo-pc-premier-principe-` 09, 19, 20, 21 |

Partie pratique : en 2021 et 2022, mêmes notions exclues (sans la synthèse multi-étapes ni
le bilan Terre-atmosphère) et les capacités « Réaliser une pile et un circuit électrique
intégrant un électrolyseur. », « Utiliser un dispositif permettant d'étudier la poussée
d'Archimède. », « Mesurer une pression et une vitesse d'écoulement dans un gaz et dans un
liquide. », « Utiliser une cellule photovoltaïque. » ; en 2023, les mêmes plus « Suivre
l'évolution de la température d'un système » et « Mettre en œuvre un dispositif permettant
d'étudier l'effet Doppler en acoustique ». Depuis 2024 : tout.

Non relu : la note MENE2227884N dit synthétiser aussi des dispositions du « Bulletin
officiel n° 15 du 14 avril 2022 » (PDF non trouvé le 2026-09-30) ; il pourrait modifier le
périmètre de la session 2022.

## 5. Le programme découpé en lignes (`programme.json`)

**331 lignes** : **321 de terminale** (`bo-pc-…`, toutes exigibles : le programme n'a ni
« approfondissement » ni commentaire non exigible) — 116 notions et contenus, 117 capacités
exigibles, 80 capacités expérimentales, 10 capacités numériques, 8 capacités
mathématiques — et **10 acquis de première** (`bo-pc1-…`, `premiere: true`).

### 5.1 Règles de transcription

- **Mots exacts** du BO, dans l'ordre ; apostrophe droite (`'`). Les tableaux du BO ont
  deux colonnes : « Notions et contenus » → `rubrique: "contenu"` ; « Capacités exigibles »
  → selon la forme dans le BO :
  - texte droit → `capacite` ;
  - **italique** (« Activités expérimentales support de la formation ») → `experimentale` ;
  - « Capacité numérique : … » → `numerique` ; « Capacité(s) mathématique(s) : … » →
    `mathematique` (le préfixe est gardé dans le texte).
- **Une ligne = un paragraphe** d'une cellule du tableau (souvent une phrase ; parfois deux
  phrases du même paragraphe, comme dans le BO : « Identifier les produits formés […]. Relier
  la durée, […] »). Les intertitres en gras de la colonne de gauche (« Suivi temporel et
  modélisation macroscopique », « Deuxième loi de Newton »…) ne sont pas des lignes : ils
  sont dans `section`.
- La liste finale « Capacités expérimentales » (p. 508-509) : une ligne par puce
  (`bo-pc-experimentales-01` à `-45`) ; les trois capacités « communes à l'ensemble des
  thèmes » gardent leur minuscule initiale, sans le « ; » final.
- Chaque paragraphe « Notions abordées en classe de première » (ou « de seconde […] et de
  première », pour le nucléaire) = **une** ligne `bo-pc1-…` (`rubrique: "contenu"`, sans
  `chapitre`) : c'est une énumération, un bloc `rappel` cite la ligne entière.
- **Formules et espèces chimiques en LaTeX KaTeX**, relues sur l'image des pages :
  `$\mathrm{H_3O^+}$`, `$K_A$`, `$\mathrm{p}K_A$`, `$Q_r$`, `$K(T)$`, `$\gamma$`, le quotient
  $\dfrac{|m_{\text{mes}} - m_{\text{ref}}|}{u(m)}$, $\mathrm{pH} = -\mathrm{log}([\mathrm{H_3O^+}] / c^\circ)$.
  Les lettres α et β restent en caractères (le contrôle les lit dans le texte). La
  « Radioactivité γ » est perdue par l'extraction (glyphe) : écrite `$\gamma$`.
- **Une ligne** passe le contrôle mot à mot par exception déclarée
  (`texte-officiel/ecarts-admis.json`) : `bo-pc-force-acides-bases-14`, dont l'extraction
  mélange lettre à lettre le texte et les indices des formules chimiques.
- Pas repris en lignes : préambule, compétences de la démarche scientifique, repères pour
  l'enseignement, textes d'introduction des parties (leurs limites sont citées au § 6).

### 5.2 Rubriques et couverture exigée (charte § 9.2)

| Rubrique | Lignes | Couverture exigée |
|---|---|---|
| `contenu`, `capacite` | 116 + 117 | bloc formel + exercice + question éclair |
| `experimentale` | 80 | un bloc `experience` ou un exercice (entraînement complet : espace « épreuve pratique », phase 5) |
| `numerique` | 10 | un bloc de code + un exercice |
| `mathematique` | 8 | un exercice (chapitre « Méthodes » ou chapitre qui l'utilise) |
| `bo-pc1-…` (`premiere: true`) | 10 | rien d'exigé ; cités par les blocs `rappel` |

### 5.3 Qui porte quoi : lignes par chapitre

Découpage de `chantiers/terminale/chapitres-physique-chimie.md` (relu, § 9). La partie du
BO reste dans `section` ; `chapitre` dit où la ligne est enseignée.

| Chapitre | Lignes | contenu | capacité | expér. | numér. | math. | Identifiants |
|---|---|---|---|---|---|---|---|
| `acides-bases` | 9 | 4 | 4 | 1 | 0 | 0 | `bo-pc-acide-base-` 01–06 ; `bo-pc-methodes-physiques-` 01–03 |
| `mouvement` | 11 | 4 | 4 | 2 | 1 | 0 | `bo-pc-mouvement-` 01–10 ; `bo-pc-experimentales-` 21 |
| `analyse-physique` | 9 | 3 | 2 | 4 | 0 | 0 | `bo-pc-methodes-physiques-` 05–10 ; `bo-pc-experimentales-` 05, 06, 08 |
| `newton-champ-uniforme` | 22 | 9 | 9 | 3 | 1 | 0 | `bo-pc-newton-` 01–07 ; `bo-pc-champ-uniforme-` 01–13 ; `bo-pc-experimentales-` 19–20 |
| `titrages` | 12 | 3 | 3 | 5 | 1 | 0 | `bo-pc-methodes-chimiques-` 01–10 ; `bo-pc-experimentales-` 04, 09 |
| `satellites-planetes` | 7 | 4 | 2 | 0 | 1 | 0 | `bo-pc-gravitation-` 01–07 |
| `cinetique` | 20 | 9 | 8 | 2 | 1 | 0 | `bo-pc-cinetique-` 01–20 |
| `radioactivite` | 12 | 5 | 7 | 0 | 0 | 0 | `bo-pc-nucleaire-` 01–09, 11–13 |
| `ondes` | 32 | 9 | 9 | 13 | 1 | 0 | `bo-pc-ondes-` 01–04, 06–26 ; `bo-pc-experimentales-` 28–32, 39, 40 |
| `sens-evolution` | 30 | 13 | 11 | 6 | 0 | 0 | `bo-pc-sens-evolution-` 01–22 ; `bo-pc-forcer-evolution-` 01–07 ; `bo-pc-experimentales-` 10 |
| `force-acides-bases` | 18 | 5 | 9 | 2 | 2 | 0 | `bo-pc-force-acides-bases-` 01–12, 14–19 |
| `circuit-rc` | 19 | 6 | 5 | 8 | 0 | 0 | `bo-pc-electrique-` 01–15 ; `bo-pc-experimentales-` 24, 25, 42, 43 |
| `lunette-photons` | 26 | 7 | 9 | 10 | 0 | 0 | `bo-pc-images-` 01–08 ; `bo-pc-photons-` 01–11 ; `bo-pc-experimentales-` 33–38, 41 |
| `synthese-organique` | 28 | 9 | 10 | 9 | 0 | 0 | `bo-pc-synthese-` 01–21 ; `bo-pc-experimentales-` 07, 11–16 |
| `thermodynamique` | 27 | 11 | 12 | 4 | 0 | 0 | `bo-pc-gaz-parfait-` 01–05 ; `bo-pc-premier-principe-` 01–20 ; `bo-pc-experimentales-` 26–27 |
| `fluides` | 13 | 5 | 4 | 4 | 0 | 0 | `bo-pc-fluides-` 01–11 ; `bo-pc-experimentales-` 22–23 |
| `methodes-physique-chimie` (transverse) | 26 | 0 | 9 | 7 | 2 | 8 | `bo-pc-mesure-` 01–11 ; les 8 capacités mathématiques ; `bo-pc-experimentales-` 01–03, 17, 18, 44, 45 |

Répartitions qui s'écartent de la partie du BO, avec leur raison :

- **Capacités mathématiques** → `methodes-physique-chimie` (charte § 2.1), où qu'elles
  soient dans le BO : `bo-pc-methodes-physiques-04` et `bo-pc-ondes-05` (logarithme
  décimal), `bo-pc-force-acides-bases-13` (second degré), `bo-pc-mouvement-11` (dériver),
  `bo-pc-champ-uniforme-14` (équation différentielle, primitive, représentation
  paramétrique), `bo-pc-nucleaire-10`, `bo-pc-premier-principe-21`, `bo-pc-electrique-16`
  (équations différentielles linéaires du premier ordre). Le chapitre qui s'en sert y
  renvoie (`revoir`, `rappel`).
- **Mesure et incertitudes** (`bo-pc-mesure-*`, dont ses deux capacités numériques) →
  `methodes-physique-chimie`.
- **pH** (`bo-pc-methodes-physiques-01` à `-03`, partie 1.B du BO) → `acides-bases`, avec
  les couples acide-base ; le reste de 1.B (absorbance, conductivité, spectroscopies) →
  `analyse-physique`.
- **« Forcer le sens d'évolution »** (3.C) et « Stockage et conversion d'énergie chimique »
  → `sens-evolution`, avec les piles.
- **Liste finale « Capacités expérimentales »** : chaque puce va au chapitre qui fait
  pratiquer le geste (tableau ci-dessus) ; les règles de sécurité, l'élimination des
  déchets et les trois capacités communes vont à `methodes-physique-chimie`. Plusieurs
  puces portent sur des notions de **première** (lentilles, couleur, synthèse additive,
  spectre d'émission, perturbation mécanique) : elles sont rattachées au chapitre de
  terminale le plus proche (`lunette-photons`, `ondes`) et se traitent en bloc `experience`
  avec un `rappel`.

## 6. Limites posées par le programme lui-même (citations)

Elles valent pour tout contenu : ce que le programme écarte ne s'exige jamais.

- Organisation : « La présentation du programme n'impose pas l'ordre de sa mise en œuvre par
  le professeur, laquelle relève de sa liberté pédagogique. » ; « le langage de
  programmation conseillé est le langage Python. »
- Composition d'un système : « Une attention particulière est portée aux notations pour
  éviter la confusion entre grandeurs à l'équivalence et grandeurs à l'équilibre. »
- Cinétique : « La vitesse volumique, dérivée temporelle de la concentration de l'espèce, est
  privilégiée car elle est indépendante de la taille du système. » ; « La « vitesse de
  réaction », dérivée temporelle de l'avancement de réaction, n'est pas au programme. » ;
  « Les mécanismes réactionnels sont présentés comme des modèles microscopiques ».
- Nucléaire : en terminale, « il s'agit de passer de l'étude limitée au cas de durées
  discrètes (multiples entiers du temps de demi-vie) à une loi d'évolution d'une population
  de noyaux régie par une équation différentielle linéaire du premier ordre. »
- État final : « La notion de pression partielle n'étant pas abordée, on limite l'étude aux
  espèces liquides, solides ou dissoutes. Le quotient de réaction est adimensionné. » ; le
  critère d'évolution est appliqué « à des systèmes oxydant-réducteur » (piles) et « à des
  systèmes acide-base dans l'eau ».
- Mouvement : « Les aspects vectoriels, la dérivée d'un vecteur, le caractère algébrique des
  projections de l'accélération sont des objectifs importants de la partie « Décrire un
  mouvement ». »
- Ondes : « Pour l'étude de la diffraction et des interférences, on se limite au cas des
  ondes progressives sinusoïdales. »
- Mesure et incertitudes : le programme de terminale « introduit la notion d'incertitude-type
  composée » ; l'incertitude-type composée s'évalue « à l'aide d'une formule fournie ».
- Formules « fournies » ou « données » (ne jamais les exiger de mémoire) : relation de
  Bernoulli (« celle-ci étant fournie »), expression du champ d'un condensateur plan (« son
  expression étant donnée »), résistance thermique (« l'expression de la résistance
  thermique étant donnée »), loi de Stefan-Boltzmann (« étant donnée »), loi de Newton du
  refroidissement (« fournie »), différence de chemin optique (« l'expression linéarisée
  […] étant donnée »), interfrange (« l'expression donnée »), règles de nomenclature
  (« fournies »), mécanisme réactionnel (« fourni »), banque de réactions.

## 7. Hors programme

Interdit dans tout contenu de `/terminale/physique-chimie`, sauf mention contraire :

1. **Tout ce qui ne se rattache à aucune ligne** de `programme.json` (terminale ou
   `bo-pc1-…`).
2. **Ce que le programme exclut lui-même** (§ 6) : la « vitesse de réaction » (dérivée de
   l'avancement) ; la pression partielle et les quotients de réaction avec des gaz ;
   diffraction et interférences d'ondes non sinusoïdales ; exiger de mémoire une formule
   que le programme dit « fournie » ou « donnée ».
3. **Les programmes voisins du même BO** : « sciences physiques, complément de
   l'enseignement de spécialité de sciences de l'ingénieur » (NOR MENE1921269A, p. 510 et
   suivantes) ; physique-chimie et mathématiques des séries STI2D et STL. Rien de ces
   programmes s'il n'est pas aussi dans `programme.json`.
4. **Les notions de première comme ressort essentiel** d'un exercice type bac (§ 2) : elles
   sont mobilisables, jamais le cœur du sujet.
5. **Côté maths** : le logarithme décimal est une **capacité mathématique de
   physique-chimie** (`bo-pc-methodes-physiques-04`, `bo-pc-ondes-05`) et il est hors
   programme de la spécialité maths (référentiel maths § 7) : il s'enseigne ici, au chapitre
   « Méthodes », et un bloc « Et en maths ? » ne le présente pas comme un acquis de maths.

## 8. Notations et conventions

| Objet | Dans le BO | Dans `programme.json` |
|---|---|---|
| Espèces chimiques | H3O+, Cl-, NO3-(aq), CH3COOH(aq) (indices et exposants) | `$\mathrm{H_3O^+}$`, `$\mathrm{Cl^-(aq)}$` |
| pH | « pH = - log ([H3O+] / c°) avec c° = 1 mol·L-1 » | `$\mathrm{pH} = -\mathrm{log}\left([\mathrm{H_3O^+}] / c^\circ\right)$` |
| Constantes | KA, Ke, pKA, Qr, K(T) | `$K_A$`, `$K_e$`, `$\mathrm{p}K_A$`, `$Q_r$`, `$K(T)$` |
| Nucléaire | symbole A ZX, diagramme (N,Z), α, β, γ | `$^{A}_{Z}\mathrm{X}$`, (N,Z), α, β, `$\gamma$` |
| Incertitudes | $m_{\text{mes}}$, $m_{\text{ref}}$, $u(m)$ | idem |
| Unités | mol·L-1 | `$\mathrm{mol \cdot L^{-1}}$` |
| Programmation | « le langage de programmation conseillé est le langage Python » | code dans un champ `code` (charte § 3) |

Le contenu du site suit la charte § 10 (unités, chiffres significatifs, écriture des
grandeurs).

## 9. Ce qui reste ouvert

- **Bulletin officiel n° 15 du 14 avril 2022** (§ 4) : non relu ; ne touche que le
  périmètre de la session 2022.
- **Découpage** (`chapitres-physique-chimie.md`, relu le 2026-09-30) : trois points pour
  `tle-architecte` ou Thibaud — `force-acides-bases` utilise $K$ et $Q_r$ de
  `sens-evolution` (ordre inversé proposé) ; `analyse-physique` cite l'équation d'état du
  gaz parfait (`bo-pc-methodes-physiques-05`), enseignée dans `thermodynamique`, plus tard
  dans l'année ; `acides-bases` n'a que 9 lignes (fusion possible avec
  `force-acides-bases`).
- **Rattachement des capacités expérimentales** de la liste finale (§ 5.3) : proposition, à
  confirmer par le chapitre pilote et par l'espace « épreuve pratique » (phase 5).
- **Articulation des 2 points de maîtrise de la langue** avec les points des exercices : non
  précisée par la note (§ 3.2).
- **Priorités des notions** : mesurées par l'index des annales (`annales-indexeur`), en
  tenant compte du § 4.
