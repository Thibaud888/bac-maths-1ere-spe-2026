---
description: Produit un chapitre de terminale (maths ou physique-chimie) de bout en bout avec les agents tle-* — découpage en notions, cours, mémo, exercices en trois marches, questions éclair, type bac — puis relecture, test « élève », contrôles et PR. Partie « cours » ou « exercices » pour tenir en une session.
argument-hint: <matiere> <slug> [cours|exercices]
---

Chapitre **`$2`** de la matière **`$1`** (`maths` ou `physique-chimie`). Partie : **`$3`**
(`cours` = notions + cours + mémo ; `exercices` = marches + éclair + type bac ; par défaut
`cours` si le chapitre n'a pas de `cours.json`, sinon `exercices`). Le chapitre transverse
`methodes-$1` suit le même circuit, sans type bac (charte § 2.1).

Tu es l'**orchestrateur** : tu lances les agents, tu lis leurs verdicts, tu comptes les
tours de relecture, tu lances les scripts, tu commites. Tu n'écris pas de contenu
pédagogique toi-même. **Ta mémoire coûte** : chaque pas relit tout ce que tu as lu depuis le
début de la session (étude `chantiers/terminale/optimisation-tokens.md`). Garde-la légère :
c'est la qualité des agents qui fait le chapitre, pas ce que tu as lu.

# 0. Hygiène de session (avant tout)

- **Une session = une partie** d'un chapitre : « cours » dans une session, « exercices »
  dans une **autre session, neuve**. Jamais `tout` d'une traite.
- **Jamais de travail d'interface** dans une session de chapitre (page, composant, schéma,
  script) : un défaut d'affichage devient un item de `BACKLOG.md`, traité dans sa propre
  session.
- **Un chapitre à la fois** : pas deux sessions de chapitre en parallèle sur le dépôt (elles
  partagent la même limite d'usage et s'arrêtent toutes les deux au milieu).
- **Coupure de plus d'une heure** (limite atteinte, environnement redémarré, réponse
  attendue de Thibaud) : ne réveille pas cette session ; fais `/handoff` et reprends dans
  une session neuve avec la note de reprise.
- Réflexion : la session qui coordonne tourne en `/effort high` ; les agents `tle-*` gardent
  la leur (fixée dans leur fiche).

# 1. Préalables (sinon, arrête-toi et dis ce qui manque)

- Lis `MAP.md`. De la charte, lis **seulement** le § 12 (circuit) et le § 9.4 (« fini ») :
  `sed -n '/^## 12\./,/^## 13\./p;/^### 9\.4/,/^---/p' .claude/skills/terminale-charte/SKILL.md`.
  Le reste de la charte, le référentiel et le programme sont lus par les agents, pas par toi.
- Le référentiel existe (vérifie sans lire les fichiers en entier) :
  `test -f .claude/skills/bac-$1-terminale-2027/SKILL.md` et
  `node -e "const p=require('./content/terminale/$1/programme.json'); console.log(p.filter(l=>l.chapitre==='$2').length)"`
  → au moins une ligne.
- La mécanique existe : `schemas/terminale/`, `scripts/couverture-terminale.mjs`,
  `scripts/sans-reponses.mjs`, `scripts/controle-rendu.mjs`. (Sinon, le contenu ne peut
  être ni validé ni vu : faire d'abord les items « mécanique » du backlog.)
- **Dossier de travail** `TRAVAIL` : le dossier temporaire de la session (scratchpad), ou
  `${TMPDIR:-/tmp}/tle-$1-$2`. Y vivent les rapports des agents, la version sans réponses,
  les captures et le relevé des coûts (`couts.tsv`). Rien de ce dossier n'est commité.
- **Fiches de lecture** : une par rôle de la partie, préparées une fois pour la session
  (`for r in <rôles>; do node scripts/contexte-chapitre.mjs $1 $2 --role $r --sortie $TRAVAIL/fiche-$r.md; done` ;
  partie « cours » : `architecte auteur-cours relecteur eleve-testeur` ; partie
  « exercices » : `auteur-exercices auteur-bac relecteur eleve-testeur`). Chaque lancement
  d'agent reçoit `fiche: $TRAVAIL/fiche-<rôle>.md` : il y lit les lignes du programme, les
  annales, l'index des chapitres antérieurs et les sections utiles du référentiel au lieu des
  sources complètes. Tu ne lis pas les fiches toi-même ; inutile de les régénérer pendant la
  session (elles ne dépendent pas des fichiers du chapitre en cours).

# 2. Rapports des agents : dans un fichier, pas dans ta mémoire

- À chaque lancement de `tle-relecteur` ou `tle-eleve-testeur`, donne un chemin
  `rapport: $TRAVAIL/<agent>-<partie>-tour<N>.md`. L'agent y écrit son **rapport complet** et
  ne te rend que le **résumé** (≤ 15 lignes : verdict, compteurs, une ligne par défaut
  bloquant). Ces deux agents ne modifient jamais le dépôt : s'ils écrivent, c'est seulement
  ce fichier.
- Pour une correction, **passe à l'auteur le chemin du rapport**, pas son contenu. N'ouvre
  pas le rapport en entier toi-même ; au besoin, `grep` l'identifiant qui t'intéresse.
- Les auteurs et l'architecte rendent leur compte-rendu court (≤ 20 lignes) directement.
- Après chaque lancement, note son coût :
  `printf '%s\t%s\t%s\n' <agent> <étape> <total_tokens> >> $TRAVAIL/couts.tsv`
  (`total_tokens` figure dans le résultat du lancement).

# 2 bis. Boucle de relecture : contrôles, corrections dans la foulée, tours ciblés

- **Avant chaque relecture**, les auteurs ont lancé les contrôles mécaniques ; vérifie-le :
  `node scripts/controles-mecaniques.mjs $1 $2 --partie <partie> | head -3` → « Aucun
  bloquant » (sinon, renvoie à l'auteur sans lancer le relecteur).
- **Avant d'envoyer des corrections**, prends un instantané :
  `node scripts/extraire-items.mjs $1 $2 --instantane $TRAVAIL/tour<N>`.
- **Corrections dans les 5 minutes** : si l'auteur a rendu son travail il y a moins de
  5 minutes, renvoie-lui le chemin du rapport en continuant le même agent (`SendMessage`,
  sa mémoire est encore chaude). Au-delà, lance un **correcteur neuf** : le même agent
  `tle-auteur-*`, avec `fiche`, le chemin du rapport et l'extraction des seuls items cités
  (`node scripts/extraire-items.mjs $1 $2 <ids…> --sortie $TRAVAIL/a-corriger-tour<N>.json`).
- **Tours 2 et 3 ciblés** : `node scripts/extraire-items.mjs $1 $2 --depuis $TRAVAIL/tour<N> --sortie $TRAVAIL/items-tour<N+1>.json`,
  puis `tle-relecteur` avec `tour: N+1`, `items` (ce fichier) et `rapport-precedent` (son
  rapport du tour N). Il refait toutes ses passes sur ces items, sans recharger tout le
  chapitre ; la couverture complète reste vérifiée par `couverture-terminale.mjs` à la fin.

# 3. Partie « cours »

1. **`tle-architecte`** (`$1`, `$2`, mode `decoupage`) → `meta.json`, `notions.json`.
   Contrôle : toutes les lignes du chapitre réparties (son compte-rendu dit N / N). Si le
   découpage s'écarte beaucoup de `chantiers/terminale/chapitres-$1.md`, lis sa
   justification ; mets le chantier à jour dans la même PR.
2. **Priorités mesurées** — seulement si `content/terminale/$1/annales.json` a
   `complet: true` (`node -e "console.log(require('./content/terminale/$1/annales.json').complet)"`) :
   `node scripts/frequences-annales.mjs $1 $2 > $TRAVAIL/frequences.txt`, puis
   `tle-architecte` en mode `priorites` avec ce fichier (il recopie les chiffres). Sinon les
   priorités restent des estimations.
3. **`tle-auteur-cours`** → `cours.json`, `memo.json`.
4. **`tle-relecteur`** (`tour: 1`) sur les quatre fichiers. NEEDS_REVISION → chemin du
   rapport à l'auteur concerné → relecture (`tour: 2`, puis `3`, ciblées :
   § 2 bis). Si la 3e relecture rend
   encore NEEDS_REVISION (« ESCALADE »), arrête et pose la question à Thibaud (format § 0
   de `CLAUDE.md`).
5. **`tle-eleve-testeur`** sur le cours (toutes les notions). Bloquants → retour à
   `tle-auteur-cours` → relecture par `tle-relecteur` des blocs modifiés.
6. `node scripts/couverture-terminale.mjs $1 $2 --partie cours` → rapport vide.

# 4. Partie « exercices » (le cours doit être écrit et relu)

1. **`tle-auteur-exercices`** → `exercices.json`, `flash.json`.
2. **`tle-auteur-bac`** → `type-bac.json` (sauf `methodes-$1`). Les deux auteurs peuvent
   tourner en parallèle.
3. **`tle-relecteur`** sur les trois fichiers ; même boucle (3 relectures au plus, puis
   escalade).
4. **`tle-eleve-testeur`** : `node scripts/sans-reponses.mjs $1 $2 --sortie $TRAVAIL/sans-reponses.json`
   → donne-lui cette version sans réponses (toute la marche « Comprendre » et un exercice de
   chaque autre marche) ; **après** son rapport d'essais, donne-lui les corrections pour
   juger indices et solutions. Bloquants → retour à l'auteur → relecture.
5. `node scripts/couverture-terminale.mjs $1 $2 --partie exercices` → rapport vide (ou
   écarts tranchés, charte règle d'or 7).

# 5. Contrôles communs

1. `node scripts/verify.mjs` → VERIFY OK (ne garde que la dernière ligne et les erreurs :
   `node scripts/verify.mjs 2>&1 | tail -15`).
2. **Rendu, par script** :
   `node scripts/controle-rendu.mjs $1 $2 --partie <partie> --sortie $TRAVAIL/rendu`
   (il lance lui-même le serveur et Chromium `/opt/pw-browsers/chromium` ; chaque page de la
   partie en clair et sombre, à 1280 et 390 px, tout dévoilé). Il signale le défilement
   horizontal, les formules que KaTeX ne compile pas, les erreurs de console. Écart dû au
   contenu (formule trop longue sur une ligne, LaTeX invalide) → retour à l'auteur, puis
   relecture des items modifiés ; défaut de l'interface (avertissement React, composant) →
   item de backlog, pas de correction dans cette session.
3. **Regarde les 4 captures** que le script désigne (et seulement elles).
4. Critères de « fini » : charte § 9.4.

# 6. Mesure et livraison

- **Coût de la session**, juste avant d'ouvrir la PR : `get_session` sans identifiant
  (outil `claude-code-remote`) → champ `usage` s'il est présent ; sinon `list_events` sur
  ta propre session avec `kinds: ["result"]` (chaque événement `result` porte le coût et les
  tokens de son tour : additionne-les). Relève : coût au tarif public, tokens écrits en
  mémoire, relus, produits ; plus `couts.tsv` (total par agent).
- Branche + PR (jamais `main`), commit en français :
  `feat(terminale-$1) : <chapitre> — le cours` (ou `— les exercices`).
- Corps de PR : notions et priorités ; chiffres (blocs, exercices par marche, éclair, type
  bac) ; verdicts du relecteur (nombre de tours) et de l'élève-testeur ; écarts de quotas
  tranchés ; gênes non corrigées ; section `## Coût` (session + tableau des agents, à
  comparer à la référence : Acides-bases, 98,7 $ pour les deux parties) ; section
  `## Vérification` (commandes + résultats, dont le résumé de `controle-rendu.mjs`).
- `BACKLOG.md` : coche l'item, ajoute ce qui reste (widget animé souhaité, figure à
  dessiner, défaut d'interface relevé par le rendu, doute à trancher), en respectant la
  règle du clair.
