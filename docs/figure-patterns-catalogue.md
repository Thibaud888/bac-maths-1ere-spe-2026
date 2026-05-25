# Catalogue des patterns de lecture graphique — Bac Première spé maths (EAM 2026)

> **But du document.** Cataloguer les types de questions "lecture graphique" classiques du bac, par chapitre, pour servir de référence à la création d'exercices construits autour de figures essentielles. La figure est l'**input** de l'exercice, pas une illustration.

> **Sources.** Programme BO 2019 (cf. `SKILL.md` §2), automatismes officiels JO juin 2025 (cf. `SKILL.md` §3, notamment §3.4 "Fonctions et représentations"), sujets zéro EAM 2026 (cf. `SKILL.md` §5), connaissance des patterns bac récurrents.

> **Critère d'inclusion.** Un pattern est inclus uniquement si (1) il est ancrable dans une notion du programme BO 2019, (2) il apparaît effectivement dans les sujets bac/EAM ou peut raisonnablement y figurer, (3) la figure est essentielle (sans elle, la question n'a pas de sens).

> **Légende niveau.** `A` = automatisme (Partie 1 EAM, < 60s) ; `C` = exercice classique (méthode connue, application directe) ; `E` = exercice type bac (Partie 2 EAM, multi-étapes).

---

## 1. Dérivation

| ID | Pattern | Niveau | Compétence | Figure type |
|---|---|---|---|---|
| D1 | Lire **f'(a)** en mesurant la pente de la tangente tracée | C | Calculer, Représenter | Courbe `C_f` + tangente tracée en un point d'abscisse `a` |
| D2 | Donner l'**équation de la tangente** tracée à `C_f` au point d'abscisse `a` | C | Calculer, Communiquer | Courbe + tangente passant par deux points repérables |
| D3 | Déterminer **graphiquement le nombre de solutions** de f(x) = k | C | Représenter, Raisonner | Courbe + droite horizontale y = k |
| D4 | Lire **f(a)** et/ou **antécédent(s)** de f(x) = k | A | Représenter | Courbe sur repère gradué |
| D5 | À partir du **signe de f'** lu sur un graphique, déterminer les **variations** de f | C | Raisonner, Communiquer | Courbe de `C_{f'}` (donc dérivée seule) |
| D6 | À partir des **variations de f** sur un graphique, déduire le **signe de f'** | C | Raisonner | Courbe de `C_f` (fonction seule) |
| D7 | **Associer** parmi 3-4 courbes celle qui représente `f'` connaissant `f` (ou inversement) | E | Raisonner | 3-4 courbes en parallèle, à apparier |
| D8 | Lire les **extremums locaux** sur un graphique et donner leurs abscisses | C | Représenter | Courbe + points marqués éventuellement |

## 2. Second degré

| ID | Pattern | Niveau | Compétence | Figure type |
|---|---|---|---|---|
| SD1 | Lire **racines, sommet, axe de symétrie** d'une parabole | C | Représenter | Parabole sur repère gradué |
| SD2 | Déduire le **signe de a** (orientation) et celui de **Δ** (nombre de racines) | C | Raisonner | Parabole, qu'elle ait 0, 1 ou 2 racines |
| SD3 | Résoudre **graphiquement** f(x) ≥ 0 / f(x) ≤ k (auto §3.4) | A | Représenter, Raisonner | Parabole + droite y = k éventuellement |
| SD4 | **Associer** l'expression algébrique parmi plusieurs (forme dév./canonique/factorisée) à une parabole donnée | E | Raisonner | 1 parabole + 3-4 expressions candidates |
| SD5 | Lire **f(0)** (ordonnée à l'origine) | A | Représenter | Parabole sur repère gradué |
| SD6 | Tracer une parabole connaissant sommet et un autre point | C | Représenter | Repère vide à compléter (potentiel — variante moins prioritaire) |

## 3. Trigonométrie

| ID | Pattern | Niveau | Compétence | Figure type |
|---|---|---|---|---|
| T1 | Lire **cos θ et sin θ** d'un point M placé sur le cercle trigo | C | Représenter | Cercle trigo + point M + projections en pointillés |
| T2 | **Placer** sur le cercle un angle θ exprimé en radians (valeurs usuelles + multiples) | A | Représenter | Cercle trigo gradué en multiples de π/6 et π/4 |
| T3 | Résoudre **graphiquement** cos x = a (ou sin x = a) sur `[0; 2π]` | C | Représenter | Cercle trigo OU courbe cos/sin + droite y = a |
| T4 | Identifier **période et amplitude** d'une fonction sinusoïdale f(x) = A sin(ωx + φ) | C | Représenter | Courbe sinusoïdale sur repère gradué |
| T5 | **Associer** parmi 3-4 courbes celle qui correspond à une expression donnée (ex. sin(2x), cos(x − π/4)) | E | Raisonner | 3-4 courbes sinusoïdales en parallèle |
| T6 | Lire la **mesure d'un angle** sur le cercle trigonométrique (en radians) | A | Représenter | Cercle trigo + point M sans valeur explicite |

## 4. Suites

| ID | Pattern | Niveau | Compétence | Figure type |
|---|---|---|---|---|
| S1 | Lire les **premiers termes** u₀, u₁, u₂… sur un **graphique en escalier** (suite récurrente avec y = f(x) et y = x) | C | Représenter | Graphique escalier avec deux courbes (f et y = x) |
| S2 | **Conjecturer** monotonie et/ou convergence à partir du graphique en escalier | C | Raisonner | Graphique escalier |
| S3 | Identifier visuellement une suite **arithmétique vs géométrique** à partir d'un nuage de points u_n | C | Raisonner | Nuage de points discrets sur axes (n, u_n) |
| S4 | Lire les **premiers termes** d'une suite et calculer raison/premier terme | A | Représenter | Nuage de points discrets |

## 5. Probabilités conditionnelles

| ID | Pattern | Niveau | Compétence | Figure type |
|---|---|---|---|---|
| P1 | **Compléter** un arbre pondéré partiellement rempli | A | Représenter | Arbre `tree` avec poids manquants |
| P2 | Calculer **P(A∩B)** en suivant un chemin d'arbre | C | Calculer | Arbre complet |
| P3 | Appliquer la **formule des probabilités totales** sur un arbre | C | Calculer, Raisonner | Arbre complet (partition par B) |
| P4 | Vérifier l'**indépendance** A et B à partir d'un arbre / tableau | C | Raisonner | Arbre OU tableau de contingence en SVG |
| P5 | **Construire l'arbre** à partir d'un énoncé verbal | C | Modéliser, Représenter | Arbre vide ou squelette à compléter |
| P6 | Lire P(A) et P_A(B) sur un arbre | A | Représenter | Arbre complet |

## 6. Géométrie repérée

| ID | Pattern | Niveau | Compétence | Figure type |
|---|---|---|---|---|
| GR1 | Lire les **coordonnées d'un point** sur un repère | A | Représenter | Repère gradué + points marqués |
| GR2 | Lire l'**équation cartésienne d'une droite** tracée (ax + by + c = 0) | C | Représenter, Calculer | Droite + repère gradué + 2 points repérables |
| GR3 | Déduire l'**équation d'un cercle** d'après centre et rayon visibles | C | Représenter, Calculer | Cercle + centre marqué + rayon |
| GR4 | Déterminer la **position d'un point M** par rapport à un cercle (intérieur/extérieur/sur) | A | Représenter, Raisonner | Cercle + point M sur repère gradué |
| GR5 | Déterminer un **vecteur normal** à une droite tracée | C | Représenter | Droite + repère gradué |
| GR6 | Lire l'**intersection** d'une droite et d'un cercle (nombre et positions de points communs) | C | Représenter | Droite + cercle sur repère |

## 7. Produit scalaire

| ID | Pattern | Niveau | Compétence | Figure type |
|---|---|---|---|---|
| PS1 | Identifier visuellement un **angle droit** dans une configuration et le justifier par u⃗·v⃗ = 0 | C | Raisonner, Représenter | Triangle ou quadrilatère sur repère gradué |
| PS2 | Lire les **composantes** de deux vecteurs représentés sur un repère et calculer leur produit scalaire | A | Représenter, Calculer | Repère + 2 vecteurs tracés |
| PS3 | À partir d'une figure de triangle (côtés étiquetés, angle connu), calculer un côté par **Al-Kashi** | C | Calculer | Triangle géométrique avec étiquettes longueurs/angles |
| PS4 | Étudier une **configuration géométrique** (médiane = hauteur, diagonales du losange perpendiculaires, etc.) en s'appuyant sur la figure | E | Raisonner | Polygone particulier (losange, carré, triangle isocèle) |
| PS5 | Identifier le **projeté orthogonal** d'un vecteur sur une droite et l'utiliser pour calculer un produit scalaire | C | Représenter | Vecteur + droite + projection en pointillés |

## 8. Exponentielle

| ID | Pattern | Niveau | Compétence | Figure type |
|---|---|---|---|---|
| E1 | **Associer** parmi plusieurs courbes celle qui représente e^x, e^(-x), e^(x+a), −e^x | C | Raisonner | 3-4 courbes en parallèle |
| E2 | Lire **f(0) = 1** sur la courbe de e^x | A | Représenter | Courbe de e^x sur repère gradué |
| E3 | Distinguer une fonction **exponentielle vs polynomiale** parmi plusieurs courbes | C | Raisonner | 3-4 courbes (e^x, x², x³…) en parallèle |
| E4 | Lire l'**équation de la tangente** à C_f au point (0 ; 1) (compétence : pente = 1) | C | Représenter, Calculer | Courbe e^x + tangente en (0,1) |
| E5 | Comparer **e^a vs e^b** graphiquement (utilisation de la stricte croissance) | A | Raisonner | Courbe + 2 abscisses repérées |

---

## Récapitulatif — pondération suggérée

| Chapitre | Patterns auto | Patterns C | Patterns E | Total |
|---|---|---|---|---|
| Dérivation | 1 | 6 | 1 | 8 |
| Second degré | 2 | 3 | 1 | 6 |
| Trigonométrie | 2 | 3 | 1 | 6 |
| Suites | 1 | 3 | 0 | 4 |
| Probas conditionnelles | 2 | 4 | 0 | 6 |
| Géométrie repérée | 2 | 4 | 0 | 6 |
| Produit scalaire | 1 | 3 | 1 | 5 |
| Exponentielle | 2 | 3 | 0 | 5 |
| **TOTAL** | **13** | **29** | **4** | **46** |

**~46 patterns identifiés**, dont ~29 sur exercices classiques (méthode), ~13 sur automatismes (rapidité), et ~4 sur type bac (multi-étapes mobilisant figure).

---

## Patterns à étudier en priorité

Si le budget de création d'exercices est limité, prioriser :

1. **D7** (associer f / f') — pattern emblématique du sujet zéro EAM 2026
2. **D1, D2** (tangente, nombre dérivé via pente) — automatismes très récurrents
3. **T1** (cos/sin sur cercle) — compétence centrale trigo
4. **P2, P3** (chemins d'arbre, probas totales) — quasi systématique au bac
5. **SD1, SD3** (parabole : racines/sommet/résolution graphique) — automatismes officiels
6. **S1** (graphique en escalier) — pattern visuel emblématique des suites
7. **GR3, GR2** (équation cercle/droite à partir d'un graphique) — quasi systématique
8. **E1, E3** (associer courbes exp) — pattern bac classique

---

## Couverture actuelle (post-revert, commit b5505cd)

Synthèse du cross-check entre les 46 patterns et les exercices existants :

| Chapitre | ✅ Avec figure | 🟡 Partiel (algébrique) | ❌ Absent | Total |
|---|---|---|---|---|
| Dérivation | 5 | 0 | 3 | 8 |
| Second degré | 2 | 2 | 2 | 6 |
| Trigonométrie | 5 | 1 | 0 | 6 |
| Suites | 0 | 2 | 2 | 4 |
| Probas conditionnelles | 3 | 1 | 2 | 6 |
| Géométrie repérée | 0 | 3 | 3 | 6 |
| Produit scalaire | 0 | 4 | 1 | 5 |
| Exponentielle | 0 | 3 | 2 | 5 |
| **TOTAL** | **15** | **16** | **15** | **46** |

### Patterns à créer en priorité (par chapitre)

- **Dérivation** : D3 (nombre de solutions f(x)=k), D5 (variations à partir de C_{f'}), D7 (associer f/f')
- **Second degré** : SD2 (signe de Δ — compléter), SD3 (résolution graphique), SD4 (associer parabole↔expression), SD5 (auto f(0))
- **Trigonométrie** : T5 (vrai matching de courbes sinusoïdales)
- **Suites** : S1 (escalier — lecture termes), S2 (escalier — monotonie/convergence), S3 (nuage arith/géom avec figure), S4 (idem)
- **Probas cond.** : P1 (compléter arbre partiel), P4 (tableau de contingence figuré), P5 (construire arbre à partir d'énoncé)
- **Géométrie repérée** : GR1 (coords point), GR2 (équation droite tracée), GR3 (équation cercle), GR4-GR6 (toutes les versions graphiques)
- **Produit scalaire** : PS1-PS5 (toutes les versions graphiques — chapitre entièrement à équiper)
- **Exponentielle** : E1 (matching e^x/e^(-x)), E2 (lecture f(0)=1), E3 (distinguer exp vs polynômes), E4 (tangente en 0), E5 (comparaison e^a/e^b graphique)

### Chapitres en bon état

- **Dérivation** : couverture solide sur D1, D2, D4, D6, D8
- **Trigonométrie** : 5/6 patterns couverts
- **Probas conditionnelles** : P2, P3, P6 bien couverts par les arbres `tree`
