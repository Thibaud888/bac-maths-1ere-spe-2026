# Backlog

> 1 item = 1 session Claude (issue labellisée `claude` ou session Cloud) = 1 PR.
> Cocher + lien PR quand c'est mergé. `/dispatch` (claude-ops) lit ce fichier.
> Réserve détaillée : `.claude/figures-courbes-roadmap.md` (figures/lecture graphique par chapitre).

- [x] Exercices de lecture graphique dérivation `c-derivation-013` + `c-derivation-014` — specs
  complètes dans `.claude/figures-courbes-roadmap.md` §1 (parabole avec tangente, cubique) ;
  workflow 2 passes obligatoire (chapter-author → pedagogical-reviewer). DoD :
  `node scripts/verify.mjs` passe (validation contenu incluse).
  Déjà livré par la PR #16 (2026-05-12, `feat(derivation): exercices de lecture graphique`) ;
  contenu conforme aux specs vérifié en session #57, `node scripts/verify.mjs` OK. PR : #58.
- [x] Automatismes de lecture graphique dérivation (3 items : signe de f', intervalle de
  décroissance, f(x) ≥ g(x)) — specs dans le roadmap §1. DoD : verify passe, 2 passes respectées. ⚠️ Recadré le 2026-07-17 : « signe de f' » et « intervalle de décroissance » existent déjà (2 derniers items de `content/chapters/derivation/automatisms.json` + figures) — ne reste que l'automatisme f(x) ≥ g(x) (lecture graphique de comparaison) et sa figure.
  Livré par la PR #60 (2026-07-19) : `a-deriv-graph-comparaison-fg` + figure
  `public/figures/derivation/comparaison-courbes-fg.svg` (parabole $f(x)=x^2-x-1$ vs droite
  $g(x)=1$), workflow 2 passes respecté (PASS pedagogical-reviewer).
