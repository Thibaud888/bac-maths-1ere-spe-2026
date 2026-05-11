# Feuille de route — Figures avec courbes

Ce document liste les exercices où des **figures de courbes** sont à créer ou à ajouter,
pour l'ensemble du programme de Première spécialité maths (BO 2019).

Il couvre deux catégories distinctes :
- **Exercices de lecture graphique** — une figure est fournie ; l'élève lit des informations dessus
  (signe de f', extrema, pente d'une tangente, cos/sin depuis le cercle, etc.)
- **Figures de contexte** — une figure illustre la situation géométrique d'un exercice
  (parabole, cercle, triangle, etc.)

---

## 1. Chapitre dérivation (existant)

### Exercices existants — pas de figure courbe à ajouter

Les 12 classiques et 3 type-bac actuels sont **tous algébriques** (l'élève calcule f', résout,
dresse le tableau). Ajouter une courbe tracée ne serait pas pertinent : le but est précisément
que l'élève construise le raisonnement algébriquement.
Exceptions déjà traitées : c-derivation-012 (rectangle) et e-derivation-003 (boîte).

### Exercices à créer — lecture graphique manquante

Ces exercices **n'existent pas encore**. Ils couvrent la capacité BO :
> "Lien signe de f' / sens de variation de f — Extremum local — Tracé de courbes"

| ID à créer | Titre | Figure requise | Questions de lecture |
|---|---|---|---|
| `c-derivation-013` | Lecture graphique : tangente et nombre dérivé | Parabole $f(x) = x^2 - 4x + 3$ avec tangente en $x = 1$ tracée | Lire $f(1)$, estimer $f'(1)$ depuis la pente, identifier les variations |
| `c-derivation-014` | Lecture graphique : signe de la dérivée | Cubique $f(x) = x^3 - 3x$ sur $[-2{,}5 ; 2{,}5]$ | Identifier extremums locaux depuis la courbe, signe de $f'$ sur les intervalles |

**Automatismes de lecture graphique à créer** (dans `automatisms.json`) :
- Courbe donnée → "f'(2) est-il positif, négatif ou nul ?" (3 choix)
- Courbe donnée → "Sur quel intervalle f est-elle décroissante ?" (choix d'intervalle)
- Courbes de f et g données → "Résoudre graphiquement f(x) ≥ g(x)" (lecture des intersections)

**Effort SVG :** parabole et cubique faisables en SVG statique (polyline avec ~20 points calculés).

---

## 2. Chapitre second degré (à créer)

Le second degré est le chapitre **le plus naturellement graphique après la trigonométrie**.
La parabole $y = ax^2 + bx + c$ est une figure centrale du programme.

### Figures nécessaires dans les exercices futurs

| Usage pédagogique | Figure | Notes SVG |
|---|---|---|
| Lire les racines et le vertex depuis une courbe | Parabole avec $\Delta > 0$, intersections $Ox$ annotées | Facile : `<path>` quadratique |
| Signe du trinôme via la courbe | Parabole avec zone $> 0$ hachurée / colorée | Idem + `<rect>` ou `<path>` fill |
| Forme canonique : axe de symétrie et sommet | Parabole + droite $x = \alpha$ en pointillés + sommet $(\alpha, \beta)$ | Facile |
| Automatisme : "lire l'antécédent / l'image" | Petite parabole avec gridlines et points annotés | Facile |

**Exercices à créer avec figure :**
- Au moins **1 classique de lecture graphique** (parabole donnée → lire racines, vertex, signe)
- Au moins **1 automatisme** QCM avec parabole (reconnaître la forme $a > 0$ ou $a < 0$, lire le discriminant depuis le nombre de racines)
- Dans **1 exercice type bac** : une question de partie A donnant une parabole à lire avant les questions algébriques

---

## 3. Chapitre trigonométrie (à créer) — priorité haute

C'est le chapitre **le plus visuel du programme**. Deux types de figures sont absolument
nécessaires pour les exercices de lecture graphique.

### 3.1 Cercle trigonométrique

| Usage pédagogique | Figure | Notes SVG |
|---|---|---|
| Lire $\cos\theta$, $\sin\theta$ pour les valeurs usuelles | Cercle unité + axes + points annotés ($0, \pi/6, \pi/4, \pi/3, \pi/2, \pi, \ldots$) | Faisable statique |
| Formules de symétrie ($\cos(-x) = \cos x$, etc.) | Cercle + point $M(\theta)$ et son symétrique par rapport à un axe | Faisable |
| QCM automatisme : "Valeur de $\cos(5\pi/6)$" | Cercle minimaliste avec le point $M$ et sa projection sur $Ox$ | Facile |

**Exercices à créer avec cercle trigonométrique :**
- **1 classique** : "Sur le cercle trigonométrique ci-dessous, placer les points et lire les valeurs"
- **Automatismes QCM** : ~3-4 items avec un cercle fourni, lecture de cos/sin

### 3.2 Courbes de sin et cos

| Usage pédagogique | Figure | Notes SVG |
|---|---|---|
| Lecture de la période, des maxima ($=1$), des zéros | Courbe de $\sin x$ sur $[-\pi ; 2\pi]$ | Bézier ou polyline dense |
| Identification graphique : laquelle est sin, laquelle est cos ? | Deux courbes superposées | Idem |
| Signe de $\sin x$ / $\cos x$ sur un intervalle | Courbe + zones colorées $> 0$ et $< 0$ | Idem |
| Dérivées visuelles : "la tangente en 0 à sin a pour pente 1" | Courbe $\sin x$ + tangente en $x = 0$ | Faisable |

**Exercices à créer avec courbes sin/cos :**
- **1 classique** : lecture graphique des propriétés (zéros, maxima, périodicité, parité)
- **1 exercice type bac** : partie avec courbe fournie + questions sur cos/sin/tan

**Note technique :** Les courbes sin/cos requièrent des chemins Bézier calculés.
~40 points de $\sin x$ sur $[0, 2\pi]$ suffisent pour une `<polyline>` convaincante.

---

## 4. Chapitre fonction exponentielle (à créer)

Les exercices sont principalement algébriques (dériver, résoudre $e^{ax+b} = k$).
Quelques figures visuelles utiles :

| Usage pédagogique | Figure | Priorité |
|---|---|---|
| Visualisation de la croissance et de l'asymptote | Courbe $e^x$ sur $[-3 ; 3]$ avec droite $y = 0$ | Basse |
| Tangente en $x = 0$ d'équation $y = x + 1$ | Courbe $e^x$ + droite $y = x + 1$ au point $(0, 1)$ | Moyenne |
| Comparaison $e^x$ vs $2^x$ (croissance) | Deux courbes sur $[0 ; 3]$ | Basse |

**Pas d'exercice de lecture graphique indispensable** : l'exponentielle est surtout
manipulée algébriquement au niveau de la Première.

---

## 5. Chapitres géométrie (à créer)

### 5.1 Géométrie repérée

Les figures de **cercles et droites dans un repère** sont incontournables.

| Usage pédagogique | Figure | Notes SVG |
|---|---|---|
| Représentation d'un cercle $\mathcal{C}(O, r)$ | Repère + cercle avec centre et rayon annotés | Facile : `<circle>` |
| Intersection droite-cercle | Repère + cercle + droite avec 2 points d'intersection | Facile |
| Caractérisation par diamètre : $\vec{MA} \cdot \vec{MB} = 0$ | Cercle + diamètre $[AB]$ + point $M$ sur le cercle + angle droit | Facile |
| Exercice type bac : chercher si un point est dans le cercle | Repère + cercle + points annotés | Facile |

### 5.2 Produit scalaire

| Usage pédagogique | Figure | Notes SVG |
|---|---|---|
| Projection orthogonale de $\vec{v}$ sur $\vec{u}$ | Vecteurs + projeté $\vec{v'}$ + angle droit | Facile |
| Formule d'Al-Kashi dans un triangle | Triangle $ABC$ avec $a, b, c$ annotés | Facile |
| Exercice : médiane ou hauteur dans un triangle | Triangle avec médiane $[AM]$ annotée | Facile |

---

## 6. Chapitre variables aléatoires (à créer)

Chapitre principalement calculatoire. Une figure de distribution peut aider :

| Usage pédagogique | Figure | Notes SVG |
|---|---|---|
| Visualiser une loi de probabilité | Diagramme en bâtons (bar chart) | Facile : `<rect>` répétés |
| Comparaison de deux distributions | Deux bar charts côte à côte | Facile |

**Priorité basse** : les exercices EAM portent sur le calcul d'espérance/variance, pas la lecture graphique.

---

## Récapitulatif — Priorités de création

| Priorité | Chapitre | Type de figure | Effort technique |
|---|---|---|---|
| **Haute** | Trigonométrie | Cercle trigonométrique | SVG facile |
| **Haute** | Trigonométrie | Courbes $\sin x$, $\cos x$ | SVG moyen (Bézier) |
| **Haute** | Second degré | Parabole (racines, vertex) | SVG facile |
| **Haute** | Dérivation | Courbes pour lecture graphique (c-derivation-013/014) | SVG moyen |
| **Moyenne** | Géométrie repérée | Cercles dans repère | SVG facile |
| **Moyenne** | Produit scalaire | Projections, triangles | SVG facile |
| **Basse** | Exponentielle | Courbe $e^x$ | SVG moyen |
| **Basse** | Variables aléatoires | Bar charts | SVG facile |

---

## Note technique — Méthodes SVG pour les courbes

| Type de courbe | Méthode SVG recommandée |
|---|---|
| Parabole $y = ax^2 + bx + c$ | `<path>` avec arc Bézier quadratique `Q` (exact) |
| Cubique $y = x^3 + bx + c$ | `<polyline>` avec ~20 points calculés |
| Cercle trigonométrique | `<circle>` + `<line>` + `<text>` pour annotations |
| $\sin x$ / $\cos x$ sur $[0, 2\pi]$ | `<polyline>` avec ~40 points à pas $\pi/20$ |
| Courbe $e^x$ | `<polyline>` avec ~20 points sur $[-3, 3]$ |
| Droite (tangente) | `<line x1=... y1=... x2=... y2=...>` |
| Cercle dans repère | `<circle>` dans un `<svg>` avec `viewBox` adapté |

JSXGraph reste réservé aux figures interactives ou avec trop de paramètres variables.
