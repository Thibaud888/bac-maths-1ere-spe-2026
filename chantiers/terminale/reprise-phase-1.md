# Terminale — lancer les sessions suivantes

> Écrit le 2026-09-24, à la fin de la session de cadrage (PR #85). Chaque bloc ci-dessous
> se colle tel quel dans une **nouvelle** session Cloud sur
> `Thibaud888/bac-maths-1ere-spe-2026`. Une session = un item = une PR.

## Avant tout : le réglage réseau (à faire par Thibaud, une fois)

Menu de l'environnement (barre de titre) → Edit → accès réseau → **Personnalisé** →
cocher la case qui garde la liste par défaut (« Also include default list of common package
managers ») → une adresse par ligne :

```
*.education.gouv.fr
*.legifrance.gouv.fr
*.apmep.fr
*.labolycee.org
```

Le réglage vaut pour les sessions **démarrées après** l'enregistrement.

## Session A — la liste officielle du programme de maths (réseau requis)

```
Traite l'item de BACKLOG.md « Écrire la liste officielle de ce qu'il faut savoir en maths
de terminale ». Lis d'abord MAP.md, CLAUDE.md § 14, chantiers/terminale/README.md et la
charte .claude/skills/terminale-charte/SKILL.md (§§ 2, 3.1, 9). Vérifie d'abord que tu
ouvres https://www.education.gouv.fr/bo/2026/Special4/MENE2622694N ; sinon arrête-toi et
dis-le. Tout vient du texte officiel, rien de mémoire.
```

## Session B — la même chose en physique-chimie (réseau requis, parallèle à A)

```
Traite l'item de BACKLOG.md « Écrire la liste officielle de ce qu'il faut savoir en
physique-chimie de terminale ». Mêmes lectures et même contrôle d'accès que pour les maths
(chantiers/terminale/reprise-phase-1.md, session A).
```

## Session C — la mécanique du site (sans réseau, parallèle à A et B)

```
Traite l'item de BACKLOG.md « Préparer les fichiers et les contrôles des chapitres de
terminale ». Lis d'abord MAP.md, CLAUDE.md § 14, chantiers/terminale/README.md et la charte
.claude/skills/terminale-charte/SKILL.md en entier : son § 3 est le cahier des charges des
schémas. Aucun contenu pédagogique : le chapitre-témoin vit dans tests/fixtures/terminale/.
```

Ensuite, dans l'ordre du backlog : les pages « Aperçu » et « Cours », les pages
d'entraînement, puis les chapitres pilotes (Thibaud désigne le chapitre).
