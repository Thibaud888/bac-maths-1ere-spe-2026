# Vérification du contenu réglementaire — session 2027

> Session du 2026-09-23. **Rapport seul** : aucun contenu ni aucune page du site n'a été
> modifié. Chaque faute ou imprécision devient un item de `BACKLOG.md`.
> Pages relues : « Le bac, mode d'emploi » (`/le-bac`, PR #72), le simulateur (`/simulateur`,
> PR #73) et le grand oral (`/terminale/grand-oral`, PR #75).

## En clair

**88 affirmations relues sur le texte officiel : 48 vérifiées, 7 fausses, 17 imprécises,
8 non vérifiables et 8 vraies mais mal sourcées.**

**Ce qui est juste, et c'est l'essentiel :** tous les coefficients sont exacts. Le total de 104
est juste lui aussi (60 pour les épreuves, 40 pour le contrôle continu, 4 pour ses deux options de
terminale). Le simulateur calcule la moyenne correctement. Le coefficient 8 du grand oral est
juste : il valait 10 jusqu'en 2026, et c'est le même arrêté qui a créé les maths anticipées. Le
déroulé du grand oral est conforme au nouveau texte du 10 septembre 2026 : 20 min de préparation,
10 min d'exposé debout, 10 min d'échange assis ou debout, le jury, le support non évalué, la
feuille signée et tamponnée, les sept critères. Toutes les dates affichées sont exactes ; il en
manque seulement une qui est publiée (point 3).

**Les fautes qui comptent pour lui, par ordre de gravité :**

1. **Spécialité maths : « la calculatrice est autorisée » est faux.** C'est le sujet qui dit,
   le jour même, si elle l'est. Il doit aussi s'entraîner sans (n° 29).
2. **Mentions : les « félicitations du jury » sont une vraie mention officielle.** Elle
   s'appelle « très bien avec les félicitations du jury » et s'obtient à partir de 18. Le site
   affirme le contraire, sur la page et dans le simulateur, et fait durer la mention « très bien »
   de 16 à l'infini au lieu de 16 à 18. La source citée est une brochure de 2005, écrite avant
   la création de cette mention (n° 50, 51, 67).
3. **La partie pratique de physique-chimie a des dates officielles : du mardi 1er au vendredi
   4 juin 2027.** Le site dit « au printemps » et « dates pas encore publiées ». Elles sont
   pourtant au Bulletin officiel depuis le 25 août 2026 (n° 40).
4. **Grand oral, l'échange** : le jury peut interroger sur tout le programme des spécialités,
   mais **« en lien avec le premier temps »**, donc avec la question présentée. Sans cette
   précision, le site fait réviser plus large que nécessaire (n° 83).
5. **Grand oral, les deux questions** : le texte autorise **trois combinaisons**. Le site n'en
   donne que deux. Il ne dit pas non plus ce qui arrive si les questions ne sont pas conformes :
   pas d'épreuve, convocation en septembre, puis 0 à la récidive (n° 69 et remarques).
6. **Rattrapage** : il ne pourra pas choisir **deux fois les maths** (spécialité et épreuve
   anticipée). Le site ne le dit pas, et cette règle le concerne directement (n° 52).
7. **Ses deux écrits de spécialité tombent le mercredi 16 et le jeudi 17 juin 2027**, pas le
   vendredi 18. Le site parle de trois matinées (n° 45).
8. **Quatre sources officielles sont périmées ou ne concernent pas sa session.** Physique-chimie
   (texte de 2020 abrogé) ; maths (texte de 2020, remplacé dans la liste officielle) ; maths
   anticipées (le texte cité vaut pour la session 2028) ; mentions (brochure de 2005). Les
   chiffres affichés restent justes, sauf pour les mentions (n° 60, 62, 63, 67).

**Ce que le texte officiel dit et que le site ne dit pas (utile à l'élève) :**

- **2 points sur 20 pour la maîtrise de la langue**, au minimum, dans chaque épreuve écrite dès
  2027, maths et physique-chimie comprises.
- Grand oral : **« la formulation et la pertinence de la question ne sont pas des critères de
  l'évaluation »**. Aucun matériel n'est autorisé hormis de quoi écrire, et un tableau est à
  disposition. Le jury choisit la question **selon les spécialités de ses membres**.
- Spécialité maths : **quatre exercices** de 4 à 8 points ; les notions de première peuvent
  servir.
- Physique-chimie, partie pratique : une absence non justifiée vaut **0**, et il n'y a **pas de
  session de remplacement** pour cette partie.

**Comment la vérification a été faite.** `curl` reçoit un refus du pare-feu Cloudflare (403,
« Sorry, you have been blocked ») sur education.gouv.fr, eduscol et Légifrance. Le navigateur
intégré ouvre en revanche les pages normalement, sans aucune vérification anti-robot à passer.
Tous les extraits ci-dessous viennent donc du **texte intégral** des pages officielles ouvertes
dans ce navigateur le 2026-09-23 ; les annexes en PDF ont été lues en mémoire, sans
téléchargement. Rien ne vient d'un moteur de recherche. Seule exception : la note du 23 juillet
2020 sur le français (épreuves de juin 2026), dont l'adresse est introuvable. Les trois lignes
qui en dépendent sont classées « Non vérifiable ».

**À savoir pour la suite :** les dates de la session 2027 sont publiées (BO spécial n° 2 du
25 août 2026). La condition de l'item « Afficher le compte à rebours des épreuves » est donc
remplie.

## Textes officiels lus

| Réf. | Texte | En vigueur pour la session 2027 ? |
|---|---|---|
| [bo-go] | Note de service du 10-9-2026, « Épreuve orale terminale dite « Grand oral » du baccalauréat général », BO spécial n° 4 du 17 septembre 2026 (MENE2622694N) | Oui : « applicable à compter de la session 2027 » |
| [go-a1] | Annexe 1 de ce texte : grille d'évaluation indicative (PDF) | Oui |
| [go-2021] | Note de service du 27-7-2021, BO n° 31 du 26 août 2021 (MENE2121378N) | Non : abrogée par [bo-go] ; lue pour l'ancien format |
| [es-go] | éduscol, « Présentation du Grand oral » (février 2026) | Page d'information ; décrit le régime jusqu'en 2026 et les coefficients 2026 → 2027 |
| [arr-eam] | Arrêté du 10 juin 2025 portant création de l'épreuve anticipée de mathématiques (Légifrance, JORFTEXT000051714285) | Oui : « s'appliquent à compter de la session 2027 » |
| [calc] | education.gouv.fr, « Comment calculer votre note au baccalauréat » (15/06/2026) | Oui : infographie « à compter de la session 2027 » |
| [cc] | éduscol, « Le contrôle continu des candidats scolaires… » (février 2026) | Oui |
| [pres] | éduscol, « Présentation du baccalauréat général » (janvier 2026) | Oui : cite l'épreuve de maths « au titre de la session 2027 » |
| [et] | éduscol, « Les épreuves terminales du baccalauréat général » (septembre 2026) | Oui |
| [eam-es] | éduscol, « Épreuve anticipée de mathématiques… » (septembre 2026) | Oui |
| [eam-bo] | Note de service du 11-9-2026, maths anticipées, BO spécial n° 4 (MENE2622640N) | **Non** : « pour les épreuves présentées au titre la session 2028 » |
| [maths-26] | Note de service du 11-9-2026, spécialité mathématiques (MENE2622642N) | Texte listé par éduscol ; sa date d'effet n'est pas écrite dans la note |
| [maths-20] | Note de service du 11-2-2020, spécialité mathématiques, BO spécial n° 2 du 13 février 2020 (MENE2001796N) | Plus listée par éduscol |
| [pc-26] | Note de service du 11-9-2026, spécialité physique-chimie (MENE2622644N) | Oui : « entre en vigueur à compter de la session 2027 » |
| [pc-20] | Note de service du 11-2-2020, spécialité physique-chimie (MENE2001798N) | **Non** : abrogée par [pc-26] |
| [philo-26] | Note de service du 11-9-2026, philosophie (MENE2622661N) | Oui : « entre en vigueur à compter de la session 2027 » |
| [eaf-26] | Note de service du 11-9-2026, français anticipé (MENE2622658N) | Non : session 2028 ; lue pour comparaison |
| [langue] | Note de service du 11-9-2026, « Exigences en matière de maîtrise de la langue à tous les examens à compter de la session 2027 » (MENE2623195N) | Oui |
| [eps] | Note de service du 20-2-2026, EPS, BO n° 9 du 26 février 2026 (MENE2531948N) | Oui : « à compter de la session 2026 » |
| [cal27] | Circulaire du 24-8-2026, calendrier 2027, BO spécial n° 2 du 25 août 2026 (MENE2622686N), annexes III et VI | Oui |
| [cal27-r] | education.gouv.fr, « Baccalauréat, brevet, CAP : le calendrier 2027 » | Oui (résume [cal27]) |
| [dates26] | éduscol, « Dates des examens 2026 » (mai 2026) | Oui pour les épreuves anticipées de juin 2026 |
| [ment05] | PDF « Les mentions » (métadonnées : « Le baccalauréat 2005 », créé le 1er juin 2005) | **Non** : périmé |

## Les 88 affirmations

Verdicts : **V** Vérifié · **F** Faux · **I** Imprécis · **NV** Non vérifiable · **VMS** Vrai mais
mal sourcé. Les identifiants renvoient aux fichiers JSON (sortie de
`node scripts/inventaire-affirmations.mjs`) ; les numéros de ligne, aux composants.
Les faits personnels (spécialités, SVT arrêtée, options, langues de l'élève, confirmés par
Thibaud le 2026-09-22) ne relèvent d'aucun texte officiel : ils ne sont pas comptés.

### Coefficients et contrôle continu

| # | Affirmation | Où | Source citée | Verdict | Extrait exact du texte officiel | Correction proposée |
|---|---|---|---|---|---|---|
| 1 | Français écrit coef. 5, français oral coef. 5 | `coefficients.json` co-francais-ecrit, co-francais-oral · coefficient | s-calcul-note, s-presentation-bac | V | « 1. Français (écrit) \| 5 — 2. Français (oral) \| 5 » [arr-eam] ; « Français, l'épreuve orale avec le coefficient 5 et l'épreuve écrite avec le coefficient 5 » [pres] | — |
| 2 | Maths anticipées coef. 2 | co-maths-anticipee · coefficient | s-eam, s-eam-bo, s-calcul-note | V | « 3. Mathématiques \| 2 » [arr-eam] ; « Mathématiques \| 2 \| écrite \| 2h » [eam-es] | — |
| 3 | Spécialités coef. 16 chacune ; « 32 coefficients sur 104 », « le plus gros bloc » | co-specialite-maths, co-specialite-physique-chimie · coefficient, comment | s-calcul-note, s-spe-* | V | « 6. Epreuves de spécialité (deux au choix du candidat) \| 16 » [arr-eam] | — |
| 4 | Philosophie coef. 8, « épreuve écrite commune à tous les élèves de la voie générale » | co-philosophie | s-calcul-note, s-presentation-bac | V | « 4. Philosophie \| 8 » [arr-eam] ; « les épreuves finales, passées en fin de classe terminale : l'épreuve écrite de philosophie » [pres] | — |
| 5 | Grand oral coef. 8 (sur 104) | co-grand-oral · coefficient ; `EpreuvePage.tsx` (encadré « Combien ») | s-calcul-note, s-grand-oral | V | « 5. Epreuve orale terminale \| 8 » [arr-eam] ; « Coefficient : 8 » [bo-go] | — |
| 6 | « Coefficient 10 jusqu'à la session 2026 ; il passe à 8 en 2027, l'épreuve anticipée de maths ayant pris les 2 points d'écart » | co-grand-oral · comment | s-calcul-note, s-grand-oral | V | « Coefficient jusqu'à la session 2026 incluse : 10 [voie générale] […] Coefficient à compter de la session 2027 : 8 [voie générale] » [es-go] ; « Les dispositions relatives à l'épreuve anticipée de mathématiques […] et à la modification du coefficient de l'épreuve orale terminale s'appliquent à compter de la session 2027. » [arr-eam]. Le lien de cause n'est pas écrit mot pour mot, mais les deux changements viennent du même arrêté et le total des épreuves reste 60. | Facultatif : citer [arr-eam] |
| 7 | Spécialité abandonnée coef. 8, sur la seule moyenne de première ; « la plus grosse note de contrôle continu » | co-specialite-abandonnee | s-controle-continu, s-calcul-note | V | « Enseignement de spécialité de première \| 8 \| - \| 8 » [cc] | — |
| 8 | « la moyenne de première est définitive » ; « cette note-là ne bougera plus » ; « Ce qui vient de première est déjà acquis » | co-specialite-abandonnee · profilNote ; `LeBacPage.tsx:329`, `:336` | s-controle-continu | I | « Cette commission d'harmonisation peut décider de modifier une moyenne annuelle à la hausse comme à la baisse. » [cc] | « ne dépend plus de ton travail ; la commission académique peut encore l'harmoniser » |
| 9 | Histoire-géographie, LVA, LVB, enseignement scientifique : 6 = 3 + 3 ; EMC : 2 = 1 + 1 | co-histoire-geographie, co-lva, co-lvb, co-enseignement-scientifique, co-emc ; `LeBacPage.tsx:327-329` | s-controle-continu, s-calcul-note | V | « Histoire-géographie \| 3 \| 3 \| 6 » … « Enseignement moral et civique \| 1 \| 1 \| 2 » [cc] | — |
| 10 | EPS coef. 6, en terminale seulement | co-eps · coefficient, repartition | s-eps, s-controle-continu | V | « Éducation physique et sportive** \| - \| 6 \| 6 » [cc] | — |
| 11 | EPS : trois épreuves au lycée, dans trois activités différentes, notées par les professeurs, en terminale | co-eps · quand, comment ; ca-eps · quand ; `LeBacPage.tsx:340-343` | s-eps | V | « Le candidat est évalué l'année de la classe de terminale, sur trois épreuves » ; « trois activités physiques, sportives et artistiques (Apsa) distinctes relevant de trois champs d'apprentissage différents » ; « La co-évaluation est réalisée par deux enseignants d'EPS de l'établissement » [eps] | — |
| 12 | EPS : « Elles font à elles seules 6 coefficients » | ca-eps · detail | s-eps seulement | VMS | La note EPS ne donne aucun coefficient. « L'éducation physique et sportive se voit attribuer un coefficient 6 sur la base des trois évaluations de CCF conduites en classe de terminale » [calc] | Ajouter s-calcul-note à ca-eps |
| 13 | Une option : 2 coefficients par année suivie, en plus des 100 ; suivie dès la première, elle en vaudrait 4 | co-option-maths-expertes · comment ; co-option-musique · profilNote ; `LeBacPage.tsx:440`, `:452-454` | s-calcul-note, s-controle-continu | V | « Un coefficient 2 est affecté à la moyenne annuelle de l'élève dans chaque enseignement optionnel, pour chaque année où l'enseignement a été suivi. » [pres] ; « considéré à hauteur de 4 coefficients (2 pour l'année de 1re et 2 pour l'année de terminale), qui viennent s'ajouter aux 100 coefficients communs » [calc] | — |
| 14 | Maths expertes : « elle ne se suit qu'en terminale » | co-option-maths-expertes · profilNote | s-calcul-note | V | « Un enseignement optionnel suivi sur la seule année de terminale (notamment […] mathématiques expertes […]) est apprécié à hauteur de 2 coefficients. » [calc] | — |
| 15 | Maths expertes : « réservée aux élèves qui gardent la spécialité maths » | co-option-maths-expertes · profilNote | s-calcul-note | NV | Aucun des textes lus ne le dit ; la règle relève de l'organisation des enseignements de terminale, non ouverte ici | Sourcer, ou retirer |
| 16 | Total 104 = 60 (épreuves) + 40 (bulletins) + 4 (options) ; « on divise par 104 » ; « Sept épreuves… 60 coefficients » ; « une seule moyenne » ; moyenne pondérée du simulateur | `LeBacPage.tsx:253-256`, `:268-270`, `:296`, `:386` ; `SimulateurPage.tsx:99` ; `src/lib/simulateur.ts` (moyenne) | s-calcul-note | V | « Pour un élève sans option, le total des coefficients est de 100 (40 coefficients de contrôle continu et 60 pour les épreuves terminales). » [calc] ; « voit l'ensemble de ses points rapportés à un coefficient 104 » [pres] ; tableau à 7 épreuves [arr-eam] | — |
| 17 | Physique-chimie : « Seule épreuve du bac qui comporte une partie pratique » | co-specialite-physique-chimie · comment | s-calcul-note, s-spe-physique-chimie | I | « Sciences de la vie et de la Terre \| \| écrite et pratique \| 3 h 30 + 1 h » ; « Numérique et sciences informatiques \| \| écrite et pratique \| 3 h 30 + 1 h » [et] | « La seule de tes épreuves qui comporte une partie pratique » |
| 18 | « Avant la réforme, seuls les points au-dessus de 10 comptaient » | `LeBacPage.tsx:445-446` | s-calcul-note | NV | La source citée n'en dit rien ; le texte d'avant 2021 n'a pas été lu | Sourcer sur l'ancien texte, ou retirer la phrase |
| 19 | « Aujourd'hui l'option entre dans la moyenne comme les autres matières » | `LeBacPage.tsx:446-448` | s-calcul-note | V | « Les points ainsi obtenus s'ajoutent à ceux obtenus dans les enseignements obligatoires. » [pres] | — |

### Les épreuves

| # | Affirmation | Où | Source citée | Verdict | Extrait exact du texte officiel | Correction proposée |
|---|---|---|---|---|---|---|
| 20 | Français écrit : 4 h, en juin 2026 | ep-francais-ecrit · duree, quand ; co-francais-ecrit · comment | s-presentation-bac, s-dates-2026 | VMS | « Français (écrit) \| 5 \| écrite \| 4h » [et] (non cité) ; « auront lieu le jeudi 11 juin 2026 matin » [dates26] | Citer s-epreuves-terminales |
| 21 | Français écrit : « le commentaire d'un texte, ou une dissertation sur une des œuvres étudiées dans l'année » | ep-francais-ecrit · resume ; co-francais-ecrit · comment | s-presentation-bac, s-dates-2026 | NV | Texte applicable en juin 2026 : note du 23 juillet 2020 modifiée (MENE2019312N), adresse introuvable. Les sources citées ne décrivent pas l'épreuve. Pour comparaison, le texte de la session 2028 : « un commentaire ou une dissertation » ; la dissertation porte « sur l'une des œuvres et sur le parcours associé figurant dans le programme d'œuvres » [eaf-26] | Sourcer sur la note de 2020 ; écrire « œuvres au programme » |
| 22 | Notes des épreuves anticipées « acquises », « déjà acquise » | ep-francais-ecrit · detail ; co-francais-ecrit · comment ; ca-epreuves-anticipees-2026 · detail | s-presentation-bac, s-dates-2026 | I | « Les notes attribuées aux épreuves anticipées sont provisoires jusqu'à la délibération du jury qui se réunit l'année suivante » [pres] | « connues ; définitives au jury de juillet 2027 » |
| 23 | Français oral : « 20 min, après 30 min de préparation » | ep-francais-oral · duree | s-presentation-bac, s-dates-2026 | NV | 20 min : « Français (oral) \| 5 \| orale \| 20 min » [et]. 30 min : texte de 2020 non lu ; celui de 2028 dit « précédées d'un temps de préparation de 30 minutes » [eaf-26] | Sourcer sur la note de 2020 |
| 24 | Français oral : « un texte tiré au sort dans le descriptif, une question de grammaire, puis un entretien sur une œuvre choisie » | ep-francais-oral · resume ; co-francais-oral · comment | s-presentation-bac, s-dates-2026 | NV | Texte de 2020 non lu. Le référentiel du dépôt (`.claude/skills/bac-francais-premiere-2026/SKILL.md:199`) dit « L'examinateur choisit un texte du descriptif », pas « tiré au sort » ; le texte de 2028 parle d'une question de grammaire posée « au moment du tirage » [eaf-26] | Trancher sur la note de 2020 |
| 25 | Maths anticipées : 2 h, vendredi 12 juin 2026, automatismes puis exercices, sans calculatrice, sur le programme de spécialité de première | ep-maths-anticipee · duree, quand, resume, detail ; ca-epreuves-anticipees-2026 | s-eam, s-eam-bo, s-dates-2026 | V | « la première partie, notée sur 6 points, évalue la maitrise des automatismes […] la deuxième partie, notée sur 14 points, comporte deux à trois exercices » ; « L'usage de la calculatrice n'est pas autorisé pour l'ensemble de l'épreuve. » [eam-es] ; « auront lieu le vendredi 12 juin 2026 matin » [dates26] | — |
| 26 | « Épreuve créée pour la session 2026 » | ep-maths-anticipee · detail ; `sources.json` s-eam · note | s-eam | F | « à compter de l'année scolaire 2025-2026, au titre de la session 2027 des baccalauréats » [eam-es] | « passée pour la première fois en juin 2026, au titre de la session 2027 » |
| 27 | Maths anticipées « passée pour la première fois en juin 2026 par tous les élèves de première » | co-maths-anticipee · comment | s-eam | V | « Les candidats aux baccalauréats général et technologique en classe de première passent une épreuve terminale anticipée de mathématiques à compter de l'année scolaire 2025-2026 » [eam-es] | — |
| 28 | Spécialité maths : écrit de 4 h, juin 2027, sur le programme de terminale | ep-spe-maths · duree, quand, resume | s-spe-maths, s-epreuves-terminales | V | « Mathématiques \| \| écrite \| 4h » [et] ; « L'épreuve porte sur le programme de l'enseignement de spécialité de la classe de terminale en vigueur. » [maths-26] | Ajouter : « Les notions du programme de la classe de première en vigueur peuvent être mobilisées » |
| 29 | Spécialité maths : « La calculatrice est autorisée. » | ep-spe-maths · resume | s-spe-maths, s-epreuves-terminales | **F** | « Le sujet précise si l'usage de la calculatrice, dans les conditions précisées par les textes en vigueur, est autorisé. » [maths-26], phrase identique dans [maths-20] | « C'est le sujet qui dit si la calculatrice est autorisée : entraîne-toi aussi sans. » |
| 30 | « L'option maths expertes n'est pas évaluée par cette épreuve : elle compte à part, sur les moyennes de l'année » | ep-spe-maths · detail | s-spe-maths, s-epreuves-terminales | VMS | « Tous les enseignements optionnels sont évalués dans le cadre du contrôle continu » [calc] (non cité) | Citer s-calcul-note |
| 31 | Physique-chimie : 3 h 30 d'écrit + 1 h de pratique ; un écrit et une épreuve en salle de TP | ep-spe-physique-chimie · duree, resume | s-spe-physique-chimie, s-epreuves-terminales | V | « Physique-chimie \| \| écrite et pratique \| 3 h 30 + 1 h » [et] | — |
| 32 | Physique-chimie : « 0,8 fois l'écrit plus 0,2 fois la pratique », chaque partie sur 20 | ep-spe-physique-chimie · detail ; s-spe-physique-chimie · note | s-spe-physique-chimie | VMS | Vrai dans le texte en vigueur : « en multipliant par 0,8 la note sur 20 points de la partie écrite et par 0,2 la note sur 20 points de la partie pratique » [pc-26] ; la source citée est abrogée (n° 63) | Remplacer la source |
| 33 | Philosophie : 4 h, juin 2027 | ep-philosophie · duree, quand | s-presentation-bac, s-calendrier-2027 | V | Annexe III : « Lundi 14 juin Philosophie 8 h – 12 h » [cal27] | — |
| 34 | Philosophie : « deux sujets de dissertation, ou l'explication d'un texte » | ep-philosophie · resume | s-presentation-bac, s-calendrier-2027 | VMS | « Trois énoncés de sujet sont proposés au choix du candidat. Deux de ces énoncés, dits « sujets de dissertation » […] Le troisième énoncé de sujet est constitué par un texte » [philo-26] (non déclaré) | Ajouter [philo-26] à `sources.json` |
| 35 | Grand oral : « 20 min, après 20 min de préparation », « Entre le 21 juin et le 2 juillet 2027 », deux questions, dix minutes d'exposé debout puis dix d'échange | ep-grand-oral · duree, quand, resume ; `EpreuvePage.tsx` (compteurs) | s-grand-oral, s-calendrier-2027 | V | « Durée : 20 minutes / Préparation : 20 minutes » [bo-go] ; « à compter du lundi 21 juin et au plus tard jusqu'au vendredi 2 juillet 2027 » [cal27] | — |
| 36 | « Le jury note la solidité des connaissances, la capacité à argumenter et à relier les savoirs, la clarté et la force de conviction. » | ep-grand-oral · detail | s-grand-oral | I | Quatre critères sur sept, présentés comme la liste : « Le jury valorise la solidité des connaissances du candidat, sa capacité à argumenter et à relier les savoirs, son esprit critique, la précision de son expression, la clarté de son propos, son engagement dans sa parole et sa force de conviction. » [bo-go] | Donner les sept, ou écrire « notamment » |


### Le calendrier

| # | Affirmation | Où | Source citée | Verdict | Extrait exact du texte officiel | Correction proposée |
|---|---|---|---|---|---|---|
| 37 | Philosophie « lundi 14 juin 2027, le matin », « de 8 h à 12 h », « la première des épreuves finales » | ca-philosophie | s-calendrier-2027, s-calendrier-2027-resume | V | « Les épreuves de philosophie sont fixées le lundi 14 juin 2027 matin. » [cal27] ; annexe III « Philosophie 8 h – 12 h » | — |
| 38 | Épreuves anticipées en juin 2026 ; maths le vendredi 12 juin 2026 ; « 12 coefficients sur 104 » | ca-epreuves-anticipees-2026 · quand, detail | s-dates-2026, s-eam | V | « auront lieu le vendredi 12 juin 2026 matin » [dates26] ; 5 + 5 + 2 = 12 [arr-eam] | (« acquises » : voir n° 22) |
| 39 | EPS « au fil de l'année de terminale » | ca-eps · quand | s-eps | V | « selon le calendrier arrêté par l'établissement » ; « évalué l'année de la classe de terminale » [eps] | — |
| 40 | Partie pratique de physique-chimie « au printemps 2027, au lycée » ; « Les dates nationales de la session 2027 ne sont pas encore publiées » ; « Quand une date n'est pas encore fixée, la période est indiquée » | ca-pratique-physique-chimie · quand, detail ; ep-spe-physique-chimie · quand, detail ; `LeBacPage.tsx:374` | s-spe-physique-chimie | **F** | « l'évaluation des compétences expérimentales de physique-chimie, de sciences de la vie et de la Terre qui se déroulera du mardi 1er au vendredi 4 juin 2027 » [cal27] | « Du mardi 1er au vendredi 4 juin 2027, au lycée » (`precision: periode`), source s-calendrier-2027 |
| 41 | Écrits de spécialité « mercredi 16, jeudi 17 et vendredi 18 juin 2027, le matin » | ca-specialites · quand | s-calendrier-2027, s-calendrier-2027-resume | V | « Les épreuves écrites de spécialités sont fixées les mercredi 16, jeudi 17 et vendredi 18 juin 2027 matin » [cal27] | — |
| 42 | Grand oral du 21 juin au 2 juillet 2027, date fixée par l'académie | ca-grand-oral · quand, detail | s-calendrier-2027, s-calendrier-2027-resume | V | « Les dates de l'épreuve du Grand oral sont organisées à l'initiative des académies à compter du lundi 21 juin et au plus tard jusqu'au vendredi 2 juillet 2027 » [cal27] | — |
| 43 | Résultats « à partir du mardi 6 juillet 2027 », « aucune académie de métropole ne publie avant » | ca-resultats | s-calendrier-2027 | V | « Les recteurs des académies de métropole veilleront à ce que la communication de ces résultats n'intervienne qu'à compter du mardi 6 juillet 2027 » [cal27] | — |
| 44 | Rattrapage jusqu'au vendredi 9 juillet 2027, dates fixées par l'académie ; fin de session le 9 juillet | ca-rattrapage | s-calendrier-2027, s-mentions | V | « Les épreuves du second groupe […] se dérouleront dans l'ensemble des académies, jusqu'au vendredi 9 juillet 2027. » ; « La session se terminera le vendredi 9 juillet 2027 pour tous les examens. » [cal27] | — |
| 45 | « Les écrits de spécialité sont répartis sur ces trois matinées » (lu comme valant pour lui) | ca-specialites · detail | s-calendrier-2027 | I | Annexe III : mathématiques et physique-chimie ont lieu le mercredi 16 et le jeudi 17 juin ; le vendredi 18 ne porte que LLCA et biologie-écologie. « le candidat est convoqué sur 2 journées pour les épreuves de spécialité, un enseignement de spécialité par jour » [cal27] | « Tes deux spécialités : mercredi 16 et jeudi 17 juin au matin (maths 8 h–12 h, physique-chimie 8 h–11 h 30), l'ordre sera sur ta convocation » |
| 46 | Grand oral : la date « est communiquée par le lycée » | ca-grand-oral · detail | s-calendrier-2027 | I | « chaque candidat reçoit une convocation produite par les services académiques en charge des examens » [cal27] | « elle figure sur ta convocation » |
| 47 | Session de remplacement « du lundi 6 au jeudi 9 septembre 2027 » | ca-remplacement · quand | s-calendrier-2027 | V | « Les épreuves écrites de remplacement sont fixées du lundi 6 au jeudi 9 septembre 2027 » [cal27]. Pour lui, d'après l'annexe VI : philosophie le lundi 6, spécialités les mardi 7 et mercredi 8 **l'après-midi** | Facultatif : ses jours et horaires |
| 48 | Remplacement « pour un candidat empêché en juin — maladie ou cas de force majeure justifié » | ca-remplacement · detail | s-calendrier-2027 | VMS | « Les candidats qui, pour cause de force majeure dûment constatée […] n'ont pu passer […] peuvent être autorisés par le recteur d'académie à se présenter aux épreuves de remplacement » [pres] (non cité) | Citer s-presentation-bac |


### Mentions et rattrapage

| # | Affirmation | Où | Source citée | Verdict | Extrait exact du texte officiel | Correction proposée |
|---|---|---|---|---|---|---|
| 49 | Moins de 8 : ajourné, sans rattrapage ; de 8 à 10 : deux oraux ; 10 ou plus : admis | me-non-admis, me-rattrapage, me-admis | s-mentions, s-presentation-bac | V | « Si le candidat a obtenu une note finale de 10/20 ou plus, il est déclaré définitivement admis ; s'il a obtenu une note finale au moins égale à 8/20 et inférieure à 10/20, il est autorisé à présenter les épreuves orales du second groupe ; s'il a obtenu une note finale inférieure à 8/20, il est ajourné définitivement. » [pres] | me-admis : ajouter s-presentation-bac |
| 50 | Mention « très bien » : « À partir de 16 », affichée « 16 et plus » | me-tres-bien (pas de `plafond`) ; `LeBacPage.tsx` (palierLabel) | s-mentions | I | « Mention TB : moyenne supérieure ou égale à 16 et inférieure à 18 » [pres] | `plafond: 18` |
| 51 | Félicitations : « ce n'est pas un seuil fixé par les textes » ; « Décision du jury, pas un seuil réglementaire » ; « Distinction du jury, pas un seuil fixé par les textes » ; libellé « Félicitations du jury » | me-felicitations · resume, `reglementaire: false` ; `LeBacPage.tsx:407` ; `SimulateurPage.tsx:132` | s-mentions | **F** | « Les mentions « assez bien » (AB), « bien » (B), « très bien » (TB) et « très bien avec les félicitations du jury » ne sont attribuées qu'aux candidats obtenant le baccalauréat au premier groupe […] Mention TB avec les félicitations du jury : moyenne supérieure ou égale à 18. » [pres] | Mention officielle « Très bien avec les félicitations du jury », à partir de 18 ; retirer `reglementaire: false` ; source s-presentation-bac |
| 52 | Rattrapage : « deux oraux, dans deux matières de ton choix parmi celles qui ont eu un écrit — les épreuves anticipées comprises. Pour chacune, c'est la meilleure des deux notes qui est retenue » | `LeBacPage.tsx:419-424` | s-mentions | I | Juste, mais il manque la règle qui le concerne : « Les mathématiques ne peuvent pas être choisis simultanément au second groupe en tant qu'enseignement de spécialité et en tant qu'enseignement de première ayant fait l'objet d'une épreuve anticipée. » ; « Le jury de délibération du second groupe retient la meilleure note » [pres] | Ajouter la règle des maths ; source s-presentation-bac |
| 53 | Assez bien de 12 à 14, bien de 14 à 16 | me-assez-bien, me-bien | s-mentions seulement | VMS | « Mention AB : moyenne supérieure ou égale à 12 et inférieure à 14 ; Mention B : moyenne supérieure ou égale à 14 et inférieure à 16 » [pres] ; la source citée date de 2005 (n° 67) | Source s-presentation-bac |
| 54 | « Une mention ne s'obtient qu'au premier tour » | `LeBacPage.tsx:428-432` | s-mentions | VMS | « ne sont attribuées qu'aux candidats obtenant le baccalauréat au premier groupe d'épreuves » [pres] ; la brochure de 2005 citée ne le dit pas | Source s-presentation-bac |

### Les sources elles-mêmes (`content/bac/sources.json`)

| # | Affirmation | Où | Source citée | Verdict | Extrait exact du texte officiel | Correction proposée |
|---|---|---|---|---|---|---|
| 55 | Adresse, libellé et contenu de « Comment calculer votre note au baccalauréat » ; note « 60 coefficients d'épreuves, 40 de contrôle continu, et la règle des options » | s-calcul-note | — | V | Page datée « 15/06/2026 », infographie « à compter de la session 2027 » [calc] | — |
| 56 | « Le contrôle continu des candidats scolaires… » | s-controle-continu | — | V | Page « février 2026 » [cc] | — |
| 57 | « Présentation du baccalauréat général » | s-presentation-bac | — | V | Page « janvier 2026 » [pres] | — |
| 58 | « Les épreuves terminales du baccalauréat général » | s-epreuves-terminales | — | V | Page « septembre 2026 » [et] | — |
| 59 | « Épreuve anticipée de mathématiques… » (page) | s-eam | — | V | Page « septembre 2026 » [eam-es] (sa note « créée pour la session 2026 » : n° 26) | — |
| 60 | La note de service MENE2622640N « définit l'épreuve » de maths anticipées qu'il a passée | s-eam-bo | — | **F** | « Elle entre en vigueur à compter de l'année scolaire 2026-2027, pour les épreuves présentées au titre la session 2028. Elle abroge et remplace la note de service du 10 juin 2025 (NOR : MENE2515469N) » [eam-bo] | Citer la note du 10 juin 2025 (MENE2515469N) et l'arrêté du 10 juin 2025 [arr-eam] |
| 61 | Grand oral : MENE2622694N en vigueur pour 2027 | s-grand-oral | — | V | « Cette note de service est applicable à compter de la session 2027 du baccalauréat général » [bo-go] | — |
| 62 | Spécialité maths : note du 11 février 2020 (MENE2001796N) | s-spe-maths | — | I | L'adresse fonctionne, mais éduscol renvoie désormais à MENE2622642N dans sa liste « Notes de service relatives aux définitions des épreuves terminales » [et]. La nouvelle note ajoute « La maîtrise de la langue est prise en compte à hauteur de deux points sur vingt » et « Le sujet comporte quatre exercices » [maths-26] (2020 : « de trois à cinq exercices » [maths-20]) | Remplacer par MENE2622642N |
| 63 | Physique-chimie : note du 11 février 2020 (MENE2001798N) | s-spe-physique-chimie | — | **F** | « Elle entre en vigueur à compter de la session 2027. Elle abroge et remplace la note de service du 11 février 2020 modifiée (NOR : MENE2001798N) » [pc-26] | Remplacer par MENE2622644N |
| 64 | Libellés « Bulletin officiel spécial n° 4 du 2026 » | s-grand-oral · note ; s-eam-bo · note | — | I | « Bulletin officiel spécial n° 4 du 17 septembre 2026 » [bo-go] | Compléter la date |
| 65 | EPS : note « Coefficient 6 sur la base de trois épreuves passées en terminale » | s-eps · note | — | I | Texte en vigueur (« Elle abroge et remplace à compter de la session 2026 la circulaire n° 2019-129 »), mais sans coefficient 6 : il n'y parle que du coefficient « neutralisé » [eps] | « Trois épreuves en terminale, en contrôle en cours de formation » |
| 66 | Calendrier 2027, « Bulletin officiel spécial n° 2 du 25 août 2026 » ; page de synthèse ; dates 2026 | s-calendrier-2027, s-calendrier-2027-resume, s-dates-2026 | — | V | « Bulletin officiel spécial n° 2 du 25 août 2026 » (circulaire du 24-8-2026) [cal27] ; [cal27-r] ; [dates26] | — |
| 67 | « Les mentions et les épreuves du second groupe » | s-mentions | — | **F** | PDF titré « Le baccalauréat 2005 » dans ses métadonnées, créé le 1er juin 2005 : « Très bien pour une note moyenne au moins égale à 16. En 2004, ont été reçus avec mention… » ; aucune mention « félicitations », aucune règle du premier groupe [ment05] | Remplacer par s-presentation-bac (« La délivrance du diplôme ») |
| 68 | Toutes les sources sont sur un domaine officiel | `sources.json` | — | V | Contrôle du script : 0 source hors education.gouv.fr / legifrance.gouv.fr | — |


### Le grand oral

| # | Affirmation | Où | Source citée | Verdict | Extrait exact du texte officiel | Correction proposée |
|---|---|---|---|---|---|---|
| 69 | Deux questions : « soit chacune sur une spécialité ; soit de façon transversale, une question croisant les deux » | go-epreuve-questions · statement | s-grand-oral | I | Trois combinaisons : « une question sur une spécialité et une question sur l'autre spécialité ; une question sur une spécialité et une question transversale ; deux questions transversales. » [bo-go] | Donner les trois ; ajouter ce qui arrive si elles ne sont pas conformes |
| 70 | Adossées aux deux spécialités ; « un des grands enjeux du programme » ; « tout ou partie du programme de première et de terminale » | go-epreuve-questions · statement ; `QuestionsPage.tsx:51` | s-grand-oral | V | « deux questions adossées aux deux enseignements de spécialités » ; « Les questions mettent en lumière un des grands enjeux du ou des programmes de ces enseignements. Elles sont adossées à tout ou partie du programme du cycle terminal. » [bo-go] | — |
| 71 | Feuille signée par les professeurs de spécialité, cachet (« tamponnée ») du lycée | go-epreuve-questions ; gt-choix ; `QuestionsPage.tsx:51-52` | s-grand-oral | V | « cette feuille est signée par les professeurs de spécialité du candidat et porte le cachet de son établissement d'origine » [bo-go] | — |
| 72 | « Le jury en choisit une » | go-epreuve-questions ; gt-choix ; `OralBlanc.tsx:186-193` | s-grand-oral | V | « Le jury choisit une des deux questions proposées par le candidat. » [bo-go] | — |
| 73 | Conseil : « Une question « de secours » moins travaillée est justement celle que le jury risque de choisir » | go-epreuve-questions · conseil | s-grand-oral | NV | Le texte donne un autre critère : « Ce choix est subordonné aux spécialités enseignées par les membres du jury. » [bo-go] | Donner ce critère ; garder « prépare les deux au même niveau » |
| 74 | Jury : deux professeurs de disciplines différentes, dont un d'une de ses spécialités ; l'autre d'une autre discipline ou professeur-documentaliste | go-epreuve-jury · statement | s-grand-oral | V | « Le jury est composé de deux professeurs de disciplines différentes, dont l'un représente l'un des deux enseignements de spécialité du candidat et l'autre représente un autre enseignement (spécialité ou enseignements communs), ou est professeur-documentaliste. » [bo-go] | — |
| 75 | Conseil : « Au moins un des deux n'est pas spécialiste de ta question » | go-epreuve-jury · conseil | s-grand-oral | I | Même extrait : l'autre juré peut représenter « un autre enseignement (spécialité […]) ». Avec une question transversale maths–physique, les deux peuvent être spécialistes | « Souvent, l'un des deux n'est pas spécialiste » |
| 76 | 20 min de préparation ; support facultatif, non évalué | go-epreuve-preparation-du-jour ; gt-preparation ; go-prep-support | s-grand-oral | V | « Le candidat dispose de 20 minutes de préparation pour mettre en ordre ses idées et réaliser, s'il le souhaite, un support pour son exposé. Ce support ne fait pas l'objet d'une évaluation. » [bo-go] | — |
| 77 | « Le texte ne dit pas ce que ce support doit contenir » | go-epreuve-preparation-du-jour · conseil | s-grand-oral | V | Le texte de 2026 ne contient aucune phrase sur le contenu du support [bo-go] | — |
| 78 | « Les conditions matérielles (papier fourni, salle) sont données par ton centre d'examen » ; la page promet de dire « ce qui est autorisé » | go-epreuve-preparation-du-jour · conseil ; `EpreuvePage.tsx:66` | s-grand-oral | I | Le texte fixe la règle : « Aucun matériel n'est autorisé pour cette épreuve hormis le nécessaire d'écriture. » ; « S'il le souhaite, le candidat dispose d'un tableau. » [bo-go] | Écrire ces deux règles |
| 79 | Notée sur 20 ; les sept critères valorisés (libellés de l'oral blanc) | go-epreuve-note · statement ; `criteres.json` (7 libellés) ; `OralBlanc.tsx:440` ; go-prep-support, gq-autre-discipline (« fait partie de ce que valorise le jury ») | s-grand-oral | V | « L'épreuve est notée sur 20 points. » ; « Le jury valorise la solidité des connaissances du candidat, sa capacité à argumenter et à relier les savoirs, son esprit critique, la précision de son expression, la clarté de son propos, son engagement dans sa parole et sa force de conviction. » [bo-go] | — |
| 80 | « une grille d'évaluation indicative : c'est elle qu'utilise le jury » | go-epreuve-note · statement | s-grand-oral | I | « Il peut s'appuyer sur la grille indicative de l'annexe 1. » [bo-go] | « sur laquelle le jury peut s'appuyer » |
| 81 | « Le texte ne répartit pas les 20 points critère par critère » ; « Pas de points » | go-epreuve-note · conseil ; `OralBlanc.tsx:440-441` | s-grand-oral | V | Annexe 1 : cinq rubriques (« Qualité orale de l'épreuve », « Qualité de la prise de parole en continu », « Qualité des connaissances », « Qualité de l'interaction », « Qualité de construction de l'argumentation »), quatre niveaux (« Très insuffisant » à « Très satisfaisant »), aucun point [go-a1] | — |
| 82 | Deux temps face au jury ; le texte remplace la note de 2021 ; l'ancien format en trois temps (exposé court, échange, orientation, « tenir 5 minutes ») a disparu ; le coefficient a changé | go-epreuve-ancien-format | s-grand-oral | V | « Elle abroge et remplace la note de service du 27 juillet 2021 modifiée (NOR : MENE2121378N) » [bo-go] ; « se déroule en trois temps : Premier temps : présentation d'une question (5 minutes) […] Troisième temps : échange sur le projet d'orientation du candidat (5 minutes) » [go-2021]. Précision : le format en deux temps date de la modification du BO n° 36 du 28 septembre 2023 (« L'épreuve se déroule en 2 temps » [es-go]), pas de 2026 | — |
| 83 | Échange : « il peut t'interroger sur toute partie du programme de tes spécialités (première et terminale) » ; « pas seulement sur ce que tu as dit » | gt-echange · resume ; go-ent-cours · statement | s-grand-oral | I | « Il peut interroger le candidat sur toute partie du programme du cycle terminal de ses enseignements de spécialité, en lien avec le premier temps de l'épreuve. » [bo-go] | Ajouter « en lien avec ta question » |
| 84 | Exposé de 10 min, debout sauf aménagement ; d'abord pourquoi ce choix, puis développer et répondre ; argumentation et qualités oratoires évaluées | gt-expose ; go-prep-plan ; go-prep-voix ; go-ent-orientation (1re phrase) | s-grand-oral | V | « Le candidat effectue sa présentation du premier temps debout, sauf aménagements pour les candidats à besoins spécifiques. » ; « Le candidat explique pourquoi il a choisi de préparer cette question pendant sa formation, puis il la développe et y répond. Le jury évalue les capacités argumentatives et les qualités oratoires du candidat. » [bo-go] | — |
| 85 | Échange de 10 min, assis ou debout au choix ; préciser et approfondir ; connaissances et argumentation évaluées | gt-echange ; go-ent-question | s-grand-oral | V | « Pour le second temps de l'épreuve, le candidat est assis ou debout selon son choix. » ; « Le jury interroge ensuite le candidat pour l'amener à préciser et à approfondir sa pensée. » ; « Le jury évalue ainsi la solidité des connaissances et les capacités argumentatives du candidat. » [bo-go] | — |
| 86 | Projet d'orientation : « le lien avec ce que tu veux faire après le bac […] le jury peut y revenir pendant l'échange » ; « C'est par là que commence l'exposé : […] le lien avec ton projet après le bac » ; relances « Ton projet » | go-ent-orientation · statement ; `QuestionForm.tsx:125-126` ; gq-projet, gq-approfondir (`grand-oral-content.ts:172`) | aucune | I | Le texte en vigueur ne parle plus du projet d'orientation ; il demande d'expliquer « pourquoi il a choisi de préparer cette question pendant sa formation » [bo-go]. Le « Troisième temps : échange sur le projet d'orientation du candidat » de [go-2021] a disparu | Présenter le projet comme une façon possible d'expliquer son choix, pas comme une attente ; retirer « le jury peut y revenir » |
| 87 | « une réponse d'échange tient en général entre 30 secondes et une minute » | go-ent-reponses · conseil | aucune | NV | Aucun texte officiel ; conseil de méthode | Garder comme conseil, sans « en général » |
| 88 | « une erreur affirmée avec aplomb coûte plus qu'un « je ne sais pas » bien mené » ; « se corriger soi-même […] montre de l'esprit critique » | go-ent-piege · statement, conseil | aucune | NV | Aucune règle de notation ne le dit. La grille valorise le fait de se reprendre, mais sous « Qualité de l'interaction » : « Se reprend, reformule en s'aidant des propositions du jury » [go-a1] | Garder comme conseil ; rattacher à la grille si on veut l'appuyer |

## Décompte

| Verdict | Nombre |
|---|---|
| Vérifié | 48 |
| Faux | 7 (n° 26, 29, 40, 51, 60, 63, 67) |
| Imprécis | 17 (n° 8, 17, 22, 36, 45, 46, 50, 52, 62, 64, 65, 69, 75, 78, 80, 83, 86) |
| Non vérifiable | 8 (n° 15, 18, 21, 23, 24, 73, 87, 88) |
| Vrai mais mal sourcé | 8 (n° 12, 20, 30, 32, 34, 48, 53, 54) |
| **Total** | **88** |

## Remarques hors verdict

- **Arrondis.** Le simulateur règle les notes au quart de point. Les textes arrondissent
  autrement : la moyenne annuelle est retenue « en l'arrondissant au dixième de point
  supérieur » [cc], et la note d'EPS est « arrondie au point entier le plus proche après
  harmonisation » [eps]. L'écart sur la moyenne est négligeable, mais le commentaire
  « comme un bulletin » de `src/lib/simulateur.ts` (`clampNote`) ne correspond à aucun texte.
- **Points du jury.** [calc] annonce, sous « Session 2026 : le point sur les nouveautés »,
  que le jury ne peut ajouter des points que si la moyenne des écrits atteint 8 (« jusqu'à
  + 0,5 point »). Le site n'en parle pas. Il faudra vérifier si la règle vaut pour 2027 avant
  de l'ajouter.
- **Grand oral, question non conforme.** « Si le candidat ne soumet aucune question, une seule
  question ou des questions non-conformes […] le candidat est convoqué à la session de
  remplacement. Si le candidat se présente à la session de remplacement de nouveau sans
  respecter ces modalités, […] obtient la note de 0 à l'épreuve. » [bo-go]. L'oral blanc accepte
  une seule question formulée sans le signaler : c'est sans conséquence pour l'entraînement,
  mais la page « Mes 2 questions » pourrait le rappeler.

## L'outil

`node scripts/inventaire-affirmations.mjs` sort l'inventaire des JSON : une ligne par champ,
avec l'identifiant et les sources citées. `--json` donne la même chose en JSON. Le script
contrôle aussi que chaque jour de semaine écrit en toutes lettres correspond bien à sa date
(« lundi 14 juin 2027 »), que chaque source citée existe et qu'elle est sur un domaine
officiel. Il ne lit pas les composants : le texte écrit en dur dans les pages a été relevé à la
main (numéros de ligne ci-dessus).

[bo-go]: https://www.education.gouv.fr/bo/2026/Special4/MENE2622694N
[go-a1]: https://www.education.gouv.fr/sites/default/files/document/annexe-1-grille-d-evaluation-indicative-de-l-epreuve-orale-terminale-520741.pdf
[go-2021]: https://www.education.gouv.fr/bo/21/Hebdo31/MENE2121378N.htm
[es-go]: https://eduscol.education.gouv.fr/5661/presentation-du-grand-oral
[arr-eam]: https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051714285
[calc]: https://www.education.gouv.fr/reussir-au-lycee/comment-calculer-votre-note-au-baccalaureat-325511
[cc]: https://eduscol.education.gouv.fr/5676/le-controle-continu-des-candidats-scolaires-au-baccalaureat-general-ou-technologique
[pres]: https://eduscol.education.gouv.fr/5700/presentation-du-baccalaureat-general
[et]: https://eduscol.education.gouv.fr/5706/les-epreuves-terminales-du-baccalaureat-general
[eam-es]: https://eduscol.education.gouv.fr/5688/epreuve-anticipee-de-mathematiques-aux-baccalaureats-general-et-technologique
[eam-bo]: https://www.education.gouv.fr/bo/2026/Special4/MENE2622640N
[maths-26]: https://www.education.gouv.fr/bo/2026/Hebdo4/MENE2622642N
[maths-20]: https://www.education.gouv.fr/bo/20/Special2/MENE2001796N.htm
[pc-26]: https://www.education.gouv.fr/bo/2026/Special4/MENE2622644N
[pc-20]: https://www.education.gouv.fr/bo/20/Special2/MENE2001798N.htm
[philo-26]: https://www.education.gouv.fr/bo/2026/Special4/MENE2622661N
[eaf-26]: https://www.education.gouv.fr/bo/2026/Special4/MENE2622658N
[langue]: https://www.education.gouv.fr/bo/2026/Special4/MENE2623195N
[eps]: https://www.education.gouv.fr/bo/2026/Hebdo9/MENE2531948N
[cal27]: https://www.education.gouv.fr/bo/2026/Special2/MENE2622686N
[cal27-r]: https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-brevet-cap-le-calendrier-2027-341384
[dates26]: https://eduscol.education.gouv.fr/5697/dates-des-examens-2026
[ment05]: https://www.education.gouv.fr/sites/default/files/document/Les%20mentions-244599.pdf
