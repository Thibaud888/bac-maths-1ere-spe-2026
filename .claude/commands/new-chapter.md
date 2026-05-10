---
description: Scaffolding pour un nouveau chapitre. Crée content/chapters/<slug>/ avec meta.json + 4 fichiers JSON vides ([]). N'écrit pas de contenu pédagogique — pour ça, invoque le sub-agent chapter-author après le scaffolding.
argument-hint: <slug> [title] [domain] [order]
---

Crée le scaffolding d'un nouveau chapitre. Argument : **`$1`** (slug, obligatoire) ; arguments suivants optionnels : `$2` (titre), `$3` (domain : `algebre`, `analyse`, `geometrie` ou `probabilites`), `$4` (order, multiple de 10).

# Étapes

1. **Valider** que le slug `$1` :
   - n'est pas vide
   - est en `kebab-case` (lowercase, traits d'union)
   - figure dans la liste des chapitres autorisés du programme (cf. `.claude/skills/bac-maths-premiere-spe-2026/SKILL.md` § 2 et l'enum `chapter` des schémas dans `schemas/`)
   - n'existe pas déjà sous `content/chapters/$1/` (sinon refuser et signaler à l'utilisateur)

2. **Créer** le dossier `content/chapters/$1/` et y écrire 5 fichiers :

   - `meta.json` :
     ```json
     {
       "slug": "$1",
       "title": "<titre fourni en $2 ou à compléter>",
       "shortTitle": "<court — par défaut = title>",
       "domain": "<$3 ou à compléter>",
       "order": <$4 ou à compléter>,
       "description": "<une phrase à compléter>"
     }
     ```
     Si `$2`, `$3`, `$4` sont fournis, les utiliser tels quels. Sinon, laisser des valeurs placeholder explicitement marquées `À COMPLÉTER` pour que l'utilisateur sache qu'il faut éditer.

   - `formulas.json` : `[]`
   - `automatisms.json` : `[]`
   - `classics.json` : `[]`
   - `exam-style.json` : `[]`

3. **Confirmer** à l'utilisateur :
   - Chemin du dossier créé
   - Liste des 5 fichiers
   - Action suivante recommandée : invoquer le sub-agent `chapter-author` pour générer le contenu, en commençant typiquement par `formulas` puis `automatisms` puis `classics` puis `exam-style`.

# Note importante

Ne **pas** générer de contenu pédagogique dans cette commande. Le scaffolding est volontairement minimal pour rester dans le workflow obligatoire 2 passes (`chapter-author` → `pedagogical-reviewer`) défini dans `CLAUDE.md` § 7.
