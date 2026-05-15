---
name: bac-maths-premiere-spe-2026
description: Référence officielle du programme de mathématiques de Première Spécialité (BO spécial n°1 du 22 janvier 2019, en vigueur pour l'année scolaire 2025-2026) et de l'Épreuve Anticipée de Mathématiques (EAM) du baccalauréat session 2026 (vendredi 12 juin 2026). Utiliser ce skill pour TOUTE création de contenu pédagogique (cours, formules, exercices, sujets type bac) destiné à un élève de première spécialité maths préparant l'EAM 2026. Garantit la conformité au programme officiel et au format d'épreuve réglementaire.
---

# Programme Maths Première Spé + Épreuve Anticipée 2026

## 1. Cadre réglementaire de l'épreuve

| Caractéristique | Valeur |
|---|---|
| Texte officiel | Décret n°2025-513 du 10 juin 2025 ; Note de service MENE2515469N |
| Première session | Juin 2026 (vendredi 12 juin 2026, 8h-10h) |
| Programme évalué (2025-2026) | BO spécial n°1 du 22 janvier 2019 (arrêté du 17 janvier 2019) |
| Automatismes 2025-2026 | Note de service MENE2516240N du 10 juin 2025 |
| Durée | 2 heures |
| Calculatrice | **INTERDITE** sur toute l'épreuve |
| Coefficient | 2 |
| Note totale | /20 |
| Partie 1 — QCM automatismes | 6 points |
| Partie 2 — Exercices indépendants | 14 points (2 à 3 exercices) |

**Conséquence majeure pour la conception** : tous les calculs doivent être faisables à la main. Pas de valeurs exotiques, privilégier des nombres "ronds" (entiers, fractions simples, racines simples, valeurs usuelles de cos/sin).

## 2. Programme de spécialité — Première générale

Cinq parties officielles. Pour chacune, lister les notions et les capacités attendues telles que formulées dans le BO.

### 2.1 Algèbre

#### Suites numériques, modèles discrets

**Notions** : Notations u(n), uₙ, (uₙ). Modes de génération : explicite, par récurrence, motifs géométriques/combinatoires. Sens de variation.

**Suites arithmétiques** :
- Définition : u_{n+1} = uₙ + r
- Terme général : uₙ = u₀ + nr (ou uₙ = uₚ + (n-p)r)
- Lien avec fonctions affines
- Somme : 1 + 2 + ... + n = n(n+1)/2

**Suites géométriques** :
- Définition : u_{n+1} = q·uₙ
- Terme général : uₙ = u₀·qⁿ
- Lien avec fonction exponentielle
- Somme : 1 + q + q² + ... + qⁿ = (1 - q^{n+1})/(1 - q) si q ≠ 1

#### Équations, fonctions polynômes du second degré

- Forme développée : ax² + bx + c (a ≠ 0)
- Forme canonique : a(x - α)² + β
- Discriminant Δ = b² - 4ac
- Racines (Δ > 0, Δ = 0, Δ < 0)
- Factorisation : a(x - x₁)(x - x₂) si Δ ≥ 0
- Somme et produit des racines : x₁ + x₂ = -b/a ; x₁·x₂ = c/a
- Signe du trinôme (règle "même signe que a sauf entre les racines")
- Variations, parabole, axe de symétrie x = α = -b/(2a)
- Extremum : minimum si a > 0, maximum si a < 0

### 2.2 Analyse

#### Dérivation

- Taux de variation entre a et a+h
- Nombre dérivé f'(a) = lim (taux de variation) quand h → 0
- Tangente : y = f'(a)(x - a) + f(a)
- Fonction dérivée
- **Dérivées des fonctions usuelles** :
  - (k)' = 0
  - (xⁿ)' = n·x^(n-1)
  - (1/x)' = -1/x²
  - (√x)' = 1/(2√x)
  - (sin x)' = cos x
  - (cos x)' = -sin x
  - (eˣ)' = eˣ
- **Opérations** :
  - (u + v)' = u' + v'
  - (k·u)' = k·u'
  - (u·v)' = u'v + uv'
  - (1/u)' = -u'/u²
  - (u/v)' = (u'v - uv')/v²
  - (u(ax+b))' = a·u'(ax+b)

#### Variations et courbes représentatives

- Lien signe de f' / sens de variation de f
- Extremum local : f'(x₀) = 0 et changement de signe
- Tracé de courbes
- Position relative de courbes (étude du signe de f - g)

#### Fonction exponentielle

- Définition : unique fonction f dérivable sur ℝ telle que f' = f et f(0) = 1
- Notation : exp(x) = eˣ, e ≈ 2,718
- **Propriétés algébriques** :
  - e^(a+b) = eᵃ · eᵇ
  - e^(-a) = 1/eᵃ
  - e^(a-b) = eᵃ/eᵇ
  - (eᵃ)ⁿ = e^(na)
- Strictement croissante sur ℝ, eˣ > 0 pour tout x
- (e^(ax+b))' = a·e^(ax+b)
- Lien avec suites géométriques

#### Trigonométrie

- Cercle trigonométrique, radian (180° = π rad)
- Enroulement de la droite sur le cercle
- Cosinus et sinus d'un nombre réel
- Valeurs usuelles : 0, π/6, π/4, π/3, π/2, π, etc.
- Symétries (cos(-x) = cos x ; sin(-x) = -sin x ; etc.)
- **Formules d'addition** :
  - cos(a + b) = cos a cos b - sin a sin b
  - cos(a - b) = cos a cos b + sin a sin b
  - sin(a + b) = sin a cos b + cos a sin b
  - sin(a - b) = sin a cos b - cos a sin b
- **Formules de duplication** :
  - cos(2a) = cos²a - sin²a = 2cos²a - 1 = 1 - 2sin²a
  - sin(2a) = 2 sin a cos a
- Identité : cos²x + sin²x = 1
- Fonctions sin et cos : périodicité 2π, parité, courbes
- Dérivées de sin et cos

### 2.3 Géométrie

#### Produit scalaire

- **Quatre définitions équivalentes** :
  1. u⃗·v⃗ = ‖u⃗‖·‖v⃗‖·cos(u⃗,v⃗)
  2. u⃗·v⃗ = xx' + yy' (en BON)
  3. u⃗·v⃗ = ½(‖u⃗ + v⃗‖² - ‖u⃗‖² - ‖v⃗‖²)
  4. u⃗·v⃗ = ‖u⃗‖·‖v'⃗‖ où v'⃗ est le projeté orthogonal de v⃗ sur la droite portant u⃗
- Bilinéarité, symétrie
- Caractérisation de l'orthogonalité : u⃗·v⃗ = 0 ⇔ u⃗ ⊥ v⃗
- Identités : ‖u⃗ + v⃗‖² = ‖u⃗‖² + 2u⃗·v⃗ + ‖v⃗‖²
- Formule d'Al-Kashi : a² = b² + c² - 2bc·cos(Â)
- Théorème de la médiane

#### Géométrie repérée du plan

- Vecteur normal à une droite
- Équation cartésienne d'une droite : ax + by + c = 0 ; vecteur normal (a, b)
- Équation d'un cercle : (x - a)² + (y - b)² = r² (centre (a,b), rayon r)
- Caractérisation par diamètre [AB] : MA⃗·MB⃗ = 0
- Intersection droite-cercle, cercle-cercle (résolution de systèmes)

### 2.4 Probabilités et statistiques

#### Probabilités conditionnelles et indépendance

- Probabilité conditionnelle : P_B(A) = P(A ∩ B)/P(B) (avec P(B) ≠ 0)
- Notations : P_B(A), P(A|B)
- Distinction P(A ∩ B), P_A(B), P_B(A)
- Arbres pondérés : règles (somme = 1 sur chaque nœud, produit le long d'un chemin)
- Formule des probabilités totales (partition) : P(A) = Σ P(B_i)·P_{B_i}(A)
- Indépendance : A et B indépendants ⇔ P(A ∩ B) = P(A)·P(B)
- Indépendance et événements contraires

#### Variables aléatoires réelles

- Variable aléatoire X sur un univers fini
- Loi de probabilité de X (tableau)
- **Espérance** : E(X) = Σ x_i · P(X = x_i)
- **Variance** : V(X) = E((X - E(X))²) = E(X²) - E(X)²
- **Écart-type** : σ(X) = √V(X)
- Linéarité de l'espérance : E(aX + b) = aE(X) + b
- V(aX + b) = a²V(X)
- **Échantillon** (n épreuves indépendantes de même loi que X) : Sₙ = X₁ + ... + Xₙ
  - E(Sₙ) = n·E(X)
  - V(Sₙ) = n·V(X)
  - E(Sₙ/n) = E(X) ; V(Sₙ/n) = V(X)/n

### 2.5 Algorithmique et programmation (transversal Python)

- Variables, types (int, float, str, bool, list)
- Affectations, expressions
- Conditionnelles : if / elif / else
- Boucles : for (range), while
- Fonctions : def, paramètres, valeur retournée
- **Listes** : création, accès `L[i]`, longueur `len(L)`, ajout `L.append(x)`, parcours
- Algorithmes attendus : seuil pour suite, dichotomie, méthode de Newton, calcul d'espérance par simulation, etc.

### 2.6 Vocabulaire ensembliste et logique (transversal)

- Appartenance, inclusion, intersection, union, complémentaire
- Implication, équivalence
- Quantificateurs : ∀, ∃ (lecture, sens)
- Contre-exemple, raisonnement par disjonction de cas, par l'absurde

## 3. Liste des automatismes évaluables (Partie 1 du QCM, 6 points)

Source : Note de service MENE2516240N du 10 juin 2025, applicable à la session 2026 (rentrée 2025-2026 uniquement). Les automatismes mobilisent des notions de **seconde et de première**.

### 3.1 Calcul numérique et algébrique
- Opérations sur les fractions, puissances (entières, négatives), racines carrées simples
- Identités remarquables : (a+b)², (a-b)², (a-b)(a+b)
- Développer, factoriser, réduire une expression
- Résoudre une équation/inéquation du premier degré
- Isoler une variable dans une formule

### 3.2 Proportions et pourcentages
- Calculer un pourcentage d'une quantité
- Augmentation/diminution en pourcentage (coefficient multiplicateur)
- Pourcentage d'évolution (t = (V_f - V_i)/V_i)
- Évolutions successives (produit des coefficients)
- Évolution réciproque

### 3.3 Évolutions et variations
- Taux de variation
- Coefficient multiplicateur
- Indice
- Variation absolue / relative

### 3.4 Fonctions et représentations
- Reconnaître graphiquement : fonction affine (droite), carré (parabole), inverse (hyperbole), cube
- Lire image, antécédent sur un graphique
- Sens de variation à partir d'un graphique
- Résoudre graphiquement f(x) = k, f(x) ≥ k

### 3.5 Statistiques
- Calculer/interpréter moyenne, médiane, quartiles
- Comparer des distributions (boîtes à moustaches)
- Lire histogrammes, diagrammes en barres/circulaires/boîtes

### 3.6 Probabilités
- Probabilité comprise entre 0 et 1
- Probabilité de l'événement contraire : P(Ā) = 1 - P(A)
- Probabilité d'un événement comme somme des probabilités des issues
- Cas d'équiprobabilité : favorables/possibles

## 4. Compétences mathématiques transversales (six compétences du programme)

1. Chercher, expérimenter
2. Modéliser, simuler
3. Représenter, choisir un cadre
4. Raisonner, démontrer
5. Calculer, mettre en œuvre des algorithmes
6. Communiquer un résultat

## 5. Format des sujets — sujets zéro publiés

Trois sujets zéro officiels publiés sur eduscol pour la voie générale spé maths. Structure type :
- **Partie 1** : QCM automatismes (~12-15 questions, 6 points). Une mauvaise réponse peut retirer des points.
- **Partie 2** : 2 à 3 exercices indépendants. Mélange de chapitres. Format type :
  - 1 exercice analyse (dérivation, exponentielle, suite)
  - 1 exercice géométrie (produit scalaire, repère)
  - 1 exercice probabilités OU algèbre

## 6. Règles de conception pour exercices et formules

**À respecter impérativement** :
1. Tous les calculs faisables sans calculatrice (privilégier valeurs entières, fractions simples, racines simples)
2. Notations conformes au BO (uₙ et non u_n en texte courant ; e^x et non exp(x) en première intention)
3. Rigueur de rédaction conforme aux attendus du bac (justifications, "donc", "or", "ainsi")
4. Niveau cognitif adapté : automatismes (rapidité, sans rédaction), classiques (méthode connue), type bac (problème ouvert avec questions guidant le raisonnement)
5. Toute capacité hors programme est interdite (ex : continuité formalisée, intégrales, ln, raisonnement par récurrence formel — réservés à la terminale)

**Hors programme de première (à NE PAS utiliser)** :
- Logarithme népérien (terminale)
- Intégrale, primitive (terminale)
- Loi binomiale formelle avec coefficients binomiaux (terminale)
- Limites de suites/fonctions formalisées (terminale)
- Continuité, théorème des valeurs intermédiaires (terminale)
- Récurrence formelle (terminale)
- Convexité formalisée (terminale)
- Géométrie dans l'espace (terminale)
- Nombres complexes (mathématiques expertes)

## 7. Sources de référence

- BO spécial n°1 du 22 janvier 2019 : programme de spécialité mathématiques de première
- Décret n°2025-513 du 10 juin 2025 : instauration de l'EAM
- Note MENE2515469N : définition de l'épreuve
- Note MENE2516240N : automatismes évaluables 2025-2026
- Sujets zéro : https://eduscol.education.fr/5688/epreuve-anticipee-de-mathematiques-aux-baccalaureats-general-et-technologique
