# Limites de fonctions — écrire le cours du 3e chapitre de maths de terminale

> À lancer dans une session **Cloud** neuve sur `Thibaud888/bac-maths-1ere-spe-2026`, en
> `/effort high` (la session ne fait que coordonner ; les agents `tle-*` tournent en `xhigh`).
> Prérequis : aucun (référentiel maths, annales complètes et mécanique en place).

## Prompt de handoff (coller tel quel)

Contexte : application de révision du bac. En maths de terminale, trois chapitres sont écrits
et fusionnés : Dénombrement, Récurrence et suites, Limites de suites (cours PR #114,
exercices PR #118). Le chapitre suivant dans l'ordre de la classe est **Limites de fonctions**
(`limites-fonctions`, 9 lignes du programme, n° 3 de `chantiers/terminale/chapitres-maths.md`).
`content/terminale/maths/annales.json` est complet : les priorités se mesurent.

Lance `/tle-chapitre maths limites-fonctions cours` et suis la procédure jusqu'à la PR.

Points à garder en tête :
1. **Ordre de l'année** : le logarithme vient au chapitre 7 et la continuité au chapitre 4.
   Les croissances comparées se font ici avec l'exponentielle et les puissances seulement.
   L'architecte relève les interdits du chapitre ; donne-les aux auteurs.
2. **S'appuyer sur Limites de suites** : les tableaux d'opérations, les formes
   indéterminées et les gendarmes y sont posés. Le cours de fonctions y renvoie au lieu de
   tout réécrire (`revoir` vers `l-limites-suites-…`).
3. **Gênes de l'élève-testeur** : les corriger dans la session, dans la même PR, puis les
   faire relire. Ne pas les laisser seulement au backlog (demande de Thibaud du 2026-10-10).
4. **Défaut d'affichage** vu par `controle-rendu.mjs` : le noter au backlog. Une session de
   chapitre ne touche pas à l'interface, sauf si Thibaud le demande.

Contraintes : français ; branche + PR (jamais `main`) ; commit
`feat(terminale-limites-fonctions) : limites de fonctions — le cours` ; une session = une
partie (les exercices viendront dans une autre session neuve).
Definition of done : charte § 9.4 :
- couverture « cours » vide ;
- relecteur PASS ;
- élève-testeur CLAIR, ou ses bloquants corrigés et relus ;
- `node scripts/verify.mjs` → VERIFY OK ;
- `controle-rendu.mjs` sans écart, avec ses 4 captures regardées.

PR avec sections `## Coût` et `## Vérification`.
Termine en mettant à jour le `BACKLOG.md` : coche « Limites de fonctions : le cours » avec le
lien de la PR, et ajoute ce qui reste.
