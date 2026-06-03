---
description: Scaffolding pour un nouveau module français. Crée content/francais/<slug>/ avec meta.json + 3 fichiers JSON vides (fiches.json, quiz.json, exercices.json). N'écrit pas de contenu pédagogique — pour ça, invoque le sub-agent french-content-author après le scaffolding.
---

Crée le scaffolding pour le module français dont le slug est : **$ARGUMENTS**

**Étapes à exécuter :**

1. Vérifie que le dossier `content/francais/$ARGUMENTS/` n'existe pas déjà. Si oui, arrête et signale-le.

2. Crée le dossier `content/francais/$ARGUMENTS/`.

3. Crée `content/francais/$ARGUMENTS/meta.json` avec ce template (à adapter selon le slug) :
```json
{
  "slug": "$ARGUMENTS",
  "title": "<Titre complet du module>",
  "family": "<methode | reperes | objet-etude>",
  "description": "<Description courte — 1 phrase>",
  "icon": "📚",
  "order": 99
}
```

4. Crée `content/francais/$ARGUMENTS/fiches.json` avec `[]`.

5. Crée `content/francais/$ARGUMENTS/quiz.json` avec `[]`.

6. Crée `content/francais/$ARGUMENTS/exercices.json` avec `[]`.

7. Affiche un récapitulatif des fichiers créés et rappelle la commande pour générer le contenu :
```
Module "$ARGUMENTS" scaffoldé.
Fichiers créés :
  content/francais/$ARGUMENTS/meta.json
  content/francais/$ARGUMENTS/fiches.json
  content/francais/$ARGUMENTS/quiz.json
  content/francais/$ARGUMENTS/exercices.json

Prochaine étape : invoquer le sub-agent french-content-author pour générer le contenu.
```

**Important :** Le scaffolding crée des fichiers vides. Ne pas générer de contenu directement — toujours passer par le workflow 2 passes (french-content-author → french-reviewer).
