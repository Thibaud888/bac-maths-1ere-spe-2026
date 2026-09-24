# Maths de terminale — découpage proposé

> **Proposition du 2026-09-24, à confirmer** par la session « référentiel maths » (texte du
> programme en main) puis par `tle-architecte`, chapitre par chapitre. Programme de référence :
> spécialité de terminale, **BO spécial n° 8 du 25 juillet 2019** (voir README § 6-7).
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
(listes), calculatrice en mode examen.
Chaque chapitre porte en plus ses propres algorithmes du programme (seuil, dichotomie,
simulation…), en bloc « méthode » du cours et en exercices.

## Notions par chapitre (estimation)

Chaque notion : titre · priorité estimée · ce que le bac demande typiquement.

### 1. Raisonnement par récurrence et suites
- Raisonnement par récurrence · ★★★ · « Démontrer par récurrence que pour tout entier n… »
- Suites majorées, minorées, bornées · ★★ · « Montrer que 0 ≤ uₙ ≤ uₙ₊₁ ≤ 2 »
- Suites définies par une fonction uₙ₊₁ = f(uₙ) · ★★ · étude via le sens de variation de f
- Algorithme : calcul de termes, seuil (Python) · ★★ · « Compléter la fonction Python… »
- Démonstration exigible possible : inégalité de Bernoulli (à relever dans le BO)

### 2. Limites de suites
- Limite finie ou infinie, suites de référence · ★★
- Opérations sur les limites, formes indéterminées · ★★
- Théorèmes de comparaison et des gendarmes · ★★
- Suites géométriques : limite de qⁿ · ★★★ · très souvent avec une suite auxiliaire
- Suite croissante majorée ⇒ convergente · ★★★ · « Justifier que la suite converge »
- Limite d'une suite uₙ₊₁ = f(uₙ) (f continue) · ★★ · « Déterminer la valeur de la limite »

### 3. Limites de fonctions
- Limites en l'infini, en un réel ; asymptotes · ★★★
- Opérations, formes indéterminées · ★★
- Croissances comparées (exp, puissances ; puis ln au ch. 7) · ★★★
- Limite d'une composée ; comparaison, encadrement · ★★

### 4. Continuité, théorème des valeurs intermédiaires
- Continuité (définition, fonctions de référence) · ★★
- Théorème des valeurs intermédiaires, cas strictement monotone · ★★★ · « Montrer que f(x) = 0 admet une unique solution α »
- Encadrement d'une solution (balayage, dichotomie en Python) · ★★

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
- Intersections droite-plan, plan-plan ; appartenance · ★★

### 10. Combinatoire et dénombrement
- Principe additif/multiplicatif, k-uplets · ★★
- Permutations, arrangements · ★
- Combinaisons, coefficients binomiaux, triangle de Pascal · ★★

### 11. Épreuves indépendantes, loi binomiale
- Succession d'épreuves indépendantes, arbre (rappel de première : probabilités conditionnelles) · ★★
- Schéma et loi de Bernoulli, loi binomiale · ★★★ · « Justifier que X suit une loi binomiale »
- Espérance, variance, écart-type de la loi binomiale · ★★
- Calculs à la calculatrice : P(X = k), P(X ≤ k), seuil · ★★★

### 12. Fonctions sinus et cosinus
- Parité, périodicité, dérivées, variations · ★
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
- Loi faible des grands nombres · ★

## Rappels de première mobilisés

Liens depuis le bloc « rappel » du cours vers l'espace de première déjà en ligne :
suites arithmétiques et géométriques (`/premiere/maths/suites`), dérivation
(`/premiere/maths/derivation`), exponentielle (`/premiere/maths/exponentielle`),
second degré, trigonométrie, produit scalaire, probabilités conditionnelles
(`/premiere/maths/probas-cond`), variables aléatoires.
