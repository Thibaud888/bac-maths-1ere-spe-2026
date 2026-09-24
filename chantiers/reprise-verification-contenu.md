# Reprise de la vérification — corriger le contenu réglementaire sur le `main` du 2026-09-23

> À coller dans la session de vérification quand Thibaud la relance (ou dans une session
> **Cloud** neuve) sur `Thibaud888/bac-maths-1ere-spe-2026`.
> Prérequis : aucun. Les pages HTML du ministère refusent les sessions cloud : lire les
> textes intégraux sur leurs PDF (`docs/sources-officielles.md`).

## Prompt de handoff (coller tel quel)

Contexte : la PR de vérification #76 (branche `verif/contenu-bac-2027`, rapport
`chantiers/verification-contenu-bac-2027.md`, script `scripts/inventaire-affirmations.mjs`)
est partie d'un `main` ancien (0596678). Depuis, quatre PR ont été fusionnées : #77, #78, #79
(relectures de Thibaud) et #80, #81 (mise en forme, page « Exposé »). Aucune n'a corrigé un fait
signalé par le rapport : les 7 faux et les imprécisions sont toujours là. En revanche,
plusieurs éléments ont bougé :

- **Numéros de ligne des composants** : tous périmés (`LeBacPage.tsx`, pages du grand oral).
  Les identifiants JSON (`id` · champ) du rapport, eux, sont inchangés.
- **« Le bac »** : la section « Les coefficients » est supprimée. L'échelle des mentions est une
  règle proportionnelle qui lit `plafond` (sans plafond, elle va jusqu'à 20). « L'essentiel » ne
  garde qu'une barre des coefficients. Le texte des rattrapages et des mentions est dans des
  cartes `ARetenir` (« Entre 8 et 10 », « La mention », palier hors échelle).
- **Textes du JSON retouchés en #80** (des mots ajoutés, aucun fait changé) :
  - `ca-grand-oral` · detail ;
  - `ca-rattrapage` · detail ;
  - `ep-francais-oral` · resume ;
  - `gt-expose` · resume ;
  - `go-epreuve-questions` · statement ;
  - `go-epreuve-jury` · statement ;
  - `go-epreuve-ancien-format` (statement, conseil).
- **Nouvelle page « Exposé »** (#81, `content/terminale/grand-oral/expose.json`) : la fiche
  réglementaire `go-exp-salle` dit déjà « de quoi écrire, un tableau si tu le souhaites, aucun
  autre matériel ». Elle s'appuie sur les extraits n° 76 et 78 du rapport. L'item n° 78 vaut
  toujours pour `go-epreuve-preparation-du-jour`, sur la page « L'épreuve ».
- **Affichage** : apostrophe courbe et espaces insécables via `src/lib/typographie.ts`. Le JSON
  garde l'apostrophe droite ; ne pas le réécrire pour ça.
- **Garde-fou** : `node scripts/faits-inchanges.mjs` liste, entrée par entrée, les nombres,
  dates et sources qui changent entre `origin/main` et l'arbre de travail.

Fais, dans l'ordre :
1. Lis MAP.md, CLAUDE.md (§ 0, § 1.1 « Mise en forme des pages de lecture », § 4.2, § 4.3) et
   ton rapport.
2. Mets ta branche à jour. Fusionne `origin/main` dans `verif/contenu-bac-2027`, sans rebase.
   Pour `BACKLOG.md`, garde les deux côtés : les items de `main` et tes items de correction.
3. Mets à jour, dans ton rapport, les renvois vers les composants qui ont bougé (colonne
   « Où »), sans changer les verdicts.
4. Traite les items « Corriger le contenu réglementaire » du backlog, un par PR comme le veut
   CLAUDE.md § 0, en commençant par les faux : n° 29, 51, 40, 60, 63, 67, 26. Pour chaque
   correction :
   - l'extrait officiel est cité dans la PR ;
   - `node scripts/faits-inchanges.mjs` ne montre que les faits voulus ;
   - les tests du simulateur qui portent sur les paliers de mention suivent (n° 50, 51).
5. Les pages HTML du ministère refusent les sessions cloud : lis les textes intégraux sur
   leurs PDF, sinon demande-les à Thibaud (`docs/sources-officielles.md`) ; en attendant,
   travaille sur les extraits du rapport et dis-le dans chaque PR.

Contraintes : réponses et commits en français ; branche + PR, jamais de push sur `main` ;
aucun coefficient en dur (CLAUDE.md § 4.2) ; aucune date inventée ; les minutes des temps du
grand oral seulement dans `deroule.json` ; aucune dépendance NPM nouvelle.
Definition of done : les faux du rapport corrigés et sourcés sur le texte en vigueur pour 2027,
`node scripts/verify.mjs` OK (au moins 169 tests), rendu vérifié dans Chromium.
Termine en mettant à jour le `BACKLOG.md` (statut + lien PR).
