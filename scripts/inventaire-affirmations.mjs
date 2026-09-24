#!/usr/bin/env node
/**
 * Inventaire des affirmations vérifiables du contenu réglementaire :
 * `content/bac/*.json` et `content/terminale/grand-oral/*.json`.
 *
 * Une ligne par champ qui porte un fait (chiffre, durée, date, règle, conseil qui
 * affirme quelque chose), avec l'identifiant de l'entrée, le champ et les sources
 * qu'elle cite. Sert de base à la relecture sur le texte officiel
 * (chantiers/verification-contenu-bac-2027.md).
 *
 * Contrôles automatiques, en fin de sortie :
 * - chaque jour de semaine écrit en toutes lettres correspond à la date qui le suit
 *   (« lundi 14 juin 2027 ») ;
 * - chaque source déclarée pointe un domaine officiel ;
 * - chaque source citée existe, et combien de fois elle est citée.
 *
 * Les relances de jury (`relances.json`) sont des questions, pas des affirmations :
 * elles ne sont pas inventoriées.
 *
 * Usage : node scripts/inventaire-affirmations.mjs [--json]
 * Exit 1 si un jour de semaine ne correspond pas à sa date ou si une source citée
 * n'existe pas ; 0 sinon.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const asJson = process.argv.includes('--json');

function read(relativePath) {
  return JSON.parse(readFileSync(join(root, relativePath), 'utf8'));
}

/** Champs inventoriés par fichier ; une fonction formate les champs non textuels. */
const FICHIERS = [
  {
    path: 'content/bac/coefficients.json',
    champs: {
      coefficient: (e) => String(e.coefficient),
      repartition: (e) =>
        e.repartition?.map((p) => `${p.part} en ${p.annee}`).join(' + '),
      quand: (e) => e.quand,
      profilNote: (e) => e.profilNote,
      comment: (e) => e.comment,
    },
  },
  {
    path: 'content/bac/epreuves.json',
    champs: {
      duree: (e) => e.duree,
      quand: (e) => e.quand,
      resume: (e) => e.resume,
      detail: (e) => e.detail,
    },
  },
  {
    path: 'content/bac/calendrier.json',
    champs: {
      quand: (e) => `${e.quand} [precision : ${e.precision}]`,
      detail: (e) => e.detail,
    },
  },
  {
    path: 'content/bac/mentions.json',
    champs: {
      palier: (e) => `[${e.seuil} ; ${e.plafond ?? '+∞'}[`,
      resume: (e) => e.resume,
      reglementaire: (e) => (e.reglementaire === false ? 'false' : undefined),
    },
  },
  {
    path: 'content/bac/sources.json',
    champs: {
      label: (e) => e.label,
      url: (e) => e.url,
      note: (e) => e.note,
    },
    sourcesDe: (e) => [e.id],
  },
  ...['epreuve', 'preparation', 'entretien'].map((nom) => ({
    path: `content/terminale/grand-oral/${nom}.json`,
    champs: {
      statement: (e) => e.statement,
      conseil: (e) => e.conseil,
    },
    nature: (e) => e.nature,
  })),
  {
    path: 'content/terminale/grand-oral/deroule.json',
    champs: {
      minutes: (e) => (e.minutes === undefined ? undefined : String(e.minutes)),
      resume: (e) => e.resume,
    },
  },
  {
    path: 'content/terminale/grand-oral/criteres.json',
    champs: {
      label: (e) => e.label,
      aide: (e) => e.aide,
    },
  },
];

const lignes = [];
for (const fichier of FICHIERS) {
  for (const entree of read(fichier.path)) {
    const sources = fichier.sourcesDe?.(entree) ?? entree.sources ?? [];
    for (const [champ, extraire] of Object.entries(fichier.champs)) {
      const texte = extraire(entree);
      if (texte === undefined || texte === '') continue;
      lignes.push({
        fichier: fichier.path,
        id: entree.id,
        champ,
        nature: fichier.nature?.(entree),
        texte,
        sources,
      });
    }
  }
}

// --- Contrôle 1 : jours de semaine ---------------------------------------------
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];
const reJour = new RegExp(`\\b(${JOURS.join('|')})\\s+(\\d{1,2})(?:er)?\\b`, 'gi');
const reMois = new RegExp(`\\b(${MOIS.join('|')})\\b`, 'i');

/**
 * « Du lundi 21 juin au vendredi 2 juillet 2027 », « mercredi 16, jeudi 17 et
 * vendredi 18 juin 2027 » : chaque couple jour + quantième prend le premier mois
 * qui le suit, puis la première année qui suit ce mois.
 */
function joursIncoherents(texte) {
  const erreurs = [];
  for (const m of texte.matchAll(reJour)) {
    const suite = texte.slice(m.index + m[0].length);
    const mois = suite.match(reMois);
    if (!mois) continue;
    const annee = suite.slice(mois.index).match(/\b(20\d\d)\b/);
    if (!annee) continue;
    const date = new Date(
      Date.UTC(Number(annee[1]), MOIS.indexOf(mois[1].toLowerCase()), Number(m[2]))
    );
    const attendu = JOURS[date.getUTCDay()];
    if (attendu !== m[1].toLowerCase()) {
      erreurs.push(`« ${m[1]} ${m[2]} ${mois[1]} ${annee[1]} » est un ${attendu}`);
    }
  }
  return erreurs;
}

const datesFausses = lignes.flatMap((l) =>
  joursIncoherents(l.texte).map((e) => `${l.fichier} · ${l.id} · ${l.champ} : ${e}`)
);

// --- Contrôle 2 : sources -------------------------------------------------------
const DOMAINES_OFFICIELS = ['education.gouv.fr', 'legifrance.gouv.fr'];
const sources = read('content/bac/sources.json');
const idsSources = new Set(sources.map((s) => s.id));
const horsDomaine = sources
  .filter((s) => {
    const host = new URL(s.url).hostname;
    return !DOMAINES_OFFICIELS.some((d) => host === d || host.endsWith(`.${d}`));
  })
  .map((s) => `${s.id} : ${s.url}`);

const citations = new Map(sources.map((s) => [s.id, new Set()]));
const fantomes = [];
for (const l of lignes) {
  if (l.fichier.endsWith('sources.json')) continue;
  for (const id of l.sources) {
    if (!idsSources.has(id)) fantomes.push(`${l.fichier} · ${l.id} cite ${id}`);
    else citations.get(id).add(l.id);
  }
}

// --- Sortie -----------------------------------------------------------------------
if (asJson) {
  console.log(
    JSON.stringify(
      {
        lignes,
        controles: {
          datesFausses,
          horsDomaine,
          fantomes,
          citations: Object.fromEntries(
            [...citations].map(([id, entrees]) => [id, [...entrees]])
          ),
        },
      },
      null,
      2
    )
  );
} else {
  const cellule = (s) => String(s).replace(/\|/g, '\\|').replace(/\n+/g, ' ⏎ ');
  console.log('| # | Fichier | Identifiant | Champ | Texte | Sources citées |');
  console.log('|---|---|---|---|---|---|');
  lignes.forEach((l, i) => {
    const champ = l.nature ? `${l.champ} (${l.nature})` : l.champ;
    console.log(
      `| ${i + 1} | ${l.fichier.replace('content/', '')} | ${l.id} | ${champ} | ${cellule(l.texte)} | ${l.sources.join(', ') || '—'} |`
    );
  });
  console.log(`\n${lignes.length} champs inventoriés.\n`);
  console.log('Citations par source :');
  for (const [id, entrees] of citations) {
    console.log(`- ${id} : ${entrees.size} entrée(s)`);
  }
  console.log(`\nJours de semaine incohérents : ${datesFausses.length}`);
  datesFausses.forEach((e) => console.log(`- ${e}`));
  console.log(`Sources hors domaine officiel : ${horsDomaine.length}`);
  horsDomaine.forEach((e) => console.log(`- ${e}`));
  console.log(`Sources citées mais non déclarées : ${fantomes.length}`);
  fantomes.forEach((e) => console.log(`- ${e}`));
}

process.exit(datesFausses.length > 0 || fantomes.length > 0 ? 1 : 0);
