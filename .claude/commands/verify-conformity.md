---
description: Validation globale du contenu pédagogique. Lance la validation Ajv sur tous les fichiers content/chapters/, puis invoque pedagogical-reviewer sur chaque chapitre. Utilisé avant tout commit important ou release.
argument-hint: [slug optionnel — limite la revue à un chapitre]
---

Vérifie la conformité globale du contenu pédagogique.

# Étapes

## 1. Validation Ajv (rapide, machine)

Exécute `npm run validate-content` (ou `node scripts/validate-content.mjs` si l'utilisateur n'a pas installé les dépendances). Cette étape :
- Charge les 4 schémas JSON dans `schemas/`
- Parcourt `content/chapters/*` et valide chaque item de chaque fichier
- Reporte exit code 0 si tout est OK, 1 sinon
- Affiche un résumé `Validés : X / N` + détail des problèmes

Si exit code = 1, **arrête-toi ici** : signaler à l'utilisateur les problèmes structurels avant d'aller plus loin (le pedagogical-reviewer suppose des données déjà valides côté schéma).

## 2. Revue pédagogique (lente, sub-agent)

Si la validation Ajv passe :

**Détermine** la liste des chapitres à relire :
- Si l'utilisateur a passé un argument `$1`, ne relis que ce chapitre (`content/chapters/$1/`)
- Sinon, parcours tous les sous-dossiers de `content/chapters/`

**Pour chaque chapitre**, **invoque en parallèle** le sub-agent `pedagogical-reviewer` sur les 4 fichiers du chapitre (`formulas`, `automatisms`, `classics`, `exam-style`). C'est-à-dire : lance les invocations des sub-agents simultanément (un même message avec plusieurs appels Agent), pas séquentiellement.

Ne relis pas `meta.json` avec le pedagogical-reviewer (pas de schéma dédié, contenu trivial).

## 3. Compte-rendu final

Agrège les rapports en un récapitulatif :

```
# Verify-conformity — résultat

## Étape 1 — Schémas Ajv
✓ ou ✗ (avec liste des erreurs si ✗)

## Étape 2 — Revue pédagogique

### Chapitre <slug>
- formulas : PASS / NEEDS_REVISION (X défauts bloquants)
- automatisms : PASS / NEEDS_REVISION
- classics : PASS / NEEDS_REVISION
- exam-style : PASS / NEEDS_REVISION

### Chapitre <slug suivant>
...

## Action recommandée
- Si tout PASS : `git add content/ && git commit -m "..."` est sûr.
- Si NEEDS_REVISION quelque part : ré-invoquer chapter-author sur les fichiers concernés en lui passant les défauts à corriger, puis re-vérifier.
```

# Note

Les sub-agents s'exécutent dans des contextes séparés ; ne pas leur copier-coller du contenu massif dans le prompt — leur indiquer le chemin du fichier suffit, ils sauront le lire.
