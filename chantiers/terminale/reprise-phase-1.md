# Terminale — lancer les sessions suivantes

> Mis à jour le 2026-09-24, au bilan de la session du référentiel maths (PR #87). Chaque bloc
> ci-dessous se colle tel quel dans une **nouvelle** session Cloud sur
> `Thibaud888/bac-maths-1ere-spe-2026`. Une session = un item = une PR.

## Déjà fait

- Cadrage des espaces de terminale (#85), fichiers et contrôles des chapitres (#86),
  référentiel des maths : programme officiel au mot près et format de l'épreuve 2027 (#87).
- Réseau : le réglage de l'environnement est fait. Les pages HTML du Bulletin officiel
  refusent quand même les sessions Cloud (c'est le site, pas le réglage) ; ses **PDF**
  s'ouvrent et suffisent. `apmep.fr` répond. Marche à suivre : `docs/sources-officielles.md`.

## À lancer maintenant — en parallèle, une session chacune

### Session B — la liste officielle du programme de physique-chimie (PDF du ministère)

```
Traite l'item de BACKLOG.md « Écrire la liste officielle de ce qu'il faut savoir en
physique-chimie de terminale ». Lis d'abord MAP.md, CLAUDE.md § 14,
chantiers/terminale/README.md, la charte .claude/skills/terminale-charte/SKILL.md (§§ 2, 3.1,
9) et, comme modèle, le référentiel maths .claude/skills/bac-maths-terminale-2027/SKILL.md.
Vérifie d'abord que tu ouvres le PDF
https://www.education.gouv.fr/sites/default/files/document/20260917boenjsspe4pdf-520753.pdf
(les pages HTML du BO sont refusées aux sessions Cloud, les PDF passent) ; sinon arrête-toi
et dis-le. Tout vient du texte officiel, rien de mémoire.
```

### Session D — les pages « Aperçu » et « Cours » (sans réseau)

```
Traite l'item de BACKLOG.md « Construire les pages « Aperçu » et « Cours » d'un chapitre de
terminale ». Lis d'abord MAP.md, CLAUDE.md § 14, chantiers/terminale/README.md (§ 4) et la
charte .claude/skills/terminale-charte/SKILL.md (§§ 3, 4, 11). Construis sur le
chapitre-témoin (npm run dev:temoin), aucun contenu pédagogique. Avant de conclure, regarde
le rendu réel (Chromium) en clair et en sombre, sur ordinateur et en largeur téléphone.
```

### Session E — compter ce qui tombe vraiment au bac de maths (apmep.fr, PDF)

```
Traite l'item de BACKLOG.md « Compter ce qui tombe vraiment au bac de maths ». Lis d'abord
MAP.md, la charte .claude/skills/terminale-charte/SKILL.md (§§ 3.2, 5.1) et le référentiel
.claude/skills/bac-maths-terminale-2027/SKILL.md (§ 4 : ce qui pouvait tomber à chaque
session). Vérifie d'abord que tu ouvres https://www.apmep.fr/ ; sinon arrête-toi et dis-le.
Indexe avec l'agent annales-indexeur, par lots (une session d'examen par appel) ; ne recopie
jamais un corrigé. Si l'index ne peut pas être complet en une session, livre les lots faits
et note précisément ce qui reste dans BACKLOG.md.
```

### Session F — corriger les références officielles des épreuves (PDF du ministère, petite)

```
Traite l'item de BACKLOG.md « Mettre à jour les références officielles des épreuves de
spécialité ». Lis d'abord MAP.md, CLAUDE.md § 4.2 et le référentiel maths
.claude/skills/bac-maths-terminale-2027/SKILL.md (§§ 1 et 3). Les textes sont dans le PDF
https://www.education.gouv.fr/sites/default/files/document/20260917boenjsspe4pdf-520753.pdf
(les pages HTML du BO sont refusées aux sessions Cloud). Rien de mémoire ;
node scripts/faits-inchanges.mjs doit lister exactement ce qui change.
```

## Ensuite

1. **Les pages d'entraînement** (exercices, type bac, mémo) : après la session D, dont elles
   reprennent les composants.
2. **Le premier chapitre de maths** (`/tle-chapitre maths <slug>`) : Thibaud choisit le
   chapitre et tranche l'ordre de l'année (`chapitres-maths.md`, fin : l'espérance de la loi
   binomiale arrive au ch. 15, quatre chapitres après la loi binomiale). Le cours peut
   s'écrire dès maintenant ; la fin du chapitre demande les pages (captures).
3. **Le premier chapitre de physique-chimie** : après la session B.
4. **Les chapitres suivants**, un par session, dans l'ordre de l'année ; la page « Méthodes »
   de chaque matière.
