---
description: Produit un chapitre de terminale (maths ou physique-chimie) de bout en bout avec les agents tle-* — découpage en notions, cours, mémo, exercices en trois marches, questions éclair, type bac — puis relecture, test « élève », contrôles et PR. Partie « cours » ou « exercices » pour tenir en une session.
argument-hint: <matiere> <slug> [cours|exercices|tout]
---

Chapitre **`$2`** de la matière **`$1`** (`maths` ou `physique-chimie`). Partie : **`$3`**
(`cours` = notions + cours + mémo ; `exercices` = marches + éclair + type bac ; `tout` ;
par défaut `cours` si le chapitre n'a pas de `cours.json`, sinon `exercices`). Le chapitre
transverse `methodes-$1` suit le même circuit, sans type bac (charte § 2.1).

Tu es l'**orchestrateur** : tu lances les agents, tu lis leurs rapports, tu comptes les
tours de relecture, tu lances les scripts, tu commites. Tu n'écris pas de contenu
pédagogique toi-même.

# 0. Préalables (sinon, arrête-toi et dis ce qui manque)

- Lis `MAP.md`, puis `.claude/skills/terminale-charte/SKILL.md` en entier.
- Le référentiel existe : `.claude/skills/bac-$1-terminale-2027/SKILL.md` et
  `content/terminale/$1/programme.json`, avec des lignes dont `chapitre` vaut `$2`.
- La mécanique existe : `schemas/terminale/`, `scripts/couverture-terminale.mjs`,
  `scripts/sans-reponses.mjs`, pages du chapitre routées. (Sinon, le contenu ne peut être
  ni validé ni vu : faire d'abord les items « mécanique » du backlog.)

# 1. Partie « cours »

1. **`tle-architecte`** (`$1`, `$2`, mode `decoupage`) → `meta.json`, `notions.json`.
   Contrôle : toutes les lignes du chapitre réparties (son compte-rendu dit N / N). Si le
   découpage s'écarte beaucoup de `chantiers/terminale/chapitres-$1.md`, lis sa
   justification ; mets le chantier à jour dans la même PR.
2. **Priorités mesurées** — seulement si `content/terminale/$1/annales.json` a
   `complet: true` : `node scripts/frequences-annales.mjs $1 $2`, puis `tle-architecte`
   en mode `priorites` avec ce rapport (il recopie les chiffres). Sinon les priorités
   restent des estimations.
3. **`tle-auteur-cours`** → `cours.json`, `memo.json`.
4. **`tle-relecteur`** (`tour: 1`) sur les quatre fichiers. NEEDS_REVISION → renvoie le
   rapport à l'auteur concerné → relecture (`tour: 2`, puis `3`). Si la 3e relecture rend
   encore NEEDS_REVISION (« ESCALADE »), arrête et pose la question à Thibaud (format § 0
   de `CLAUDE.md`).
5. **`tle-eleve-testeur`** sur le cours (toutes les notions). Bloquants → retour à
   `tle-auteur-cours` → relecture par `tle-relecteur` des blocs modifiés.
6. `node scripts/couverture-terminale.mjs $1 $2 --partie cours` → rapport vide.

# 2. Partie « exercices » (le cours doit être écrit et relu)

1. **`tle-auteur-exercices`** → `exercices.json`, `flash.json`.
2. **`tle-auteur-bac`** → `type-bac.json` (sauf `methodes-$1`). Les deux auteurs peuvent
   tourner en parallèle.
3. **`tle-relecteur`** sur les trois fichiers ; même boucle (3 relectures au plus, puis
   escalade).
4. **`tle-eleve-testeur`** : `node scripts/sans-reponses.mjs $1 $2` → donne-lui cette
   version sans réponses (toute la marche « Comprendre » et un exercice de chaque autre
   marche) ; **après** son rapport d'essais, donne-lui les corrections pour juger indices et
   solutions. Bloquants → retour à l'auteur → relecture.
5. `node scripts/couverture-terminale.mjs $1 $2 --partie exercices` → rapport vide (ou
   écarts tranchés, charte règle d'or 7).

# 3. Contrôles communs

1. `node scripts/verify.mjs` → VERIFY OK.
2. Rendu réel (Chromium : `/opt/pw-browsers/chromium`, `npm run dev`) : Aperçu, Cours (une
   notion entière, un exemple dévoilé, un « vérifie » répondu, un bloc de code s'il y en a),
   une marche d'exercices, un type bac, le mémo ; thème clair et sombre ; 1280 px et 390 px.
   Regarde les captures.
3. Critères de « fini » : charte § 9.4.

# 4. Livraison

- Branche + PR (jamais `main`), commit en français :
  `feat(terminale-$1) : <chapitre> — le cours` (ou `— les exercices`).
- Corps de PR : notions et priorités ; chiffres (blocs, exercices par marche, éclair, type
  bac) ; verdicts du relecteur (nombre de tours) et de l'élève-testeur ; écarts de quotas
  tranchés ; gênes non corrigées ; section `## Vérification` (commandes + résultats).
- `BACKLOG.md` : coche l'item, ajoute ce qui reste (widget animé souhaité, figure à
  dessiner, doute à trancher), en respectant la règle du clair.
