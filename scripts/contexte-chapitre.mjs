#!/usr/bin/env node
/**
 * Fiche de lecture d'un chapitre de terminale : ce dont un agent tle-* a besoin, en un seul
 * fichier, au lieu de relire programme.json, annales.json, le référentiel et les cours des
 * chapitres antérieurs en entier (étude chantiers/terminale/optimisation-tokens.md, piste 2).
 *
 * Usage : node scripts/contexte-chapitre.mjs <matiere> <chapitre> [--role <rôle>]
 *           [--racine <dossier>] [--sortie <fichier>]
 *
 * Rôles : architecte, auteur-cours, auteur-exercices, auteur-bac, relecteur, eleve-testeur
 * (sans --role : tout). La fiche contient, selon le rôle :
 *   - l'ordre des chapitres de la matière (écrits ou non) et la place de celui-ci ;
 *   - les lignes du programme du chapitre, texte exact ;
 *   - les lignes citables d'ailleurs (chapitres antérieurs écrits, « Méthodes », première)
 *     et les identifiants interdits (chapitres ultérieurs ou pas encore écrits) ;
 *   - les formulations des annales qui touchent les lignes du chapitre ;
 *   - l'index des chapitres antérieurs (notions, blocs du cours, cartes du mémo) ;
 *   - les sections du référentiel et du chantier utiles au rôle.
 * Les sources complètes restent la référence : la fiche dit où les ouvrir en cas de doute.
 * Sans --sortie, la fiche est écrite sur la sortie standard.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MATIERES, RACINE_DEPOT, lireMatiere } from './lib/terminale.mjs';

export const ROLES = ['architecte', 'auteur-cours', 'auteur-exercices', 'auteur-bac', 'relecteur', 'eleve-testeur'];

/** Ce que chaque rôle reçoit. Sections du référentiel : numéros de titres `## n.` ou `### n.m`. */
const BESOINS = {
  architecte: { programme: true, citables: true, annales: true, index: true, premiere: true, referentiel: ['5.2', '6', '7'], chantier: true },
  'auteur-cours': { programme: true, citables: true, annales: false, index: true, premiere: true, referentiel: ['5.2', '6', '7', '8'], liensMaths: true },
  'auteur-exercices': { programme: true, citables: true, annales: false, index: true, premiere: false, referentiel: ['5.2', '6', '7', '8'] },
  'auteur-bac': { programme: true, citables: true, annales: true, index: true, premiere: false, referentiel: ['3', '6', '7', '8'] },
  relecteur: { programme: true, citables: true, annales: true, index: true, premiere: true, referentiel: ['3', '5.2', '6', '7', '8'] },
  'eleve-testeur': { programme: false, citables: false, annales: false, index: true, premiere: false, referentiel: [] },
};
const TOUT = { programme: true, citables: true, annales: true, index: true, premiere: true, referentiel: ['3', '5.2', '6', '7', '8'], chantier: true, liensMaths: true };

const liste = (v) => (Array.isArray(v) ? v : []);
const estTransverse = (slug) => slug.startsWith('methodes-');

/** Lignes `| n | \`slug\` | Titre | …` du chantier : l'ordre proposé de l'année. */
export function ordreDuChantier(texte) {
  const ordre = [];
  for (const ligne of texte.split('\n')) {
    const m = /^\|\s*(\d+)\s*\|\s*`([a-z0-9-]+)`\s*\|\s*([^|]+?)\s*\|/.exec(ligne);
    if (m) ordre.push({ rang: Number(m[1]), slug: m[2], titre: m[3] });
  }
  return ordre;
}

/** Une section d'un document Markdown, de son titre `#… n.` (ou `n.m`) au titre de même niveau suivant. */
export function sectionMarkdown(texte, numero) {
  const lignes = texte.split('\n');
  const niveau = numero.includes('.') ? '###' : '##';
  const debut = lignes.findIndex((l) => l.startsWith(`${niveau} ${numero}${numero.includes('.') ? '' : '.'} `) || l.startsWith(`${niveau} ${numero} `));
  if (debut < 0) return undefined;
  let fin = lignes.length;
  for (let i = debut + 1; i < lignes.length; i += 1) {
    const l = lignes[i];
    if (l.startsWith('## ') || (niveau === '###' && l.startsWith('### '))) {
      fin = i;
      break;
    }
  }
  return lignes.slice(debut, fin).join('\n').trim();
}

/** Section `### n. Titre` du chantier pour le chapitre de rang n. */
function sectionDuChantier(texte, rang) {
  const lignes = texte.split('\n');
  const debut = lignes.findIndex((l) => l.startsWith(`### ${rang}. `));
  if (debut < 0) return undefined;
  let fin = lignes.findIndex((l, i) => i > debut && (l.startsWith('### ') || l.startsWith('## ')));
  if (fin < 0) fin = lignes.length;
  return lignes.slice(debut, fin).join('\n').trim();
}

/** Plages d'identifiants compactes : bo-m-bernoulli-01…08. */
export function plages(ids) {
  const groupes = new Map();
  for (const id of ids) {
    const m = /^(.*-)(\d+)$/.exec(id);
    const cle = m ? m[1] : id;
    if (!groupes.has(cle)) groupes.set(cle, []);
    groupes.get(cle).push(m ? m[2] : '');
  }
  return [...groupes].map(([cle, nums]) => {
    const tri = nums.filter(Boolean).sort();
    if (tri.length === 0) return cle;
    return tri.length === 1 ? `${cle}${tri[0]}` : `${cle}${tri[0]}…${tri.at(-1)}`;
  });
}

function ligneProgramme(l) {
  const drapeaux = [l.rubrique, l.exigible ? 'exigible' : 'non exigible', l.premiere ? 'première' : undefined].filter(Boolean).join(', ');
  return `- \`${l.id}\` (${drapeaux}) — ${l.texte}`;
}

/**
 * Assemble la fiche. Pure à partir des données lues (testée).
 * donnees : { matiere, slug, programme, annales, chapitres: Map, chantier, referentiel, premiere: [{slug, titre}] }
 */
export function construireFiche({ matiere, slug, role, programme, annales, chapitres, chantier, referentiel, premiere }) {
  const besoins = role ? BESOINS[role] : TOUT;
  const sortie = [];
  const ecrire = (...l) => sortie.push(...l);
  let numero = 0;
  const titre2 = (texte) => `## ${(numero += 1)}. ${texte}`;
  const ordreProp = ordreDuChantier(chantier ?? '');
  const proposition = ordreProp.find((c) => c.slug === slug);
  const chapitre = chapitres.get(slug);
  const ordreChap = chapitre?.meta?.ordre ?? (proposition ? proposition.rang * 10 : undefined);
  const titre = chapitre?.meta?.titre ?? proposition?.titre ?? slug;
  const lignesChap = liste(programme).filter((l) => l.chapitre === slug);

  // Place de chaque chapitre : écrit (ordre de meta.json) ou proposé (rang du chantier × 10).
  const tousSlugs = new Set([...ordreProp.map((c) => c.slug), ...chapitres.keys()]);
  const places = [...tousSlugs].map((s) => {
    const meta = chapitres.get(s)?.meta;
    const prop = ordreProp.find((c) => c.slug === s);
    return {
      slug: s,
      titre: meta?.titre ?? prop?.titre ?? s,
      ordre: meta?.ordre ?? (prop ? prop.rang * 10 : undefined),
      ecrit: Boolean(chapitres.get(s)?.notions),
      transverse: estTransverse(s),
    };
  });
  const anterieur = (p) => !p.transverse && p.slug !== slug && p.ecrit && p.ordre !== undefined && ordreChap !== undefined && p.ordre < ordreChap;

  ecrire(
    `# Fiche de lecture — ${matiere} / ${slug}${role ? ` (rôle : ${role})` : ''}`,
    '',
    `> Produite par \`node scripts/contexte-chapitre.mjs ${matiere} ${slug}${role ? ` --role ${role}` : ''}\`. Elle remplace la lecture`,
    `> complète de \`programme.json\`, \`annales.json\`, du référentiel et des cours antérieurs ;`,
    `> **en cas de doute**, ouvre la source citée (elle fait foi). Pour un bloc \`lien-matiere\`, cherche`,
    `> les lignes de l'autre matière par \`grep\` dans son \`programme.json\`.`,
    '',
    `Chapitre : **${titre}** — ordre ${ordreChap ?? 'inconnu'}${chapitre?.meta ? '' : ' (proposé par le chantier : meta.json pas encore écrit)'}.`,
    `Fichiers déjà écrits : ${chapitre ? ['meta', 'notions', 'cours', 'memo', 'exercices', 'flash', 'type-bac'].filter((f) => chapitre[f] !== undefined).join(', ') || 'aucun' : 'aucun'}.`,
    '',
  );

  if (besoins.programme || besoins.citables) {
    ecrire(titre2('Ordre des chapitres (règle d\'or 5 : jamais un chapitre ultérieur)'), '');
    ecrire('| ordre | chapitre | état | pour ce chapitre |', '|---|---|---|---|');
    for (const p of [...places].sort((a, b) => (a.ordre ?? 1e9) - (b.ordre ?? 1e9))) {
      const statut = p.slug === slug ? '**ce chapitre**' : p.transverse ? 'citable (« Méthodes »)' : anterieur(p) ? 'antérieur : citable' : p.ordre !== undefined && ordreChap !== undefined && p.ordre < ordreChap ? 'antérieur pas encore écrit : non citable' : 'ultérieur : interdit';
      ecrire(`| ${p.ordre ?? '—'} | \`${p.slug}\` ${p.titre} | ${p.ecrit ? 'écrit' : 'à écrire'} | ${statut} |`);
    }
    ecrire('');
  }

  if (besoins.programme) {
    ecrire(titre2(`Lignes du programme du chapitre (${lignesChap.length}, texte exact de \`programme.json\`)`), '');
    let section;
    for (const l of lignesChap) {
      if (l.section !== section) {
        section = l.section;
        ecrire(`**${l.partie ? `${l.partie} — ` : ''}${l.section}**`);
      }
      ecrire(ligneProgramme(l));
    }
    ecrire('');
  }

  if (besoins.citables) {
    const citables = liste(programme).filter((l) => {
      if (l.chapitre === slug) return false;
      if (l.premiere || estTransverse(l.chapitre ?? '')) return true;
      const p = places.find((x) => x.slug === l.chapitre);
      return p ? anterieur(p) : false;
    });
    const interdites = liste(programme).filter((l) => l.chapitre !== slug && !citables.includes(l));
    ecrire(titre2(`Lignes citables hors du chapitre (${citables.length})`), '');
    ecrire('Chapitres antérieurs écrits, chapitre « Méthodes » et acquis de première : un item peut les citer dans `capacites` (charte § 9.1).', '');
    const parChapitre = new Map();
    for (const l of citables) {
      const cle = l.premiere ? 'acquis de première' : l.chapitre;
      if (!parChapitre.has(cle)) parChapitre.set(cle, []);
      parChapitre.get(cle).push(l);
    }
    for (const [cle, lignes] of parChapitre) {
      ecrire(`**${cle}**`, ...lignes.map(ligneProgramme), '');
    }
    if (citables.length === 0) ecrire('(aucune)', '');
    const parChapInterdit = new Map();
    for (const l of interdites) {
      if (!parChapInterdit.has(l.chapitre)) parChapInterdit.set(l.chapitre, []);
      parChapInterdit.get(l.chapitre).push(l.id);
    }
    ecrire(`### Identifiants interdits (${interdites.length} lignes : chapitres ultérieurs ou pas encore écrits)`, '');
    for (const [chap, ids] of parChapInterdit) ecrire(`- \`${chap}\` : ${plages(ids).map((p) => `\`${p}\``).join(', ')}`);
    ecrire('');
  }

  if (besoins.annales) {
    ecrire(titre2('Ce que le bac demande sur ces lignes (`annales.json`)'), '');
    if (!annales) ecrire(`Pas d'index des annales pour ${matiere} : \`attendusBac\` reste vide, priorités estimées.`, '');
    else {
      const ids = new Set(lignesChap.map((l) => l.id));
      const touches = [];
      for (const sujet of liste(annales.sujets)) {
        for (const ex of liste(sujet.exercices)) {
          const communs = liste(ex.capacites).filter((c) => ids.has(c));
          if (communs.length > 0) touches.push({ sujet, ex, communs });
        }
      }
      ecrire(`Index ${annales.complet ? 'complet' : 'INCOMPLET (aucun chiffre de fréquence)'} depuis ${annales.depuis ?? '?'} : ${liste(annales.sujets).length} sujets, dont ${new Set(touches.map((t) => t.sujet.id)).size} touchent ce chapitre (${touches.length} exercices). Les chiffres de fréquence viennent de \`scripts/frequences-annales.mjs\`, jamais de cette liste.`, '');
      for (const { sujet, ex, communs } of touches) {
        ecrire(`- \`${sujet.id}\` ex. ${ex.numero}${ex.points ? ` (${ex.points} pts)` : ''} « ${ex.titre ?? ''} » — lignes : ${communs.join(', ')}`);
        for (const f of liste(ex.formulations)) ecrire(`  - « ${f} »`);
      }
      ecrire('');
    }
  }

  if (besoins.index) {
    const anterieurs = places.filter((p) => anterieur(p) || (p.transverse && p.ecrit && p.slug !== slug)).sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));
    ecrire(titre2(`Index des chapitres antérieurs (${anterieurs.length})`), '');
    ecrire('Pour ne pas redire, pour les prérequis (`n-…`) et pour les renvois (`l-…`). Le texte des blocs est dans leur `cours.json` : ne l\'ouvre que pour un bloc précis.', '');
    for (const p of anterieurs) {
      const c = chapitres.get(p.slug);
      ecrire(`### \`${p.slug}\` — ${p.titre} (ordre ${p.ordre})`);
      const sections = new Map(liste(c.cours?.sections).map((s) => [s.notion, s]));
      for (const n of [...liste(c.notions)].sort((a, b) => a.ordre - b.ordre)) {
        ecrire(`- **\`${n.id}\`** ${n.titre} (priorité ${n.priorite}) — ${n.resume ?? ''}`);
        const blocs = liste(sections.get(n.id)?.blocs).filter((b) => b.type !== 'idee');
        if (blocs.length > 0) ecrire(`  - blocs : ${blocs.map((b) => `\`${b.id}\` ${b.type}${b.titre ? ` « ${b.titre} »` : ''}`).join(' ; ')}`);
      }
      const memo = liste(c.memo);
      if (memo.length > 0) ecrire(`- mémo : ${memo.map((m) => `\`${m.id}\`${m.motCle ? ` (${m.motCle})` : ''}`).join(', ')}`);
      ecrire('');
    }
    if (anterieurs.length === 0) ecrire('(aucun chapitre antérieur écrit)', '');
  }

  if (besoins.premiere && premiere.length > 0) {
    ecrire(titre2('Chapitres de maths de première (prérequis `1e:<slug>`)'), '');
    ecrire(premiere.map((c) => `\`1e:${c.slug}\` ${c.titre}`).join(' · '), '');
  }

  const sectionsRef = besoins.referentiel.map((n) => [n, sectionMarkdown(referentiel ?? '', n)]).filter(([, t]) => t);
  if (sectionsRef.length > 0) {
    ecrire(titre2(`Référentiel (\`.claude/skills/bac-${matiere}-terminale-2027/SKILL.md\`) : sections utiles`), '');
    for (const [, texte] of sectionsRef) ecrire(texte.replace(/^(#+) /gm, '$1# '), '');
  }

  if (chantier) {
    const extraits = [];
    const lignes = chantier.split('\n');
    const titreSection = (prefixe) => {
      const debut = lignes.findIndex((l) => l.startsWith(`## ${prefixe}`));
      if (debut < 0) return undefined;
      let fin = lignes.findIndex((l, i) => i > debut && l.startsWith('## '));
      if (fin < 0) fin = lignes.length;
      return lignes.slice(debut, fin).join('\n').trim();
    };
    if (role !== 'eleve-testeur') {
      const p = titreSection('Particularités');
      if (p) extraits.push(p);
    }
    if (besoins.chantier && proposition) {
      const s = sectionDuChantier(chantier, proposition.rang);
      if (s) extraits.push(s);
    }
    if (besoins.liensMaths) {
      const s = titreSection('Liens avec les maths');
      if (s) extraits.push(s);
    }
    if (extraits.length > 0) {
      ecrire(titre2(`Chantier (\`chantiers/terminale/chapitres-${matiere}.md\`) : extraits`), '');
      for (const e of extraits) ecrire(e.replace(/^(#+) /gm, '$1# '), '');
    }
  }
  return `${sortie.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

function lireTexte(chemin) {
  return existsSync(chemin) ? readFileSync(chemin, 'utf8') : undefined;
}

export function chapitresDePremiereTitres() {
  const dossier = join(RACINE_DEPOT, 'content', 'chapters');
  if (!existsSync(dossier)) return [];
  return readdirSync(dossier)
    .map((slug) => {
      const meta = JSON.parse(lireTexte(join(dossier, slug, 'meta.json')) ?? '{}');
      return { slug, titre: meta.title ?? slug, ordre: meta.order ?? 0 };
    })
    .sort((a, b) => a.ordre - b.ordre);
}

export function ficheDuChapitre({ racine, matiere, slug, role }) {
  const d = lireMatiere(racine, matiere);
  return construireFiche({
    matiere,
    slug,
    role,
    programme: d.programme,
    annales: d.annales,
    chapitres: d.chapitres,
    chantier: lireTexte(join(RACINE_DEPOT, 'chantiers', 'terminale', `chapitres-${matiere}.md`)),
    referentiel: lireTexte(join(RACINE_DEPOT, '.claude', 'skills', `bac-${matiere}-terminale-2027`, 'SKILL.md')),
    premiere: chapitresDePremiereTitres(),
  });
}

const estLeScript = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (estLeScript) {
  const argv = process.argv.slice(2);
  const positionnels = [];
  let racine = join(RACINE_DEPOT, 'content', 'terminale');
  let sortie;
  let role;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--racine') racine = resolve(argv[++i] ?? '');
    else if (argv[i] === '--sortie') sortie = resolve(argv[++i] ?? '');
    else if (argv[i] === '--role') role = argv[++i];
    else positionnels.push(argv[i]);
  }
  const [matiere, slug] = positionnels;
  if (!MATIERES.includes(matiere) || !slug || (role !== undefined && !ROLES.includes(role))) {
    console.error(`Usage : node scripts/contexte-chapitre.mjs <maths|physique-chimie> <chapitre> [--role ${ROLES.join('|')}] [--racine <dossier>] [--sortie <fichier>]`);
    process.exit(2);
  }
  const d = lireMatiere(racine, matiere);
  if (!liste(d.programme).some((l) => l.chapitre === slug)) {
    console.error(`Aucune ligne du programme pour ${matiere}/${slug} (${relative(RACINE_DEPOT, join(racine, matiere, 'programme.json'))}).`);
    process.exit(2);
  }
  const fiche = ficheDuChapitre({ racine, matiere, slug, role });
  if (sortie) {
    writeFileSync(sortie, fiche);
    console.error(`Fiche écrite : ${sortie} (${fiche.length} caractères ≈ ${Math.round(fiche.length / 3.3 / 1000)} k tokens)`);
  } else process.stdout.write(fiche);
}
