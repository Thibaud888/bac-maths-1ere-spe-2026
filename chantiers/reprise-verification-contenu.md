# Reprise de la vérification — les corrections qui restent

> À coller dans une session neuve (locale de préférence, ou **Cloud**) sur
> `Thibaud888/bac-maths-1ere-spe-2026`.
> Prérequis : aucun. Session locale : le navigateur intégré lit les pages du ministère (`curl`
> y reçoit un 403) ; session Cloud : lire les textes sur leurs PDF (`docs/sources-officielles.md`).

## Prompt de handoff (coller tel quel)

Contexte : la vérification du contenu réglementaire (PR #76, fusionnée le 2026-09-27) a relu
88 affirmations de « Le bac, mode d'emploi », du simulateur et du grand oral sur les textes
officiels en vigueur pour la session 2027. Rapport : `chantiers/verification-contenu-bac-2027.md`,
avec pour chaque ligne l'extrait officiel exact et son adresse. Les corrections les plus graves
sont faites : calculatrice en spécialité maths, mentions (très bien de 16 à 18, félicitations à
partir de 18), dates de la partie pratique de physique-chimie, deux questions et échange du grand
oral, rattrapage, sources périmées. Restent les items ouverts de `BACKLOG.md`, section
« Corriger le contenu réglementaire » :

- n° 26 (faux) : ep-maths-anticipee · detail et note de s-eam disent « créée pour la session
  2026 » ; l'épreuve compte pour la session 2027.
- n° 78 : go-epreuve-preparation-du-jour · conseil — la règle du matériel (de quoi écrire, un
  tableau si on le souhaite, rien d'autre) ; la page « Exposé » la donne déjà (`go-exp-salle`).
- n° 86 : le projet d'orientation présenté comme une attente du jury (go-ent-orientation, champ
  « Pourquoi cette question » de `QuestionForm.tsx`, relances « Ton projet »).
- n° 36, 75, 80 : trois nuances de « L'épreuve » (sept critères et non quatre, jury pas forcément
  non spécialiste, grille « sur laquelle le jury peut s'appuyer »).
- n° 8, 22 : notes de première « connues » plutôt que « définitives ».
- n° 17 : la physique-chimie n'est pas la seule épreuve pratique du bac.
- n° 65 et lignes « vraies mais mal sourcées » : sources à compléter.
- n° 45, 46 : jours des écrits de spécialité — **laissé de côté par Thibaud le 2026-09-27 :
  lui demander avant d'y toucher.**

Les numéros de ligne des composants cités dans le rapport datent du commit 0596678 et sont
périmés ; les identifiants JSON (`id` · champ) restent valables.

Fais, dans l'ordre :
1. Lis MAP.md, CLAUDE.md (§ 0, § 1.1 « Le site reste général » et « Mise en forme des pages de
   lecture », § 4.2, § 4.3) et les lignes du rapport concernées.
2. Relis chaque extrait sur le texte officiel, à l'adresse donnée par le rapport.
3. Corrige item par item, un item par PR (CLAUDE.md § 0), sauf si Thibaud demande de les grouper.
   **Règle d'écriture, demandée par Thibaud le 2026-09-27** : la correction se fond dans le texte
   existant. On retravaille la phrase en place, sobrement, comme si c'était le texte d'origine ;
   aucune phrase ajoutée qui trahit la correction, aucune insistance sur le point corrigé.
4. `node scripts/faits-inchanges.mjs` ne montre que les faits voulus ;
   `node scripts/inventaire-affirmations.mjs` finit sans alerte.
5. Vérifie le rendu dans Chromium, sur ordinateur et sur téléphone.

Contraintes : réponses et commits en français ; branche + PR, jamais de push sur `main` ; site
général (ce qui dépend d'un profil est un « Exemple : … ») ; aucun coefficient en dur
(CLAUDE.md § 4.2) ; aucune date inventée ; les minutes des temps du grand oral seulement dans
`deroule.json` ; aucune dépendance NPM nouvelle.
Definition of done : chaque item traité coché dans `BACKLOG.md` avec le lien de sa PR, l'extrait
officiel cité dans la PR, `node scripts/verify.mjs` OK (au moins 222 tests).
