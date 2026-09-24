# Textes officiels et sujets de bac : comment y accéder depuis une session cloud

> Constaté le 2026-09-24, réglage réseau « Personnalisé » de l'environnement en place
> (`*.education.gouv.fr`, `*.legifrance.gouv.fr`, `*.apmep.fr`, `*.labolycee.org`).
> Marche à suivre décidée par Thibaud le même jour. **À lire avant de chercher un texte
> officiel ou un sujet de bac** : une session ne s'arrête pas sur ce problème d'accès.

## Ce qui s'ouvre et ce qui ne s'ouvre pas

| Site | Depuis la session (`curl`, `WebFetch`) | Pourquoi |
|---|---|---|
| `www.apmep.fr` (sujets de maths) | **ouvert** | autorisé par le réglage réseau |
| `www.labolycee.org` (sujets de physique-chimie) | **ouvert** | autorisé par le réglage réseau |
| `www.education.gouv.fr`, `eduscol.education.gouv.fr` | **403** « Attention Required » (Cloudflare) | le **site** refuse les serveurs cloud ; le réseau de la session laisse passer |
| `www.legifrance.gouv.fr` | **403** (Cloudflare) | idem |
| `web.archive.org` | refusé | hors de la liste autorisée ; `WebFetch` refuse aussi |
| recherche web (`WebSearch`) | marche | extraits seulement, pas le texte intégral |

Conséquences :

- **Inutile de retoucher le réglage réseau** : le blocage vient du ministère, pas de
  l'environnement. Ne pas renvoyer Thibaud dans les réglages pour ça.
- **Inutile de s'arrêter** : on applique la marche à suivre ci-dessous.

## La marche à suivre

1. **Sujets de bac passés (annales)** → APMEP pour les maths, Labolycée pour la
   physique-chimie : ils reproduisent les sujets officiels. L'adresse notée (`url` dans
   `annales.json`) est celle de la page réellement lue. Point d'entrée APMEP :
   <https://www.apmep.fr/Annales-examens-Brevet-CAP-BEP-Bac-BTS-et-concours-niveau-Terminale>.
2. **Textes réglementaires** (Bulletin officiel, programmes, notes de service, arrêtés) →
   **Thibaud fournit le texte** :
   - la session lui envoie **une seule demande** qui liste les textes voulus (titre en clair
     et adresse officielle, voir le modèle plus bas), le plus tôt possible dans la session ;
   - Thibaud ouvre les pages depuis son navigateur, puis **colle le texte dans le message**,
     ou **dépose le PDF** sur GitHub dans `docs/textes-officiels/` (« Add file » → « Upload
     files ») ; le fichier porte le nom de la référence (ex. `MENE2622694N.pdf`) ;
   - la session lit ce texte et **cite toujours l'adresse officielle** : `content/bac/sources.json`
     ne contient que des adresses `education.gouv.fr` ou `eduscol` (CLAUDE.md § 4.2), jamais
     le chemin du fichier déposé.
3. **En attendant le texte** : avancer sur ce qui n'en dépend pas. Les extraits de la
   recherche web servent à **repérer** un texte ou à **recouper**, pas à fonder seuls un
   chiffre ; si une PR s'appuie dessus, elle dit que le texte intégral n'a pas été relu.

## Modèle de demande à Thibaud

> J'ai besoin de N textes officiels que je ne peux pas ouvrir d'ici (le site du ministère
> bloque les serveurs du cloud). Ouvre-les depuis ton téléphone ou ton ordinateur, puis
> colle le texte ici, ou dépose le PDF dans `docs/textes-officiels/` sur GitHub :
>
> 1. *titre en clair* — adresse
> 2. …

## Retester l'accès

Si le ministère lève un jour son blocage, cette page est à mettre à jour :

```sh
for u in https://www.education.gouv.fr/ https://eduscol.education.gouv.fr/ \
         https://www.legifrance.gouv.fr/ https://www.apmep.fr/ https://www.labolycee.org/; do
  printf '%s -> ' "$u"; curl -sS -o /dev/null -w '%{http_code}\n' --max-time 20 "$u"
done
```

Un 403 sur les trois premières et 200 sur les deux dernières confirme le tableau ci-dessus.
Un « CONNECT tunnel failed, response 403 » signifie autre chose : le domaine n'est pas dans
la liste autorisée de l'environnement (c'est alors le réglage réseau qu'il faut revoir).
