# Terminale — maths et physique-chimie : le plan directeur

> Décidé le 2026-09-24. Ce dossier cadre les espaces `/terminale/maths` et
> `/terminale/physique-chimie` : ce qu'ils contiennent, la forme des pages, et la méthode
> que suivront les sessions qui les rempliront. **Aucun contenu n'est écrit ici.**
>
> - Ce fichier : la vision, la structure, la feuille de route.
> - `chapitres-maths.md`, `chapitres-physique-chimie.md` : le découpage proposé, notion par
>   notion, avec une première estimation des priorités (à confirmer, voir § 7).
> - `.claude/skills/terminale-charte/SKILL.md` : **la charte de construction** — les règles
>   que suivent les agents et les sessions (format des données, des cours, des exercices,
>   des pages). C'est elle qui fait foi en cas d'écart avec ce plan.
> - `.claude/agents/tle-*.md` et `/tle-chapitre` : les agents et la procédure d'un chapitre.

---

## 1. En bref (pour Thibaud)

En première, le site servait à **réviser** une épreuve. En terminale, il doit permettre de
**faire toute l'année** : apprendre le cours, le comprendre, s'entraîner, puis préparer le bac.

Chaque chapitre suit le même chemin, en cinq onglets :

| Onglet | Ce que l'élève y fait |
|---|---|
| **Aperçu** | Voit les notions du chapitre, **les plus importantes pour le bac en tête**, et où il en est. |
| **Cours** | Lit une leçon claire, notion par notion : l'idée, la définition, un exemple pas à pas, la méthode, le piège à éviter — avec de petites questions pour vérifier qu'il a compris. |
| **Exercices** | Monte trois marches : *Comprendre* (réponses courtes corrigées tout de suite), *S'entraîner* (les méthodes du cours, avec indices), *Approfondir* (plusieurs notions à la fois). |
| **Type bac** | Fait des exercices au format de l'épreuve, avec le barème et ce qu'attend le correcteur. |
| **Mémo** | Garde l'essentiel sous les yeux (formules, propriétés, méthodes) et se teste en questions éclair. |

**Ce qui compte le plus au bac passe devant.** Chaque notion porte une étiquette —
*Incontournable*, *Fréquent* ou *Plus rare* — tirée du décompte des sujets de bac des
années passées (« tombé dans 9 sujets sur 10 depuis 2021 »). L'étiquette est affichée, et
elle range aussi le site : les incontournables sont en tête des listes, ont le plus
d'exercices, et forment le parcours « Réviser l'essentiel ».

**Rien hors programme, tout le programme.** Chaque cours, exercice ou carte est rattaché
à une ligne précise du programme officiel. Un contrôle automatique refuse ce qui ne se
rattache à rien et signale ce qui n'est encore couvert par rien.

**Qui écrit ?** Des agents spécialisés, jamais seuls : un architecte découpe le chapitre, des
auteurs écrivent (cours, exercices, sujets type bac), un relecteur vérifie l'exactitude et
le programme, un « élève-testeur » vérifie que tout se comprend sans professeur.

---

## 2. Ce qui change par rapport à la première

La première est complète et sert de base, pas de moule. Ce qu'on garde, ce qu'on change :

| Première (révision de l'épreuve anticipée) | Terminale (toute l'année) | Pourquoi |
|---|---|---|
| Pas de cours : formulaire seulement | **Cours complet**, notion par notion | L'élève doit pouvoir apprendre seul. |
| Le chapitre est l'unité | **La notion** est l'unité (3 à 7 par chapitre) | Priorité, progression et couverture se mesurent à ce grain. |
| Priorité portée par la carte de formule (`essentiel`…) | Priorité portée par **la notion**, justifiée par les annales | Ce qui tombe au bac, pas ce qui « semble » important. |
| Onglets par type (automatismes, classiques, type bac) | **Trois marches d'exercices** + type bac | Difficulté croissante explicite. |
| Automatismes = partie 1 de l'épreuve | **Questions éclair** au service de la mémoire | L'épreuve de terminale n'a pas de partie automatismes (à confirmer, § 7). |
| Sans calculatrice | **Calculatrice autorisée** (mode examen) ; chaque exercice dit si elle sert | Règle de l'épreuve de terminale. |
| Progression par item réussi | Progression **par notion** : à découvrir → découverte → comprise → maîtrisée | L'élève voit ce qu'il sait, pas ce qu'il a cliqué. |

On **réutilise** sans les déplacer : `ExerciseRunner` + `HintSystem` (indices progressifs),
`ExamRunner` + `Timer` (type bac), `FormulaCard` / `SimplifiedFormulaCard` (mémo),
`QcmRunner` (questions éclair), les figures (`FigureRenderer` : image, arbre), `PageLongue`,
`Essentiel` et `Sommaire` (pages de lecture), `BacBlancRunner` (sujets complets, plus tard).
Le type de question « remettre dans l'ordre » du quiz de français servira aussi (étapes
d'une démonstration). Les **schémas de première ne sont pas modifiés** : la terminale a les
siens (`schemas/terminale/`), les composants s'y branchent par de fines adaptations.

---

## 3. Ce que l'élève doit trouver pour réussir son année

Pensé à partir de ce dont un élève a besoin à chaque moment de l'année :

1. **Pendant qu'on fait le chapitre en classe** — relire le cours autrement, avec des
   exemples détaillés ; vérifier tout de suite qu'il a compris ; faire des exercices
   *Comprendre* et *S'entraîner* avec de l'aide graduée.
2. **Avant un contrôle** — le mémo du chapitre, les questions éclair, les exercices
   *Approfondir*, les pièges fréquents.
3. **Au fil des semaines** — ne pas oublier : les questions éclair reviennent à intervalles
   croissants (répétition espacée), les erreurs passées reviennent (« mes erreurs »).
4. **À l'approche du bac** — le parcours « Réviser pour le bac » (incontournables d'abord,
   tous chapitres confondus), les exercices type bac, des sujets complets chronométrés.
5. **Toute l'année** — des repères : où il en est notion par notion, ce qu'il lui reste
   d'important, et des liens entre matières (l'équation différentielle en maths ↔ la charge
   d'un condensateur en physique ; l'exponentielle ↔ la décroissance radioactive).

Ce qu'il **ne** trouve **pas** : du contenu hors programme, du remplissage, des exercices qui
demandent une notion pas encore vue (le *Type bac* mélange volontairement les notions du
chapitre et des chapitres précédents, jamais celles d'un chapitre à venir).

---

## 4. Structure du site

### 4.1 Adresses

```
/terminale/maths                         accueil de la matière
/terminale/maths/<chapitre>              Aperçu
/terminale/maths/<chapitre>/cours
/terminale/maths/<chapitre>/exercices    (?niveau=1|2|3 & ?notion=<id>)
/terminale/maths/<chapitre>/type-bac
/terminale/maths/<chapitre>/memo
/terminale/maths/methodes                chapitre transverse « Méthodes » (logique, Python, rédaction…)
/terminale/maths/reviser                 « Réviser pour le bac » (phase 5)
/terminale/maths/sujets                  sujets complets chronométrés (phase 5)
```

Même arborescence pour `/terminale/physique-chimie`, plus `/terminale/physique-chimie/pratique`
(épreuve pratique, phase 5). Les deux matières sont servies **par les mêmes composants**,
paramétrés par la matière : ajouter plus tard une autre matière de terminale (maths
expertes, SVT…) = un dossier de contenu + un référentiel + une entrée dans `SPACES`.

### 4.2 Accueil d'une matière

- En tête : « Reprendre » (le dernier chapitre ouvert) et, s'il y en a, « À revoir en
  priorité » (les incontournables pas encore maîtrisés).
- Les chapitres **dans l'ordre de l'année**, groupés par grand domaine, chacun avec sa
  progression (anneau) et son poids au bac.
- Liens vers les méthodes transverses (et plus tard la révision et les sujets complets).

### 4.3 Page d'un chapitre (cinq onglets)

- **Aperçu** — « L'essentiel » en trois idées ; la carte des notions (titre, étiquette de
  priorité, état de l'élève, « ce que le bac demande » en une ou deux formulations réelles
  tirées des sujets) ; les rappels de première utiles (liens vers `/premiere/maths/...`) ;
  deux entrées : **Apprendre le chapitre** (ordre du cours) et **Réviser l'essentiel**
  (incontournables d'abord).
- **Cours** — gabarit `PageLongue` (sommaire collé à droite sur grand écran, une section
  numérotée par notion, l'étiquette de priorité dans le titre de section). Blocs typés :
  l'idée, définition, propriété, démonstration, exemple pas à pas, méthode, piège,
  à retenir, rappel de première, « vérifie que tu as compris », figure, figure animée.
  Le texte n'est jamais replié ; seules les réponses et les étapes d'un exemple se
  dévoilent à la demande. Chaque notion se termine par un lien vers ses exercices.
- **Exercices** — trois marches (*Comprendre*, *S'entraîner*, *Approfondir*), filtrables par
  notion ; dans chaque marche, les incontournables d'abord. Chaque carte indique durée,
  calculatrice ou non, et l'état (fait, réussi).
- **Type bac** — barème, durée indicative, chronomètre facultatif, correction avec « ce
  qu'attend le correcteur ». Sources citées quand l'exercice est adapté d'un vrai sujet.
- **Mémo** — les cartes (formules, propriétés, méthodes-clés) rangées par priorité, avec le
  mode « simplifié » de la première ; puis « Teste-toi » (questions éclair du chapitre).

### 4.4 Navigation

Rien à inventer : la barre latérale groupe déjà les espaces par année (`src/lib/spaces.ts`).
La fonction `sections()` des espaces `tle-maths` et `tle-physique-chimie` listera les
chapitres par domaine, comme en première, avec les méthodes transverses en tête. Les onglets
du chapitre passent par `SectionTabs`, comme `ChapterLayout`.

---

## 5. Faire passer l'important devant

L'exigence la plus forte de Thibaud. Trois leviers, qui s'additionnent :

### 5.1 La mesure — d'où vient l'étiquette

- Chaque notion reçoit une priorité : **3 = Incontournable**, **2 = Fréquent**,
  **1 = Plus rare**.
- Elle est **mesurée** : un index des sujets de bac 2021-2026 (même programme que l'élève)
  rattache chaque exercice aux lignes du programme qu'il mobilise ; un script compte, pour
  chaque notion, dans combien de sujets elle apparaît. Repères : ≥ 50 % des sujets →
  incontournable ; 20 à 50 % → fréquent ; < 20 % → plus rare.
- Le décompte ne compte que les sujets où la notion **pouvait** tomber : de 2021 à 2023,
  les épreuves de spécialité étaient prévues en mars et une partie du programme en était
  exclue (liste à relever session par session dans les notes de service). Les sujets
  depuis 2024 (épreuves en juin) portent sur tout le programme (à confirmer).
- Le décompte est fait par un script, sur un index **complet** des sujets depuis 2021 ;
  tant que l'index est partiel, aucun chiffre n'est publié.
- Une correction, toujours écrite avec sa raison : une notion **indispensable à d'autres**
  monte d'un cran (ex. les limites, sans lesquelles aucune étude de fonction).
- Tant que l'index n'existe pas, l'étiquette est une **estimation** (`chapitres-*.md`) et le
  site l'affiche comme telle (« estimation, en attente du décompte des sujets »).

### 5.2 Le dire — explicite

- Étiquette visible partout où la notion apparaît (aperçu, titre de section du cours,
  cartes d'exercice, mémo).
- Une ligne « Pourquoi » en clair : « Tombé dans 34 sujets sur 41 depuis 2021 » ou
  « Indispensable pour étudier une fonction ».
- « Ce que le bac demande » : les formulations réelles des sujets (« Démontrer par
  récurrence que… »), pour que l'élève les reconnaisse le jour J.

### 5.3 Le faire sentir — implicite

- **Ordre** : dans chaque liste (exercices, mémo, révision), les incontournables d'abord.
- **Quantité** : plus d'exercices pour une notion incontournable (quotas, § 5 de la
  charte) ; chaque incontournable apparaît dans au moins deux exercices type bac.
- **Parcours** : « Réviser l'essentiel » (chapitre) et « Réviser pour le bac » (matière)
  ne proposent que les incontournables et les fréquents ; les questions éclair du jour
  sont tirées au sort **pondéré par la priorité**.
- **Progression** : la barre d'un chapitre pèse les notions par leur priorité ; un
  chapitre « maîtrisé à 80 % » l'est sur ce qui compte.

---

## 6. Tout le programme, rien que le programme

- **Le référentiel** (un par matière) liste les lignes du programme officiel avec un
  identifiant (`bo-m-…` pour les maths, `bo-pc-…` pour la physique-chimie) et **le texte
  exact du Bulletin officiel** : contenus, capacités attendues, démonstrations exigibles,
  algorithmes, capacités expérimentales et numériques. Fichier
  `content/terminale/<matiere>/programme.json`, doublé d'un skill lisible par les agents.
- **Tout item de contenu cite les lignes qu'il travaille** (`capacites: [...]`). Le script
  de couverture refuse un identifiant inconnu : on ne peut pas écrire un exercice qui ne se
  rattache à rien du programme.
- **Couverture** : le même script vérifie que chaque ligne **exigible** du programme reçoit
  ce que sa nature demande (cours et exercices pour une capacité, un bloc de démonstration
  pour une démonstration exigible, un exercice pour un algorithme…) et que les quotas par
  priorité sont atteints. Les lignes transverses (logique, Python, incertitudes) vont dans
  un chapitre « Méthodes » propre à chaque matière ; les « approfondissements possibles »
  du programme ne sont jamais exigés. « Fini » est défini au § 9.4 de la charte.
- **Le relecteur** vérifie que le contenu n'utilise rien d'autre : pas de notion d'une
  option (maths expertes), pas de notion d'un programme futur, et, pour les acquis de
  première, seulement ceux du programme de première de spécialité.

Programme de référence : **celui de 2019** (Bulletin officiel spécial n° 8 du
25 juillet 2019) pour les deux matières. Le nouveau programme de maths de terminale publié
au BO du 2 avril 2026 ne s'applique qu'à la rentrée 2027 : l'élève ne le suit pas.
(À confirmer par la session référentiel, texte en main — § 7.)

---

## 7. Ce qui reste à confirmer, texte officiel en main

Écrit sans pouvoir ouvrir `education.gouv.fr` (bloqué par le réseau de la session). Les
sessions « référentiel » le confirment avant tout contenu :

- **Programmes en vigueur en 2026-2027** : 2019 pour les deux matières (recherche web du
  2026-09-24 : le programme de maths de terminale publié le 2 avril 2026 s'applique à la
  rentrée 2027).
- **Définition des épreuves 2027** : des notes de service du Bulletin officiel spécial
  n° 4 du 17 septembre 2026 redéfinissent les épreuves (au moins physique-chimie :
  `MENE2622644N`). Les sources `s-spe-maths` et `s-spe-physique-chimie` de
  `content/bac/sources.json` pointent encore vers les notes de 2020 — item de backlog.
  À relever : durée, calculatrice, structure (nombre d'exercices, points, QCM éventuel),
  programme évalué (tout le programme ? acquis de première ?), épreuve pratique.
- **Découpage en chapitres et notions** (`chapitres-*.md`) : proposition de cette session.
- **Priorités** : estimations de cette session, à remplacer par le décompte des annales.

---

## 8. Méthode de construction

### 8.1 Les rôles

| Agent | Rôle | Écrit |
|---|---|---|
| `tle-architecte` | Découpe un chapitre en notions, rattache chaque notion au programme, fixe priorité, prérequis et « ce que le bac demande » | `meta.json`, `notions.json` |
| `tle-auteur-cours` | Écrit le cours, notion par notion, et le mémo | `cours.json`, `memo.json` |
| `tle-auteur-exercices` | Écrit les trois marches d'exercices et les questions éclair | `exercices.json`, `flash.json` |
| `tle-auteur-bac` | Écrit les exercices au format de l'épreuve | `type-bac.json` |
| `tle-relecteur` | Vérifie exactitude, programme, niveau, cohérence (passes bloquantes). Recalcule tout. | rapport seulement |
| `tle-eleve-testeur` | Lit comme un élève seul : mot non expliqué, étape sautée, indice inutile, marche trop haute | rapport seulement |
| `annales-indexeur` | Indexe les sujets de bac passés : quelles lignes du programme, quelles formulations | `annales.json` |

Les quatre auteurs et l'architecte lisent tous **la charte** et **le référentiel de la
matière**. La procédure complète d'un chapitre est la commande `/tle-chapitre`.

### 8.2 Le circuit d'un chapitre

```
tle-architecte ─→ (contrôle : couverture du chapitre = toutes ses lignes du programme)
      │
      ├─→ tle-auteur-cours ─────┐
      ├─→ tle-auteur-exercices ─┼─→ tle-relecteur (bloquant) ─→ tle-eleve-testeur ─→ scripts ─→ captures ─→ PR
      └─→ tle-auteur-bac ───────┘         ↑ corrections, 3 relectures au plus, puis on demande à Thibaud
```

- Le cours passe **avant** les exercices : un exercice ne mobilise que ce que le cours a
  posé (le relecteur le vérifie).
- Contrôles automatiques : `node scripts/verify.mjs` (schémas inclus) et le script de
  couverture (identifiants du programme, quotas par priorité, doublons).
- Regard final sur le rendu réel (Chromium préinstallé) : cours, une marche d'exercices,
  un type bac, en clair et en sombre, sur ordinateur et en largeur téléphone.

### 8.3 Découpage en sessions

1 session = 1 item = 1 PR. Un chapitre = **deux items** par défaut :
« Chapitre X : le cours » (architecte + cours + mémo) puis « Chapitre X : les exercices »
(trois marches + questions éclair + type bac). Le chapitre pilote dira si un seul item
suffit, et fixera les quotas (charte § 5.3, provisoires jusque-là).

---

## 9. Feuille de route

Les items correspondants sont dans `BACKLOG.md` (section « Terminale : maths et
physique-chimie »), titres en clair.

| Phase | Items | Prérequis | En parallèle ? |
|---|---|---|---|
| **1. Fondations** | Référentiel maths ; référentiel physique-chimie ; références officielles des épreuves 2027 | accès réseau à `education.gouv.fr` / `eduscol` | oui, entre eux et avec la phase 2 |
| **2. Mécanique** | Schémas + chargeur + script de couverture ; pages Aperçu + Cours ; pages Exercices + Type bac + Mémo + progression | la charte (faite) | oui avec la phase 1 |
| **3. Pilotes** | Premier chapitre de maths complet ; premier chapitre de physique-chimie complet ; retour de Thibaud → charte ajustée | phases 1 et 2 | maths et physique en parallèle |
| **4. Production** | La page « Méthodes » de chaque matière ; puis un chapitre à la fois, dans l'ordre de l'année (deux items par chapitre) | pilotes | plusieurs sessions en parallèle, un chapitre chacune |
| **4 bis. Mesure** | Index des annales maths puis physique-chimie → priorités mesurées | référentiel + accès réseau aux annales | oui, à tout moment après la phase 1 |
| **5. Réviser et donner envie** | Répétition espacée et « mes erreurs » ; « Réviser pour le bac » ; sujets complets chronométrés ; figures animées ; épreuve pratique de physique-chimie ; fiches imprimables | phase 4 entamée | oui |

**Urgence** : l'année a commencé. Le premier chapitre utile doit arriver vite : les
phases 1 et 2 tournent en parallèle, et la production suit **l'ordre de la classe**
(question posée à Thibaud le 2026-09-24).

---

## 10. Idées retenues pour plus tard (phase 5)

- **Répétition espacée** : les questions éclair réussies reviennent à 1, 3, 7, 14, 30 jours ;
  les ratées, le lendemain. « Tes questions du jour » sur l'accueil de la matière.
- **Mes erreurs** : chaque question ratée est gardée ; un bouton les rejoue.
- **Figures animées** (JSXGraph, chargé seulement là où il sert) : suite qui converge,
  tangente qui glisse, valeurs intermédiaires, aire sous une courbe par rectangles, loi
  binomiale avec curseurs n et p ; chute d'un projectile, charge d'un condensateur, courbe
  de titrage. Une figure animée = un composant React testé, appelé depuis le cours par son
  nom ; jamais de code dans le JSON.
- **Liens entre matières** : blocs « Et en physique ? » / « Et en maths ? » (sans jamais
  introduire une notion absente du programme de la matière où ils s'affichent) ; lien vers
  le grand oral (questions adossées aux spécialités).
- **Fiches imprimables** : le mémo d'un chapitre en une page A4 (feuille de style
  d'impression, sans dépendance).
- **Épreuve pratique de physique-chimie** : capacités expérimentales, protocoles commentés,
  incertitudes, entraînement sur des sujets de la banque officielle.
- **À demander avant d'engager** (dépendance nouvelle) : exécuter du Python dans le
  navigateur pour les exercices d'algorithmique (Pyodide, lourd) — en attendant, sortie du
  programme donnée et questions « que renvoie ce script ? ».

---

## 11. Risques et garde-fous

| Risque | Garde-fou |
|---|---|
| Contenu faux (erreur de calcul, de signe, d'unité) | Relecteur qui **recalcule** (il a le droit d'exécuter `python3` pour ça) ; tolérance numérique explicite ; unités obligatoires en physique. |
| Contenu hors programme | Identifiants du programme obligatoires + script + passe « programme » du relecteur. |
| Cours incompréhensible seul | Élève-testeur ; règles d'écriture de la charte (l'idée avant la définition, un exemple par définition, pas d'étape sautée). |
| Volume énorme (≈ 30 chapitres) | Deux items par chapitre, sessions parallèles, quotas plancher (pas de surproduction). |
| Priorités « au jugé » | Mesure sur annales ; estimation affichée comme telle en attendant. |
| Programme qui change (rentrée 2027) | Le site suit le programme de 2019 ; les identifiants du programme permettront de comparer avec le nouveau si le site sert à d'autres élèves. |
| Régression de la première | Schémas de première intouchés ; préfixes de stockage distincts : `btm-2027-` (maths), `bpc-2027-` (physique-chimie). |
