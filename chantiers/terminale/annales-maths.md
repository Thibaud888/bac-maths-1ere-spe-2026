# Maths de terminale : ce qui tombe vraiment au bac

> Index construit le 2026-09-28 (`content/terminale/maths/annales.json`, `complet: true`).
> Chiffres : `node scripts/frequences-annales.mjs maths [<chapitre>]`. Charte § 3.2 et § 5.1.

## En bref

On a relu **tous les sujets de spécialité publiés depuis 2021**, soit 103 sujets et 423
exercices, tous lieux d'examen compris. Pour chaque exercice, on a noté les lignes du
programme qu'il demande vraiment et une à trois formulations exactes (« Démontrer par
récurrence que… »). Une notion compte dans un sujet dès qu'une de ses lignes y est
mobilisée, **seulement parmi les sujets où elle pouvait tomber** : 2021 à 2023 excluaient
une partie du programme (référentiel maths § 4).

## Par chapitre (2026-09-28)

| Chapitre | Tombé | Part |
|---|---|---|
| Représentations paramétriques et équations cartésiennes | 103 / 103 | 100 % |
| Orthogonalité et distances dans l'espace | 102 / 103 | 99 % |
| Épreuves indépendantes, loi binomiale | 102 / 103 | 99 % |
| Limites de suites | 101 / 103 | 98 % |
| Compléments sur la dérivation, convexité | 98 / 103 | 95 % |
| Continuité, théorème des valeurs intermédiaires | 95 / 103 | 92 % |
| Raisonnement par récurrence et suites | 93 / 103 | 90 % |
| Vecteurs, droites et plans de l'espace | 91 / 103 | 88 % |
| Fonction logarithme népérien | 91 / 103 | 88 % |
| Limites de fonctions | 90 / 103 | 87 % |
| Calcul intégral | 44 / 51 | 86 % |
| Primitives, équations différentielles | 66 / 103 | 64 % |
| Sommes de variables aléatoires, concentration | 40 / 63 | 63 % |
| **Combinatoire et dénombrement** | **25 / 63** | **40 %** |
| Méthodes (logique, listes Python) | 19 / 103 | 18 % |
| Fonctions sinus et cosinus | 9 / 51 | 18 % |

Lecture : à l'échelle du chapitre, presque tout est « incontournable » ; la priorité qui
s'affiche sur le site est celle de la **notion** (plus fine), calculée chapitre par chapitre
par `tle-architecte` avec ce script. Le dénombrement tombe dans 4 sujets sur 10 où il
pouvait tomber, surtout par les combinaisons ($\binom{n}{k}$, 29 %) et les dénombrements
simples (33 %) ; ses démonstrations et algorithmes n'ont jamais été demandés.

## Les sujets indexés

Source : les pages annuelles de l'APMEP (`https://www.apmep.fr/Annee-<année>`), qui
reproduisent les sujets officiels ; liste et téléchargement par
`node scripts/annales-apmep.mjs 2021 … 2026 --sortie <dossier>` (sujet seulement, jamais le
corrigé). Écartés : les « sujets 0 » (2021, 2024 : pas des épreuves) et les recueils
annuels. Deux sujets sans source LaTeX (Polynésie septembre 2024, Métropole septembre 2026)
ont été lus dans le texte extrait du PDF.

- **2021** (12 sujets, programme partiel) : Sujet 1 prévu le 15 mars 2021 (épreuve annulée) ; Sujet 2 prévu le 15 mars 2021 (épreuve annulée) ; Amérique du Nord, mai 2021 ; Polynésie, 2 juin 2021, épreuve n° 2 ; Asie, jour 1, 7 juin 2021 ; Asie, jour 2, 8 juin 2021 ; Métropole, jour 1 (candidats libres, 7 juin 2021) ; Métropole, jour 2 (candidats libres, 8 juin 2021) ; Centres étrangers, jour 1 (candidats libres, 9 juin 2021) ; Centres étrangers, jour 2 (candidats libres, 10 juin 2021) ; Métropole, septembre, jour 1 (candidats libres, 13 septembre 2021) ; Métropole, septembre, jour 2 (candidats libres, 13 septembre 2021).
- **2022** (19 sujets, programme partiel) : Polynésie, jour 1 (4 mai 2022) ; Polynésie, jour 2 (5 mai 2022) ; Métropole, jour 1 (11 mai 2022) ; Métropole, jour 2 (12 mai 2022) ; Centres étrangers, jour 1 (11 mai 2022) ; Centres étrangers, jour 2 (12 mai 2022) ; Asie, jour 1 (17 mai 2022) ; Asie, jour 2 (18 mai 2022) ; Centres étrangers groupe 1 (dont Liban, Madagascar, Mayotte), jour 1 (18 mai 2022) ; Centres étrangers groupe 1 (dont Liban, Madagascar), jour 2 (19 mai 2022) ; Amérique du Nord, jour 1 (18 mai 2022) ; Amérique du Nord, jour 2 (19 mai 2022) ; Polynésie, jour 1 (30 août 2022) ; Métropole, Antilles-Guyane, jour 1 (8 septembre 2022) ; Métropole, Antilles-Guyane, jour 2 (9 septembre 2022) ; Amérique du Sud, jour 1 (26 septembre 2022) ; Amérique du Sud, jour 2 (27 septembre 2022) ; Nouvelle-Calédonie, jour 1 (26 octobre 2022) ; Nouvelle-Calédonie, jour 2 (27 octobre 2022).
- **2023** (21 sujets, programme partiel) : Centres étrangers groupe 1, jour 1 ; Centres étrangers groupe 1, jour 2 ; Polynésie, jour 1 ; Polynésie, jour 2 ; Métropole, Antilles-Guyane, Maroc, jour 1 ; Métropole, Antilles-Guyane, Maroc, jour 2 ; Centres étrangers groupe 2 (Europe), jour 1 ; Centres étrangers groupe 2 (Europe), jour 2 ; Asie, jour 1 ; Asie, jour 2 ; Amérique du Nord, jour 1 ; La Réunion, jour 1 ; Amérique du Nord, jour 2 ; La Réunion, jour 2 ; Nouvelle-Calédonie, jour 1 ; Nouvelle-Calédonie, jour 2 ; Métropole, Antilles-Guyane, jour 1 (11 septembre 2023) ; Métropole, La Réunion, jour 2 (12 septembre 2023) ; Polynésie, jour 1 (7 septembre 2023) ; Amérique du Sud, jour 1 ; Amérique du Sud, jour 2.
- **2024** (18 sujets, programme complet) : Amérique du Nord, jour 1 ; Amérique du Nord, jour 2 ; Centres étrangers (Europe), jour 1 ; Centres étrangers (Europe), jour 2 ; Centres étrangers (Suède), jour 1 bis ; Asie, jour 1 ; Asie, jour 2 ; Métropole, Antilles-Guyane, jour 1 ; Métropole, Antilles-Guyane, jour 1 (secours) ; Métropole, Antilles-Guyane, jour 2 ; Métropole, Antilles-Guyane, jour 2 (sujet dévoilé) ; Polynésie, jour 1 ; Polynésie, jour 2 ; Polynésie, jour 1 (septembre) ; Métropole, Antilles-Guyane, jour 1 (septembre) ; Métropole, Antilles-Guyane, jour 2 (septembre) ; Amérique du Sud, jour 1 ; Amérique du Sud, jour 2.
- **2025** (19 sujets, programme complet) : Amérique du Nord, jour 1 ; Amérique du Nord, jour 2 ; Amérique du Nord, jour 2 (secours) ; Asie, jour 1 ; Asie, jour 2 ; Centres étrangers, jour 1 ; Centres étrangers, jour 2 ; Métropole, jour 1 ; Métropole, jour 2 ; Polynésie, jour 1 ; Polynésie, jour 2 ; Polynésie, jour 1 (septembre) ; Asie, jour 1 (septembre) ; Métropole, jour 1 (septembre) ; Métropole, jour 2 (septembre) ; Amérique du Sud, jour 1 ; Amérique du Sud, jour 2 ; Nouvelle-Calédonie, jour 1 ; Nouvelle-Calédonie, jour 2.
- **2026** (14 sujets, programme complet) : Amérique du Nord, jour 1 ; Amérique du Nord, jour 2 ; Asie, jour 1 ; Asie, jour 2 ; Centres étrangers, jour 1 ; Centres étrangers, jour 2 ; Antilles-Guyane, jour 1 ; Antilles-Guyane, jour 2 ; Polynésie, jour 1 ; Polynésie, jour 2 ; Métropole, jour 1 (juin) ; Métropole, jour 2 (juin) ; Métropole, La Réunion, jour 1 (septembre) ; Métropole, jour 2 (septembre).

**Formats particuliers** relevés dans les sujets : en 2021, un exercice au choix (A ou B,
indexés tous les deux, « (au choix) » dans le titre) ; en 2022, le candidat traite 3
exercices parmi 4 (7 points chacun) ; groupe 1 des centres étrangers 2022 : 6 points par
exercice plus 2 de rédaction.

**Tenir l'index à jour** : les sessions de novembre 2026 (Amérique du Sud,
Nouvelle-Calédonie) ne sont pas encore passées. Quand elles sont publiées, repasser
`complet` à `false`, indexer (agent `annales-indexeur`, même consigne), puis le remettre à
`true`.

## Règles de rattachement (communes aux 12 lots)

- **Arbres pondérés, probabilités conditionnelles, probabilités totales** dans une
  succession de deux ou trois épreuves : `bo-m-bernoulli-05` (son texte le cite). Épreuves
  **indépendantes** répétées : `bo-m-bernoulli-01` et/ou `-05` ; schéma de Bernoulli, loi
  binomiale : `-03`, `-04`, `-06`, puis `-07` / `-08` selon la question.
- **Python** : `bo-m-listes-*` seulement si le programme manipule vraiment une liste ; une
  boucle ou une fonction sans liste se rattache à la ligne d'algorithme du chapitre (seuil
  d'une suite, dichotomie…) si elle existe, sinon à rien.
- **Distance d'un point à un plan** : `bo-m-orthogonalite-*` de la distance et du projeté
  orthogonal, même si le calcul passe par un volume.
- Une intersection de deux plans demandée au bac se rattache aux lignes exigibles
  (`bo-m-vecteurs-*`, `bo-m-representations-*` des positions relatives et des systèmes), pas
  à l'approfondissement non exigible.
- Lieu et date : **l'en-tête du sujet fait foi** ; si le libellé APMEP diffère, suis
  l'en-tête et signale l'écart dans « Doutes ».
- **Exercices au choix** (sujets 2021 : « exercice A » / « exercice B ») : numérote-les à la
  suite (4 puis 5), indexe-les tous deux et ajoute « (au choix) » à leur `titre`.
- **Barème à plusieurs versions** (ex. Madagascar : 6 points + rédaction) : les points de la
  version principale de l'en-tête ; signale la variante dans « Doutes ».
- Ligne d'une partie exclue à cette session mais réellement demandée : cite-la quand même
  (l'orchestrateur décide du décompte) et signale-le.

S'y ajoutent, appliqués par les indexeurs : une ligne de **démonstration** n'est citée que
si la question demande la preuve (sinon la ligne du résultat) ; `bo-m-derivation-05` (dérivée
d'une composée) seulement pour une vraie composée ; les notions de première seule (dérivée
usuelle, probabilités conditionnelles hors succession d'épreuves, espérance d'une loi
finie, suites arithmétiques et géométriques) ne sont rattachées à rien.

## Doutes laissés ouverts (sans effet sensible sur les chiffres)

- **Seuils** (« plus petite valeur de $n$ ») : rattachés à `bo-m-logarithme-06` quand la
  résolution par $\ln$ est attendue, à `bo-m-suites-14` pour l'algorithme de seuil ; selon
  les lots, les seuils à méthode libre ont été mis à l'un ou l'autre.
- **Lignes non exigibles** citées par certains lots quand la question en est l'objet
  (intersection de deux plans `bo-m-representations-08`, méthode de Héron
  `bo-m-suites-18`, équation logistique `bo-m-primitives-09`), pas par d'autres.
- **Lignes d'une partie exclue** réellement demandées (espérance $np$, `bo-m-sommes-03`, en
  2022-2023) : gardées dans l'index, ignorées par le décompte (le sujet est `partiel`).
- **Dates d'en-tête** discordantes avec l'APMEP : Amérique du Nord jour 1 2022 (en-tête
  « 2021 »), Métropole septembre jour 2 2026 (en-tête « 2025 »), Antilles-Guyane jour 1 2026
  (en-tête « 16 juillet ») ; identifiants et années de l'APMEP gardés.
- **Figures absentes du texte** (tableaux de variations dessinés) : leurs limites
  éventuelles ne sont pas comptées (Asie jour 2 2026 ex. 1, Polynésie jour 1 2025 ex. 3,
  Nouvelle-Calédonie jour 1 2022 ex. 2).
- Asie jour 1 2023, exercice 4 (5 points) : QCM de probabilités de première seule, écarté.
