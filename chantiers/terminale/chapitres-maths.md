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
> décompte des annales (`annales-indexeur`). Légende : ★★★ incontournable · ★★ fréquent ·
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
  ligne du programme de terminale. `tle-architecte` dira s'il tient seul ou s'il rejoint le ch. 2

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

### 4. Continuité, théorème des valeurs intermédiaires
- Continuité (définition, fonctions de référence) · ★★
- Théorème des valeurs intermédiaires, cas strictement monotone · ★★★ · « Montrer que f(x) = 0 admet une unique solution α »
- Encadrement d'une solution (balayage, dichotomie en Python ; méthodes de Newton et de la
  sécante, exemples d'algorithme du programme) · ★★
- Suite uₙ₊₁ = f(uₙ) avec f continue : image d'une suite convergente, valeur de la limite ·
  ★★ · « Déterminer la valeur de la limite » (venu du ch. 2)

### 5. Compléments sur la dérivation, convexité
- Dérivée d'une composée x ↦ g(u(x)) (dont e^u, u^n, √u) · ★★★
- Dérivée seconde · ★★
- Fonction convexe/concave, position par rapport aux tangentes · ★★★
- Point d'inflexion · ★★ · « Étudier la convexité de f »

### 6. Vecteurs, droites et plans de l'espace
- Vecteurs de l'espace, combinaisons linéaires, colinéarité · ★★
- Droites et plans : positions relatives · ★★★
- Bases, repères, coordonnées ; vecteurs coplanaires · ★★

### 7. Fonction logarithme népérien
- Définition (réciproque de exp), propriétés algébriques · ★★★
- Équations et inéquations avec ln et exp · ★★★
- Étude de la fonction ln : dérivée, limites, croissances comparées · ★★
- Dérivée de ln(u) · ★★
- Seuil d'une suite géométrique (qⁿ < ε) avec ln · ★★

### 8. Orthogonalité et distances dans l'espace
- Produit scalaire dans l'espace (dont en coordonnées) · ★★
- Orthogonalité de droites, de plans ; vecteur normal · ★★★
- Projeté orthogonal, distance d'un point à un plan · ★★ (très présent : à remonter si les annales le confirment)

### 9. Représentations paramétriques et équations cartésiennes
- Représentation paramétrique d'une droite · ★★ (très présent : à remonter si les annales le confirment)
- Équation cartésienne d'un plan · ★★★
- Intersections droite-plan, plan-plan ; appartenance · ★★ — relu : le programme traite
  les intersections par un système « dans des cas simples » ; « Déterminer l'intersection de
  deux plans » y est un **approfondissement possible** (non exigible)

### 10. Combinatoire et dénombrement
- Principe additif/multiplicatif, k-uplets · ★★
- Permutations, arrangements · ★
- Combinaisons, coefficients binomiaux, triangle de Pascal · ★★

### 11. Épreuves indépendantes, loi binomiale
- Succession d'épreuves indépendantes, arbre (rappel de première : probabilités conditionnelles) · ★★
- Schéma et loi de Bernoulli, loi binomiale · ★★★ · « Justifier que X suit une loi binomiale »
- ~~Espérance, variance, écart-type de la loi binomiale~~ → ch. 15 (c'est la section
  « Sommes de variables aléatoires » du programme ; voir « Point à trancher » en fin de fichier)
- Calculs à la calculatrice : P(X = k), P(X ≤ k), seuil · ★★★

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
