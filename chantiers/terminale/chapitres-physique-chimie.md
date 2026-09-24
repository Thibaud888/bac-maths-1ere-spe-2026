# Physique-chimie de terminale — découpage proposé

> **Proposition du 2026-09-24, à confirmer** par la session « référentiel physique-chimie »
> (texte du programme en main) puis par `tle-architecte`, chapitre par chapitre. Programme de
> référence : spécialité de terminale, **BO spécial n° 8 du 25 juillet 2019**. D'après la
> note de service de septembre 2026 (à relire), l'écrit porte sur le programme de terminale,
> et les notions de première non reprises en terminale doivent rester mobilisables.
>
> Priorités : **estimations** (souvenir des sujets depuis 2021), à remplacer par le décompte des
> annales. Légende : ★★★ incontournable · ★★ fréquent · ★ plus rare. Garde-fou de la charte
> (§ 5.1) : au plus la moitié des notions d'un chapitre en ★★★ sans mesure des annales.

## Particularités de la matière (à respecter par tous les agents)

- **Deux épreuves** : l'écrit (3 h 30, 80 % de la note) et la **partie pratique** (1 h en
  salle de TP, 20 %, début juin). La partie pratique a son propre espace (phase 5) ; les
  capacités expérimentales du programme apparaissent dès le cours (bloc « expérience »).
- **Grandeurs, unités, chiffres significatifs** : toute réponse numérique a une unité et un
  nombre de chiffres significatifs cohérent avec les données ; le relecteur recalcule.
- **Documents** : les sujets s'appuient sur des documents (texte, graphe, tableau de
  données, spectre). Les exercices type bac en fournissent ; les « données » sont en tête
  d'énoncé.
- **Résolution de problème** : question ouverte où la démarche est évaluée ; au moins un
  exercice par chapitre en marche *Approfondir* ou *Type bac*.
- **Rappels de première** : la physique-chimie de première n'a pas d'espace sur le site.
  Les prérequis de première (quantité de matière, oxydoréduction, énergie mécanique,
  ondes mécaniques…) sont donc traités **dans le cours de terminale**, en blocs « rappel »
  courts, rattachés aux lignes du programme de première (`bo-pc1-…`, listées par le
  référentiel).
- **Mesure et incertitudes**, **capacités numériques** (Python) et **capacités
  mathématiques** : transverses, page « Méthodes » de la matière.

## Chapitres

**Proposition** (décision du 2026-09-24 : pas de progression de classe fournie) : l'ordre
alterne chimie et physique, comme la plupart des progressions de classe, et place tôt ce
qui revient le plus au bac (acides et bases, mouvement, titrages, cinétique). **Thibaud dira
quel chapitre écrire d'abord** ; par défaut, le premier.

| # | Slug | Chapitre | Thème du programme | Poids estimé |
|---|---|---|---|---|
| 1 | `acides-bases` | Transformations acide-base, pH | Constitution et transformations de la matière | ★★★ |
| 2 | `mouvement` | Décrire un mouvement | Mouvement et interactions | ★★★ |
| 3 | `analyse-physique` | Analyser un système par des méthodes physiques (absorbance, conductivité, spectroscopies) | Constitution… | ★★★ |
| 4 | `newton-champ-uniforme` | Deuxième loi de Newton, mouvement dans un champ uniforme | Mouvement et interactions | ★★★ |
| 5 | `titrages` | Analyser un système par des méthodes chimiques : titrages | Constitution… | ★★★ |
| 6 | `satellites-planetes` | Mouvement des satellites et des planètes | Mouvement et interactions | ★★ |
| 7 | `cinetique` | Évolution temporelle d'une transformation : cinétique | Constitution… | ★★★ |
| 8 | `radioactivite` | Décroissance radioactive | Constitution… | ★★ |
| 9 | `ondes` | Phénomènes ondulatoires : son, diffraction, interférences, Doppler | Ondes et signaux | ★★ |
| 10 | `force-acides-bases` | Force des acides et des bases, pKa | Constitution… | ★★★ |
| 11 | `sens-evolution` | Sens d'évolution spontanée, piles ; forcer le sens : électrolyse | Constitution… | ★★ |
| 12 | `circuit-rc` | Dynamique d'un système électrique : circuit RC | Ondes et signaux | ★★ |
| 13 | `lunette-photons` | Lunette astronomique ; lumière et photons | Ondes et signaux | ★★ |
| 14 | `synthese-organique` | Stratégies en synthèse organique | Constitution… | ★★ |
| 15 | `thermodynamique` | Gaz parfait, premier principe, transferts thermiques | L'énergie : conversions et transferts | ★★ |
| 16 | `fluides` | Écoulement d'un fluide | Mouvement et interactions | ★★ |

**Chapitre transverse `methodes-physique-chimie`** (page « Méthodes », charte § 2.1) : mesure et incertitudes (incertitude-type, écriture
d'un résultat, comparaison à une valeur de référence), analyse dimensionnelle, chiffres
significatifs, rédiger une réponse argumentée, résolution de problème, Python (capacités
numériques du programme), capacités mathématiques (équations différentielles du premier
ordre, vecteurs, logarithme décimal).

## Notions par chapitre (estimation)

### 1. Transformations acide-base, pH
- Couples acide-base, transfert d'ion hydrogène, espèces amphotères · ★★
- pH et concentration en ions oxonium ; acides forts, bases fortes · ★★★
- Autoprotolyse de l'eau, Ke · ★★

### 2. Décrire un mouvement
- Vecteurs position, vitesse, accélération · ★★★
- Mouvements rectilignes, circulaires (uniformes ou non), repère de Frenet · ★★
- Exploiter un enregistrement (pointage vidéo, Python) · ★★

### 3. Analyser un système par des méthodes physiques
- Absorbance, loi de Beer-Lambert, dosage par étalonnage · ★★★
- Conductivité, loi de Kohlrausch · ★★
- Spectroscopie infrarouge et UV-visible : identifier des groupes · ★★
- Pression, masse volumique, équation d'état (gaz) · ★

### 4. Deuxième loi de Newton, mouvement dans un champ uniforme
- Deuxième loi de Newton, référentiel galiléen, centre de masse · ★★★
- Mouvement dans un champ de pesanteur uniforme : équations horaires, trajectoire · ★★★
- Mouvement dans un champ électrique uniforme (condensateur plan, accélérateur) · ★★
- Aspects énergétiques (énergies cinétique, potentielle, mécanique) · ★★

### 5. Titrages
- Titrage direct, équivalence, suivi pH-métrique · ★★★
- Suivi conductimétrique · ★★
- Exploiter un titrage : concentration, incertitude · ★★

### 6. Mouvement des satellites et des planètes
- Mouvement circulaire uniforme dans un champ de gravitation · ★★
- Lois de Kepler, période de révolution, satellite géostationnaire · ★★

### 7. Cinétique
- Vitesse volumique d'apparition/de disparition, temps de demi-réaction · ★★★
- Facteurs cinétiques, catalyse · ★★
- Loi de vitesse d'ordre 1 · ★★★
- Mécanisme réactionnel, intermédiaires · ★

### 8. Décroissance radioactive
- Stabilité, désintégrations, équations de réaction nucléaire · ★★
- Loi de décroissance, constante radioactive, demi-vie · ★★
- Datation, activité, radioprotection · ★

### 9. Phénomènes ondulatoires
- Intensité sonore, niveau d'intensité sonore (décibels), atténuation · ★★
- Diffraction · ★★
- Interférences · ★★
- Effet Doppler · ★★

### 10. Force des acides et des bases
- Constante d'acidité Ka, pKa · ★★★
- Diagrammes de prédominance et de distribution · ★★
- Solutions tampons, acides α-aminés (selon programme) · ★

### 11. Sens d'évolution spontanée, piles, électrolyse
- Quotient de réaction, constante d'équilibre, critère d'évolution · ★★
- Piles : fonctionnement, capacité électrique · ★★
- Électrolyse, stockage et conversion d'énergie chimique · ★★

### 12. Circuit RC
- Intensité, capacité, relation charge-tension · ★★
- Modèle du circuit RC : équation différentielle, charge et décharge, temps caractéristique · ★★
- Capteurs capacitifs · ★

### 13. Lunette astronomique ; lumière et photons
- Lunette afocale, grossissement · ★★
- Photon, énergie, effet photoélectrique · ★★
- Cellule photovoltaïque, rendement · ★

### 14. Stratégies en synthèse organique
- Structure et nomenclature, groupes caractéristiques · ★★
- Optimisation d'une étape : rendement, vitesse · ★★
- Synthèse en plusieurs étapes, protection de fonction, polymères · ★

### 15. Thermodynamique
- Modèle du gaz parfait · ★
- Énergie interne, capacité thermique, premier principe · ★★
- Transferts thermiques, flux, résistance thermique · ★★
- Loi phénoménologique de Newton, évolution de la température · ★★
- Bilan radiatif terrestre · ★

### 16. Écoulement d'un fluide
- Poussée d'Archimède · ★★
- Débit volumique, conservation · ★★
- Relation de Bernoulli, effet Venturi · ★★

## Liens avec les maths (blocs « Et en maths ? »)

Équation différentielle y' = ay + b ↔ circuit RC, décroissance radioactive, loi de Newton
du refroidissement, cinétique d'ordre 1 ; vecteurs et dérivées ↔ vitesse et accélération ;
exponentielle ↔ décroissance radioactive. Le logarithme décimal (pH, décibels) reste **côté
physique-chimie** : le cours de maths de spécialité ne le traite pas (à confirmer par le
référentiel maths) et un bloc « Et en physique ? » ne doit pas l'y introduire.
