---
description: Validation globale du contenu pédagogique français. Lance la validation Ajv sur content/francais/ via validate-francais.mjs, puis invoque french-reviewer sur chaque module. Utilisé avant tout commit important de contenu français.
---

Lance la vérification complète du contenu français.

**Si $ARGUMENTS est fourni** : vérifier uniquement le module dont le slug est $ARGUMENTS.
**Sinon** : vérifier tous les modules dans `content/francais/`.

**Étapes :**

1. **Validation Ajv (schémas)** :
   ```
   node scripts/validate-francais.mjs
   ```
   Si la validation échoue, afficher les erreurs et arrêter — ne pas lancer le reviewer sur du contenu invalide.

2. **Pour chaque module à vérifier** (ou uniquement $ARGUMENTS si fourni) :
   - Lister les fichiers présents (`fiches.json`, `quiz.json`, `exercices.json`)
   - Pour chaque fichier non vide (`[]`), invoquer le sub-agent **`french-reviewer`** avec :
     - le slug du module
     - le type de fichier
     - le contenu du fichier
   - Collecter les rapports de revue

3. **Rapport final** :
   - Récapituler le verdict de chaque passe (PASS / NEEDS_REVISION)
   - Lister les modules validés vs. les modules à corriger
   - Si des modules sont `NEEDS_REVISION`, indiquer les actions à soumettre à `french-content-author`

**Important :** Cette commande est en lecture seule — elle ne modifie aucun fichier. Les corrections passent par `french-content-author` suivi d'une nouvelle vérification.
