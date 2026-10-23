# Maths de terminale — découpage proposé

> **Proposition du 2026-09-24, relue le même jour texte officiel en main** (référentiel
> `.claude/skills/bac-maths-terminale-2027/`, lignes dans `content/terminale/maths/programme.json`) :
> le découpage tient — les 205 lignes du programme se répartissent sur ces 15 chapitres et
> `methodes-maths` — avec les corrections portées ci-dessous et résumées en fin de fichier
> (« Relecture texte en main »). Reste à confirmer par `tle-architecte`, chapitre par chapitre.
> Programme de référence : spécialité de terminale, **BO spécial n° 8 du 25 juillet 2019**,
> en vigueur jusqu'en 2026-2027 inclus (référentiel § 2).
>
> Les priorités sont des **estimations** (souvenir des sujets depuis 2021), à remplacer par le
> décompte des annales (`annales-indexeur`). **Index complet depuis le 2026-09-28** : chiffres
> par chapitre dans `annales-maths.md` ; la priorité de chaque notion se mesure au moment
> d'écrire le chapitre (`node scripts/frequences-annales.mjs maths <chapitre>`). Légende : ★★★ incontournable · ★★ fréquent ·
> ★ plus rare. Garde-fou de la charte (§ 5.1) : au plus la moitié des notions d'un chapitre
> en ★★★ tant que les annales ne l'ont pas mesuré — ici 17 notions sur 57.

## Ordre de l'année

**Décision du 2026-09-24 (Thibaud)** : le site suit l'ordre de l'année, sans progression de
classe fournie ; l'ordre ci-dessous est **une proposition** qui sert de base. C'est l'ordre
des parties du programme (suites, puis fonctions, géométrie dans l'espace, probabilités),
avec deux ajustements courants en classe : la continuité avant les compléments de dérivation
(le théorème des valeurs intermédiaires s'appuie sur elle), et la géométrie dans l'espace
intercalée tôt dans l'année pour ne pas tout reporter au printemps. **Thibaud dira quel
chapitre écrire d'abord** ; par défaut, le premier. Le champ `ordre` de `meta.json` porte
l'ordre retenu ; la navigation le suit.

| # | Slug | Chapitre | Domaine | Poids estimé |
|---|---|---|---|---|
| 1 | `recurrence-suites` | Raisonnement par récurrence et suites | Analyse | ★★★ |
| 2 | `limites-suites` | Limites de suites | Analyse | ★★★ |
| 3 | `limites-fonctions` | Limites de fonctions | Analyse | ★★★ |
| 4 | `continuite` | Continuité, théorème des valeurs intermédiaires | Analyse | ★★★ |
| 5 | `derivation-convexite` | Compléments sur la dérivation, convexité | Analyse | ★★★ |
| 6 | `vecteurs-espace` | Vecteurs, droites et plans de l'espace | Géométrie | ★★★ |
| 7 | `logarithme` | Fonction logarithme népérien | Analyse | ★★★ |
| 8 | `orthogonalite-espace` | Orthogonalité et distances dans l'espace | Géométrie | ★★★ |
| 9 | `equations-espace` | Représentations paramétriques et équations cartésiennes | Géométrie | ★★★ |
| 10 | `denombrement` | Combinatoire et dénombrement | Probabilités | ★★ |
| 11 | `loi-binomiale` | Épreuves indépendantes, loi binomiale | Probabilités | ★★★ |
| 12 | `trigonometrie` | Fonctions sinus et cosinus | Analyse | ★ |
| 13 | `primitives-equations-differentielles` | Primitives, équations différentielles | Analyse | ★★ |
| 14 | `integration` | Calcul intégral | Analyse | ★★ |
| 15 | `sommes-variables-aleatoires` | Sommes de variables aléatoires, concentration, loi des grands nombres | Probabilités | ★★ |

**Chapitre transverse `methodes-maths`** (page « Méthodes », hors liste des chapitres,
charte § 2.1) : rédiger au bac, vocabulaire ensembliste et logique, raisonnements
(contre-exemple, absurde, disjonction de cas), algorithmique et programmation en Python
(listes), calculatrice en mode examen (ce dernier point ne correspond à aucune ligne du
programme : à rattacher au format de l'épreuve, référentiel § 3, ou à retirer — à trancher
par `tle-architecte`).
Chaque chapitre porte en plus ses propres algorithmes du programme (seuil, dichotomie,
simulation…), en bloc « méthode » du cours et en exercices.

## Notions par chapitre (estimation)

Chaque notion : titre · priorité estimée · ce que le bac demande typiquement.

### 1. Raisonnement par récurrence et suites
- Raisonnement par récurrence · ★★★ · « Démontrer par récurrence que pour tout entier n… »
- Suites majorées, minorées, bornées · ★★ · « Montrer que 0 ≤ uₙ ≤ uₙ₊₁ ≤ 2 »
- Suites définies par une fonction uₙ₊₁ = f(uₙ) · ★★ · étude via le sens de variation de f
- Algorithme : calcul de termes (Python) · ★★ · « Compléter la fonction Python… » (la
  « Recherche de seuils » du programme est au ch. 2)
- Inégalité de Bernoulli : démontrée par récurrence, mais sa ligne du programme (« Limite de
  (qⁿ), après démonstration par récurrence de l'inégalité de Bernoulli ») est au ch. 2
- Relu : ce chapitre ne porte que **3 lignes exigibles** (raisonner par récurrence, phénomènes
  d'évolution, démontrer par récurrence) ; « suites majorées, minorées, bornées » n'est pas une
  ligne du programme de terminale.
- **Décision du 2026-10-01 (Thibaud)** : le chapitre **reste seul**, il n'est pas fusionné
  avec `limites-suites` (ch. 2).
- **Cours écrit le 2026-10-01** (`content/terminale/maths/chapitres/recurrence-suites/`,
  domaine `analyse`) : 3 notions, priorités mesurées (sujets depuis 2021) — le raisonnement
  par récurrence ★★★ (91/103, `bo-m-logique-14`) ; encadrement et sens de variation par
  récurrence ★★★ (91/103, `bo-m-suites-08`, avec la définition de suite majorée, minorée,
  bornée) ; modéliser une évolution par une suite ★★ (44/103, `bo-m-suites-09`, et
  l'approfondissement `bo-m-suites-17` en « pour aller plus loin »). Écart avec la
  proposition : « suites bornées » et « uₙ₊₁ = f(uₙ) » forment une seule notion (une seule
  ligne exigible, `bo-m-suites-08`, pour les deux) ; le calcul de termes en Python n'est pas
  une notion (aucune ligne ne le porte), il devient un bloc de code de la modélisation ; la
  modélisation devient une notion (elle porte `bo-m-suites-09`). Les trois exemples de « ce
  que le bac demande » de la modélisation sont des arbres pondérés : l'index ne garde, dans
  les autres contextes, que des récurrences, des limites ou des seuils.
- **Exercices écrits le 2026-10-06** (même PR que le cours, décision de Thibaud) : 24
  exercices (11 Comprendre, 10 S'entraîner, 3 Approfondir), 12 questions éclair, 4 exercices
  type bac (20 points), tous adaptés d'annales citées. Premier chapitre de l'année : les
  questions de limite, de convergence et de seuil des sujets adaptés sont retirées (notes
  `adaptation`), à remettre quand `limites-suites` sera écrit.

### 2. Limites de suites
- Limite finie ou infinie, suites de référence · ★★
- Opérations sur les limites, formes indéterminées · ★★
- Théorèmes de comparaison et des gendarmes · ★★
- Suites géométriques : limite de qⁿ · ★★★ · très souvent avec une suite auxiliaire
- Suite croissante majorée ⇒ convergente · ★★★ · « Justifier que la suite converge »
- Algorithme : recherche de seuils ; valeurs approchées de π, e, √2… (Python) · ★★
- ~~Limite d'une suite uₙ₊₁ = f(uₙ) (f continue)~~ → ch. 4 (c'est la section « Continuité »
  du programme)

### 3. Limites de fonctions
- Limites en l'infini, en un réel ; asymptotes · ★★★
- Opérations, formes indéterminées · ★★
- Croissances comparées (exp, puissances ; puis ln au ch. 7) · ★★★
- Limite d'une composée ; comparaison, encadrement · ★★
- **Cours écrit le 2026-10-12** (`content/terminale/maths/chapitres/limites-fonctions/`,
  domaine `analyse`) : 5 notions, priorités mesurées (103 sujets depuis 2021) — limite en
  l'infini, en un réel, asymptotes ★★ (31/103) ; fonctions de référence ★★★ (57/103, avec la
  démonstration de la limite de exp, `bo-m-suites-13`) ; opérations, composée, formes
  indéterminées ★★ (43/103) ; comparaison et encadrement ★★ (1/103, relevée d'un cran : elle
  démontre les croissances comparées) ; croissances comparées et choix de la méthode ★★★
  (83/103). Écarts avec la proposition : 5 notions au lieu de 4 (la première ne tenait pas en
  une séance : les fonctions de référence en sont sorties) ; la composée rejoint les
  opérations (le programme les relie) ; la comparaison passe avant les croissances comparées,
  dont la démonstration s'appuie sur une minoration. Interdits tenus (ordre de l'année) : ni
  logarithme, ni continuité nommée, ni dérivée de v∘u, ni dérivées de sin et cos.

### 4. Continuité, théorème des valeurs intermédiaires
- Continuité (définition, fonctions de référence) · ★★
- Théorème des valeurs intermédiaires, cas strictement monotone · ★★★ · « Montrer que f(x) = 0 admet une unique solution α »
- Encadrement d'une solution (balayage, dichotomie en Python ; méthodes de Newton et de la
  sécante, exemples d'algorithme du programme) · ★★
- Suite uₙ₊₁ = f(uₙ) avec f continue : image d'une suite convergente, valeur de la limite ·
  ★★ · « Déterminer la valeur de la limite » (venu du ch. 2)
- **Cours écrit le 2026-10-13** (`content/terminale/maths/chapitres/continuite/`, domaine
  `analyse`) : 4 notions, priorités mesurées (103 sujets depuis 2021) — fonction continue ★★
  (0/103, relevée d'un cran : les deux notions incontournables en dépendent) ; théorème des
  valeurs intermédiaires ★★★ (75/103) ; approcher une solution (dichotomie, Newton, sécante)
  ★ (3/103) ; limite d'une suite uₙ₊₁ = f(uₙ) ★★★ (55/103, au lieu de ★★ estimé). Écarts
  avec la proposition : l'encadrement à la calculatrice (balayage) rejoint la notion du
  théorème (la ligne 04 dit « existence, unicité, encadrement ») ; les approfondissements
  (lignes 08 à 10) sont des compléments. Le théorème sur un intervalle ouvert ou non borné,
  avec les limites aux bornes, n'est pas écrit au programme mais tombe presque à chaque
  sujet : présenté comme une extension admise. Interdits tenus : ni logarithme, ni dérivée
  d'une composée, ni convexité, ni fonction réciproque.
- **Exercices écrits le 2026-10-13** (même PR que le cours, à la demande de Thibaud) : 24
  exercices (10 Comprendre, 11 S'entraîner, 3 Approfondir), 13 questions éclair, 5 exercices
  type bac (27 points, chacun adapté d'un vrai sujet, cité ; les sujets avec logarithme
  transposés à l'exponentielle). Le test « élève » a fait ajouter au cours la réciproque et
  la contraposée (« non continue en a ⇒ non dérivable en a », méthode `l-continuite-061`),
  la continuité de √(ax + b) et l'arrondi par le milieu quand f est décroissante.

### 5. Compléments sur la dérivation, convexité
- Dérivée d'une composée x ↦ g(u(x)) (dont e^u, u^n, √u) · ★★★
- Dérivée seconde · ★★
- Fonction convexe/concave, position par rapport aux tangentes · ★★★
- Point d'inflexion · ★★ · « Étudier la convexité de f »
- *Écrit le 2026-10-14 en 6 notions (priorités mesurées) :* dérivée d'une composée ★★ ·
  étude complète d'une fonction ★★★ (ligne « calculer la dérivée, les limites, les
  variations », absente du découpage ci-dessus) · dérivée seconde ★★★ · convexe/concave ★★★ ·
  convexité et tangentes, inégalités ★★ (avec la démonstration exigible) · point
  d'inflexion et lecture graphique ★★★.

### 6. Vecteurs, droites et plans de l'espace
Écrit le 2026-10-15 en 6 notions (chaque rubrique ci-dessous coupée en deux pour tenir dans
une séance), priorités mesurées sur 103 sujets : vecteurs et combinaisons linéaires ★ (14 %) ;
droites, vecteurs colinéaires ★★ (49 %) ; plans, vecteurs coplanaires ★ (11 %) ; positions
relatives ★★ (48 %) ; bases, repères, coordonnées ★★ (33 %) ; démontrer un alignement, un
parallélisme, une coplanarité ★★ (31 %). Proposition de départ :
- Vecteurs de l'espace, combinaisons linéaires, colinéarité · ★★
- Droites et plans : positions relatives · ★★★
- Bases, repères, coordonnées ; vecteurs coplanaires · ★★

### 7. Fonction logarithme népérien
Écrit le 2026-10-15 en 6 notions, priorités mesurées sur 103 sujets : définition, réciproque
de exp ★★ (17 %, relevée d'un cran : tout le chapitre en dépend) ; propriétés algébriques ★★
(23 %) ; équations, inéquations et seuils ★★★ (66 %, le seuil qⁿ < ε y entre : même
technique) ; dérivée de ln et de ln(u), variations ★★★ (71 %) ; limites, croissances
comparées, courbe de ln ★★★ (53 %) ; résoudre un problème avec ln et exp, algorithme de
Briggs ★ (12 %). Proposition de départ :
- Définition (réciproque de exp), propriétés algébriques · ★★★
- Équations et inéquations avec ln et exp · ★★★
- Étude de la fonction ln : dérivée, limites, croissances comparées · ★★
- Dérivée de ln(u) · ★★
- Seuil d'une suite géométrique (qⁿ < ε) avec ln · ★★

### 8. Orthogonalité et distances dans l'espace
Écrit le 2026-10-16 en 5 notions, priorités mesurées sur 103 sujets : produit scalaire dans
l'espace ★★ (10 %, relevé d'un cran : tout le chapitre en dépend) ; vecteurs orthogonaux,
calculs en repère orthonormé ★★★ (95 %) ; droites et plans orthogonaux, vecteur normal ★★★
(91 %) ; projeté orthogonal, distance ★★★ (69 %) ; longueurs, angles, aires et volumes ★★★
(53 %, à part : le volume d'un tétraèdre est un geste distinct au bac). Le produit scalaire
en coordonnées est séparé de sa définition (87 % contre 10 %). Les coordonnées d'un projeté
par un système restent au chapitre 9. Proposition de départ :
- Produit scalaire dans l'espace (dont en coordonnées) · ★★
- Orthogonalité de droites, de plans ; vecteur normal · ★★★
- Projeté orthogonal, distance d'un point à un plan · ★★ (très présent : à remonter si les annales le confirment)

### 9. Représentations paramétriques et équations cartésiennes
**Écrit le 2026-10-23** (`content/terminale/maths/chapitres/equations-espace/`) : 4 notions,
toutes ★★★ mesurées sur 103 sujets — représentation paramétrique (98 %), équation de plan
(91 %), intersections et positions relatives par le calcul (71 %), et une 4e notion
**coordonnées d'un projeté orthogonal** (57 %), que la proposition ci-dessous oubliait
(le chapitre 8 la renvoie ici). L'appartenance d'un point va avec la droite ou le plan, pas
avec les intersections. Proposition de départ :
- Représentation paramétrique d'une droite · ★★ (très présent : à remonter si les annales le confirment)
- Équation cartésienne d'un plan · ★★★
- Intersections droite-plan, plan-plan ; appartenance · ★★ — relu : le programme traite
  les intersections par un système « dans des cas simples » ; « Déterminer l'intersection de
  deux plans » y est un **approfondissement possible** (non exigible)

### 10. Combinatoire et dénombrement
**Écrit le 2026-09-28** (`content/terminale/maths/chapitres/denombrement/`, domaine
`combinatoire`) : 5 notions, priorités mesurées (sujets où le dénombrement pouvait tomber) —
principes additif et multiplicatif, k-uplets ★★ (16/63) ; listes d'éléments distincts,
factorielle, permutations ★ (9/63) ; combinaisons et coefficients binomiaux ★★★ (19/63, +1
cran : indispensable pour la loi binomiale) ; propriétés des coefficients, triangle de Pascal ★
(3/63) ; résoudre un problème de dénombrement ★★ (23/63). Écart avec la proposition : les
propriétés des coefficients et la résolution de problèmes deviennent des notions à part.
Exercices écrits le même jour : 29 exercices en trois marches, 15 questions éclair, 4 exercices
type bac limités au dénombrement, à la première et aux Méthodes, tant que les chapitres suivants
ne sont pas écrits.

### 11. Épreuves indépendantes, loi binomiale
**Écrit le 2026-10-23** (`content/terminale/maths/chapitres/loi-binomiale/`, domaine
`probabilites`) : 5 notions, priorités mesurées sur 103 sujets — épreuves indépendantes,
arbres pondérés ★★★ (94/103) ; épreuve et schéma de Bernoulli ★★★ (70/103) ; loi binomiale et
probabilité de k succès ★★★ (88/103) ; au plus, au moins : calculer à la calculatrice ★★★
(83/103) ; problèmes de seuil, de comparaison, d'optimisation ★★ (39/103). Écart avec la
proposition (3 notions) : le schéma de Bernoulli et la loi binomiale sont séparés, les
calculs « au plus / au moins » à la calculatrice et les seuils aussi (deux gestes distincts).
Espérance, variance et écart type de la loi binomiale restent au ch. 15 (« Point à
trancher » en fin de fichier). Exercices écrits le même jour : 35 exercices en trois
marches, 18 questions éclair, 4 exercices type bac.

### 12. Fonctions sinus et cosinus
- Dérivées, variations, courbes représentatives · ★ (parité et périodicité : acquis de
  première)
- Équations et inéquations trigonométriques simples · ★

### 13. Primitives, équations différentielles
- Primitives : définition, primitives usuelles, opérations · ★★
- Équation y' = ay · ★★
- Équation y' = ay + b, solution particulière constante · ★★★ · souvent en contexte (refroidissement, population)
- Équation y' = ay + f · ★

### 14. Calcul intégral
- Intégrale d'une fonction positive, aire · ★★
- Théorème fondamental, calcul par primitive · ★★★
- Linéarité, positivité, relation de Chasles, valeur moyenne · ★★
- Intégration par parties · ★★
- Suites d'intégrales · ★★

### 15. Sommes de variables aléatoires, concentration, loi des grands nombres
- Somme de variables aléatoires : espérance, variance (cas indépendant) · ★★
- Échantillon, moyenne empirique · ★★
- Inégalité de Bienaymé-Tchebychev, inégalité de concentration · ★★
- Espérance, variance, écart type de la loi binomiale (venu du ch. 11) · ★★
- Loi des grands nombres · ★

## Rappels de première mobilisés

Liens depuis le bloc « rappel » du cours vers l'espace de première déjà en ligne :
suites arithmétiques et géométriques (`/premiere/maths/suites`), dérivation
(`/premiere/maths/derivation`), exponentielle (`/premiere/maths/exponentielle`),
second degré, trigonométrie, produit scalaire, probabilités conditionnelles
(`/premiere/maths/probas-cond`), variables aléatoires.

## Relecture texte en main (2026-09-24)

Faite avec le programme officiel (référentiel `bac-maths-terminale-2027`, § 5.3 : table des
lignes par chapitre).

- **Confirmé** : programme de 2019 en vigueur en 2026-2027 (le programme publié le
  2 avril 2026 s'applique à la rentrée 2027-2028) ; les 15 chapitres et `methodes-maths`
  couvrent les 205 lignes, sans reste.
- **Corrigé** : limite de uₙ₊₁ = f(uₙ) (ch. 2 → ch. 4) ; espérance et variance de la loi
  binomiale (ch. 11 → ch. 15) ; recherche de seuils et inégalité de Bernoulli au ch. 2 ;
  intersection de deux plans = approfondissement non exigible ; parité et périodicité de
  sinus et cosinus = première ; « loi des grands nombres » (le programme ne dit pas
  « faible »).
- **Logarithme décimal** : absent du programme de spécialité → hors programme (référentiel
  § 7). Il n'apparaît dans aucun chapitre.
- **Point à trancher (ordre de l'année)** : avec l'ordre ci-dessus, l'espérance np de la loi
  binomiale n'arrive qu'au ch. 15, quatre chapitres après la loi binomiale ; un exercice du
  ch. 11 ne peut donc pas la demander (charte, règle d'or 5). Soit on place le ch. 15 juste
  après le ch. 11, soit on l'accepte. À poser à Thibaud avec le chapitre pilote.
