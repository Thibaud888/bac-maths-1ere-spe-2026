# Limites de fonctions — écrire les exercices du 3e chapitre de maths de terminale

> À lancer dans une session **Cloud** neuve sur `Thibaud888/bac-maths-1ere-spe-2026`, en
> `/effort high` (la session ne fait que coordonner ; les agents `tle-*` tournent en `xhigh`).
> Prérequis : le cours fusionné (PR #120).

## Prompt de handoff (coller tel quel)

Contexte : application de révision du bac. En maths de terminale, le cours de **Limites de
fonctions** (`limites-fonctions`) est écrit et fusionné (PR #120). Il compte 4 notions :
- définitions et asymptotes ★★ ;
- limites de référence, opérations, formes indéterminées, composition ★★★ ;
- comparaison et encadrement ★ ;
- croissances comparées et choix de la méthode ★★★.

Il reste les exercices.

Lance `/tle-chapitre maths limites-fonctions exercices` et suis la procédure jusqu'à la PR.

Points à garder en tête :
1. **Interdits du chapitre** (ordre de l'année), à donner aux deux auteurs :
   - ln sous toutes ses formes (ch. 7) ;
   - continuité, TVI et « admet une unique solution » (ch. 4) ;
   - dérivée d'une composée générale, dérivée seconde, convexité (ch. 5) ; restent permises
     les dérivées de g(ax + b) et de e^(ax + b) ;
   - dérivées de sin et cos, et lim sin(x)/x ;
   - primitives et intégrales.

   Beaucoup d'annales « limites » portent sur ln : ne pas les reprendre telles quelles, ou
   retirer les questions concernées en le notant (`adaptation`).
2. **Ce que le cours pose** :
   - composition par changement de variable X = u(x) (bloc 025), sans théorème général ;
   - limites de eˣ, √x, xⁿ en un réel a, admises (016) ;
   - asymptote verticale = droite x = a ; l'axe des ordonnées est la droite x = 0.

   Un exercice ne mobilise rien d'autre.
3. **Gênes de l'élève-testeur** : les corriger dans la session, dans la même PR, puis les
   faire relire (demande de Thibaud du 2026-10-10).
4. **Défaut d'affichage** vu par `controle-rendu.mjs` : le noter au backlog, sans toucher à
   l'interface.

Contraintes :
- en français ;
- branche + PR, jamais `main` ;
- commit `feat(terminale-limites-fonctions) : limites de fonctions — les exercices`.

Definition of done : charte § 9.4 (partie « exercices ») :
- couverture « exercices » vide ;
- relecteur PASS ;
- élève-testeur CLAIR, ou ses bloquants corrigés et relus ;
- `node scripts/verify.mjs` → VERIFY OK ;
- `controle-rendu.mjs` sans écart, avec ses 4 captures regardées.

PR avec sections `## Coût` et `## Vérification`.
Termine en mettant à jour le `BACKLOG.md` : coche « Limites de fonctions : les exercices »
avec le lien de la PR, et ajoute ce qui reste.
