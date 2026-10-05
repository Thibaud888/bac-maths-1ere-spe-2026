# Produire un chapitre en consommant moins — étude du 2026-10-05

> Étude seulement : rien n'est encore changé dans le circuit `/tle-chapitre`. Les pistes
> retenues sont au backlog (section « Terminale », phase 4), une par session.
> Contrainte posée par Thibaud : **la qualité des cours et des exercices ne baisse pas**.
> Aucune piste ne touche aux relectures bloquantes, aux règles de la charte, ni au modèle et
> au niveau de réflexion des agents qui écrivent et qui relisent.

## L'essentiel

- **Un chapitre complet coûte aujourd'hui ≈ 100 $ au tarif public** (Acides, bases et pH :
  cours + exercices). La semaine du 28 septembre (Dénombrement, le début de Récurrence et
  d'Acides-bases, trois petites sessions) a atteint la limite hebdomadaire du forfait après
  ≈ 350 $ de sessions sur ce dépôt.
  À ce rythme : **3 à 4 chapitres par semaine au mieux**, pour une trentaine de chapitres à
  écrire.
- **Le texte du chapitre ne pèse presque rien** : ≈ 2 % de la dépense. Le reste, c'est
  relire encore et encore les mêmes documents (programme, charte, fichiers du chapitre) et la
  mémoire de la session principale, qui grossit jusqu'à 530 000 tokens.
- **Cinq pistes, sans toucher à la qualité : −35 à −45 % par chapitre** (≈ 100 $ → 55-65 $),
  soit 5 à 6 chapitres par semaine au lieu de 3 à 4.
- **Un piège à désamorcer avant d'avancer dans l'année** : l'auteur du cours relit en entier
  les cours des chapitres précédents. Plus il y a de chapitres écrits, plus chaque nouveau
  chapitre coûte cher (jusqu'à +10 % en fin d'année, et un risque de saturer sa mémoire).

| Piste | Ce qui change pour toi | Gain estimé |
|---|---|---|
| 1. Une session principale légère | rien de visible ; une session par partie (cours, puis exercices) | −15 à −20 % |
| 2. Une fiche de lecture par chapitre | rien de visible ; chaque agent lit l'utile, pas tout | −8 à −12 %, et plus de hausse en fin d'année |
| 3. Contrôles automatiques avant relecture | moins de tours de relecture ; les défauts mécaniques sont tous trouvés | −8 à −12 % |
| 4. Des sessions sans coupure | un chapitre à la fois, jamais deux en parallèle | −3 à −5 % |
| 5. Réflexion dosée et consignes allégées | rien de visible | −3 à −5 % |

Les gains ne s'additionnent pas tout à fait (les pistes 1 et 4 se recouvrent) : d'où
−35 à −45 % au total.

---

## 1. Ce qui a été mesuré

Relevés des sessions (outil `get_session` et événements `result` de la session distante),
tous au tarif public (`costBasis: list`), modèle Opus, réflexion `xhigh` :

| Session | Périmètre | Coût | Écrit en mémoire | Relu en mémoire | Produit (dont réflexion) | Mémoire finale de la session principale |
|---|---|---|---|---|---|---|
| Acides, bases et pH | cours + exercices (+ 2 retouches du site) | **98,7 $** | 9,4 M | 128,5 M | 1,06 M (0,63 M) | 531 k |
| Dénombrement | cours + exercices + 3 PR d'interface (#98, #100, #101) | 216,9 $ | 14,1 M | 420,0 M | 2,72 M (1,60 M) | 564 k |
| Récurrence et suites | cours, arrêté au milieu (limite de 5 h) | 48,0 $ | 3,6 M | 70,1 M | 0,71 M (0,42 M) | 368 k |

Le chapitre Dénombrement, premier de la série, a aussi servi à roder l'interface : on prend
Acides-bases (≈ 100 $) comme référence d'un chapitre.

**Prix unitaires déduits des relevés** (cohérents sur les trois sessions, par million de
tokens) : relire la mémoire **0,20 $** ; écrire en mémoire **5 $** (agents) à **8 $**
(session principale, mémoire d'une heure) ; produire du texte **≈ 20 $**. On suppose que la
limite du forfait suit ce coût.

**Où partent les 99 $ d'Acides-bases :**

| Poste | Tokens | Coût | Part |
|---|---|---|---|
| Écrire en mémoire (chaque fichier lu, chaque résultat d'outil, chaque agent qui démarre) | 9,4 M | ≈ 52 $ | 52 % |
| Relire la mémoire (à chaque pas, tout le contexte est relu) | 128,5 M | ≈ 26 $ | 26 % |
| Produire (réflexion 59 %, rapports, fichiers) | 1,06 M | ≈ 21 $ | 21 % |
| dont le texte final du chapitre (313 Ko ≈ 95 k tokens) | 0,1 M | ≈ 2 $ | 2 % |

Répartition estimée (les relevés donnent des totaux, pas le détail par agent) : la session
principale ≈ 1,5 M tokens écrits à 8 $ + ses relectures → **environ un tiers** ; les ≈ 20
lancements d'agents (architecte, auteurs, 5 à 7 relectures, élève-testeur, corrections)
→ **environ deux tiers**. Exemple mesuré : le tour qui a ouvert la PR #106 (vérification,
commit, PR) a fait 17 appels à ≈ 460 k tokens de mémoire chacun, soit 7,8 M tokens relus
(≈ 1,6 $), sans écrire une ligne de contenu.

## 2. Pourquoi ça coûte

**a. Chaque agent repart de zéro et relit tout.** Avant d'écrire une ligne, un agent charge
(estimation : 1 token ≈ 3,3 octets) :

| Document | Taille | Ce qui sert vraiment au chapitre |
|---|---|---|
| `CLAUDE.md` (chargé d'office) | 9 k | ≈ la moitié (le volet français et la première ne servent pas) |
| charte `terminale-charte` | 12 k | les sections du rôle |
| référentiel de la matière | 9 k | limites, hors programme, notations, format de l'épreuve |
| `programme.json` | 22 k (maths) / 43 k (PC) | **2 k** (les lignes du chapitre) |
| `annales.json` (maths ; architecte, auteur-bac) | **161 k** | **5 k** (les 25 exercices qui touchent au dénombrement) |
| fichiers du chapitre (relecteur, au stade exercices) | 87 k | tout, au 1er tour ; quelques items aux tours 2 et 3 |
| `cours.json` de chaque chapitre antérieur (auteur-cours) | 21 k chacun | **1 k** (l'index des notions et des blocs) |

**b. La session principale garde tout en mémoire.** Elle lit la charte en entier, reçoit
des rapports d'agents de 60 lignes et plus (20 demandées), les sorties des scripts, jusqu'à
20 captures d'écran (5 pages × clair/sombre × 2 largeurs), et — pour Dénombrement — tout le
travail d'interface. Sa mémoire monte à 530-565 k tokens ; **chaque** pas la relit en entier
(≈ 0,10 $ le pas en fin de chapitre).

**c. Les relectures repartent du début.** Au tour 2 ou 3, le relecteur recharge tout le
chapitre alors que quelques items ont changé ; les défauts mécaniques (indice qui donne la
valeur à saisir, nombre d'indices, formule KaTeX cassée, renvoi `revoir` faux) coûtent un
tour entier. Les sessions ont réécrit à la main, à chaque fois, des petits contrôles
(« quotients-reponse.mjs », « controle-indices.mjs », « 504 formules KaTeX, 0 erreur ») qui
ne sont pas restés dans `scripts/`.

**d. Les coupures se paient.** Deux chapitres lancés en parallèle le 1er octobre ont atteint
les limites : Récurrence s'est arrêté au milieu (48 $ engagés), Acides-bases a repris 4 jours
plus tard en réécrivant 375 k tokens de mémoire (≈ 3 $). Un redémarrage de l'environnement a
réécrit 524 k tokens (≈ 4 $) pour un message « rien à faire ». Un agent relancé (correction
après relecture) plus de 5 minutes après son dernier pas réécrit toute sa mémoire (elle n'est
gardée que 5 minutes).

**e. Réflexion maximale partout.** Toutes les sessions tournent en `xhigh`, y compris la
session principale qui ne fait que coordonner : 59 % des tokens produits sont de la
réflexion.

**f. Le piège de fin d'année.** L'auteur du cours lit « les `cours.json` des chapitres
antérieurs » (≈ 21 k chacun). Au 15e chapitre de maths, ≈ 290 k tokens rien que pour ça, à
chaque lancement de l'auteur et de ses corrections.

## 3. Les pistes

### Piste 1 — une session principale légère (−15 à −20 %)

- **Une session par partie** : « cours » dans une session, « exercices » dans une nouvelle
  session (c'est déjà l'esprit de `/tle-chapitre`, mais les deux chapitres ont tout fait d'une
  traite), et **jamais de travail d'interface** dans une session de chapitre.
- La session principale **ne lit pas la charte en entier** : § 12 (circuit) et § 9.4
  (« fini ») suffisent pour coordonner ; ni le référentiel.
- **Rapports d'agents dans un fichier** (dossier temporaire) : la session ne reçoit que le
  verdict, les compteurs et la liste des défauts (≤ 20 lignes, comme déjà demandé).
- **Rendu vérifié par un script** : captures prises et contrôlées automatiquement (pas de
  défilement horizontal, aucune erreur KaTeX dans la page, aucune erreur de console) ; la
  session ne regarde que 4 images choisies, pas 20.

Calcul : mémoire moyenne de la session principale ≈ 250-300 k → ≈ 80-100 k ; relectures
−65 % (≈ −7 à −13 $), écritures 1,5 M → ≈ 0,5 M (≈ −8 $). **Qualité : inchangée**, la
session principale n'écrit aucun contenu.

### Piste 2 — une fiche de lecture par chapitre (−8 à −12 %, et plus de hausse)

Un script `scripts/contexte-chapitre.mjs <matiere> <slug> [--role …]` assemble ce dont un
agent a besoin, dans un seul fichier :

- les lignes du programme du chapitre (+ celles des chapitres antérieurs qu'il peut citer) et
  l'ordre des chapitres (pour « jamais un chapitre ultérieur ») ;
- les formulations des annales pour ces lignes (161 k → 5 k) ;
- l'index des chapitres antérieurs : notions, identifiants et titres des blocs (21 k → 1 k
  par chapitre) — de quoi « ne pas redire » et faire les renvois ;
- les sections du référentiel utiles au rôle (format de l'épreuve pour `tle-auteur-bac`,
  limites et hors programme pour tous).

Les agents lisent cette fiche au lieu des sources complètes, qui restent ouvertes en cas de
doute ; `programme-conforme.mjs` et `couverture-terminale.mjs` continuent de tout contrôler.
Calcul : −30 k (maths) à −50 k (physique-chimie) tokens au démarrage de chacun des ≈ 20
lancements, puis à chacun de leurs pas → ≈ −6 à −11 $. Au fil de l'année, évite en plus
jusqu'à +8 à +10 $ par chapitre (piège f). **Qualité : même information**, mieux ciblée.

### Piste 3 — contrôles automatiques avant relecture, relectures ciblées (−8 à −12 %)

- **Un script de contrôles mécaniques** (ou une extension de `couverture-terminale.mjs`)
  que l'auteur lance avant de rendre son fichier : indice qui contient la valeur à saisir,
  nombre d'indices par marche, chaque formule compilée par KaTeX, renvois `revoir` et `de`
  existants, virgule décimale `{,}`, unité sur chaque grandeur (physique-chimie), somme des
  points d'un type bac, tutoiement. Règle du dépôt : « à la 3e récurrence, écris l'outil ».
- **Tours 2 et 3 ciblés** : le relecteur reçoit la liste des items modifiés, extraits par un
  script, et son rapport précédent — il refait toutes ses passes sur ces items, sans
  recharger le chapitre entier. La couverture complète reste vérifiée par le script final.
- **Corrections dans la foulée** : renvoyer le rapport à l'auteur dans les 5 minutes, ou
  lancer un correcteur neuf qui ne lit que les items en cause, plutôt que de réveiller un
  auteur dont la mémoire (≈ 300 k) a expiré.

Calcul : une relecture complète coûte ≈ 3 à 4 $ ; un tour évité par partie et des tours 2-3
au tiers du prix → ≈ −8 à −12 $. **Qualité : en hausse** sur les défauts mécaniques (un
script ne se fatigue pas) ; mêmes passes bloquantes pour le reste.

### Piste 4 — des sessions sans coupure (−3 à −5 %)

- **Un chapitre à la fois**, jamais deux sessions de chapitre en parallèle (elles se
  partagent la même limite et s'arrêtent toutes les deux au milieu).
- Après une coupure de plus d'une heure, **repartir d'une session neuve** avec la note de
  reprise (`/handoff`) plutôt que de réveiller une session de 400-500 k tokens.

### Piste 5 — réflexion dosée, consignes allégées (−3 à −5 %)

- Session principale en réflexion `high` (`/effort high`) ; **auteurs, relecteur,
  architecte et élève-testeur restent en `xhigh`** (champ `effort` de leur fiche, à vérifier
  sur un agent avant de généraliser).
- `CLAUDE.md` chargé par tous les agents à chaque pas : sortir le volet français (§ 13) dans
  un fichier lu seulement quand on travaille le français (−4,5 k tokens partout, ≈ −1 %, et
  toutes les autres sessions en profitent).

### Écarté (risque pour la qualité)

- Un modèle plus petit pour les auteurs ou le relecteur ; moins de tours de relecture ;
  supprimer l'élève-testeur ; baisser les quotas.
- À n'essayer qu'après un test à l'aveugle sur un chapitre existant : un modèle plus petit
  pour `tle-eleve-testeur` (il joue un élève moyen ; ≈ −4 % s'il trouve les mêmes blocages).

## 4. Mesurer avant et après

Sans mesure, on ne saura pas si les pistes tiennent leurs promesses. À ajouter à
`/tle-chapitre` dès la prochaine session (coût nul) : en fin de partie, relever l'usage de
la session (`get_session` sans identifiant → `usage`) et l'écrire dans le corps de la PR —
coût au tarif public, tokens écrits, relus, produits ; et pour chaque agent, les
`total_tokens` que rend son lancement. Référence : **Acides-bases, 98,7 $ pour les deux
parties**.

## 5. Ordre proposé

1. Mesurer (§ 4) + piste 1 (session légère) + piste 4 (hygiène) — modifications de
   `.claude/commands/tle-chapitre.md` seulement ; à faire avant le prochain chapitre.
2. Piste 2 (fiche de lecture) — un script + les fiches des six agents ; avant que les
   chapitres antérieurs s'accumulent.
3. Piste 3 (contrôles automatiques, relectures ciblées) — un script + `tle-relecteur`,
   `tle-auteur-*`.
4. Piste 5 (réflexion dosée, `CLAUDE.md` allégé).
