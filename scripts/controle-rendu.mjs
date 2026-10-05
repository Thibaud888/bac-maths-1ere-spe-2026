#!/usr/bin/env node
/**
 * Contrôle du rendu d'un chapitre de terminale dans un vrai navigateur (charte § 12, étape 8) :
 * la session qui coordonne lance ce script au lieu de regarder vingt captures.
 *
 * Usage : node scripts/controle-rendu.mjs <matiere> <chapitre> [--partie cours|exercices]
 *           [--sortie <dossier>] [--url <adresse d'un serveur déjà lancé>] [--temoin] [--liste]
 *
 * Pages : Aperçu, chaque notion du cours, Mémo ; avec la partie « exercices » (par défaut),
 * la liste des exercices, les questions éclair, le premier exercice de chaque marche, la liste
 * type bac et le premier type bac. Chaque page est ouverte en thème clair et sombre, à 1280 px
 * et à 390 px, après avoir tout dévoilé (étapes, démonstrations, indices, solutions).
 *
 * Écarts (code de sortie 1) : défilement horizontal de la page, formule que KaTeX n'a pas su
 * compiler (`.katex-error`), erreur de console, ressource introuvable, exception de la page,
 * page vide. Les avertissements de React (« Warning: … ») sont listés à part : ce sont des
 * défauts d'interface, à noter au backlog, pas à corriger dans une session de chapitre.
 * Toutes les captures sont écrites dans --sortie (dossier temporaire par défaut) ; le script
 * en désigne QUATRE à regarder.
 *
 * Sans --url, il lance lui-même le serveur de développement (Vite, port libre) et l'arrête à
 * la fin ; --temoin le lance avec le chapitre-témoin (VITE_TEMOIN=1, racine tests/fixtures).
 * Navigateur : /opt/pw-browsers/chromium s'il existe (sessions cloud), sinon celui de
 * Playwright ; variable CHROMIUM_PATH pour en imposer un autre. --liste écrit seulement, en
 * JSON, les pages prévues et les quatre captures choisies (sans navigateur).
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MATIERES, RACINE_DEPOT, lireMatiere } from './lib/terminale.mjs';

const LARGEURS = [1280, 390];
const THEMES = ['light', 'dark'];
const BOUTONS_A_DEVOILER =
  /^(Tout afficher|Voir la (première étape|démonstration|solution|correction|réponse)|Un indice|Indice suivant|Étape suivante)/;

/** Adresse du chapitre dans le site (charte § 11 ; « Méthodes » a son adresse propre). */
export function cheminChapitre(matiere, meta) {
  return meta?.transverse ? `/terminale/${matiere}/methodes` : `/terminale/${matiere}/${meta?.slug}`;
}

/** Fin d'un identifiant après son préfixe (`n-<chapitre>-`, `x-<chapitre>-`, `tb-<chapitre>-`). */
function segment(id, prefixe) {
  return id.startsWith(prefixe) ? id.slice(prefixe.length) : id;
}

/**
 * Pages à contrôler pour un chapitre : [{ nom, chemin }]. Pure (testée).
 * `partie` : 'cours' (Aperçu, notions, Mémo) ou 'exercices' (tout).
 */
export function pagesDuChapitre(matiere, chapitre, partie = 'exercices') {
  const slug = chapitre.slug ?? chapitre.meta?.slug;
  const base = cheminChapitre(matiere, { ...chapitre.meta, slug });
  const pages = [{ nom: 'apercu', chemin: base }];
  for (const notion of chapitre.notions ?? []) {
    const fin = segment(notion.id, `n-${slug}-`);
    pages.push({ nom: `cours-${fin}`, chemin: `${base}/cours/${fin}` });
  }
  pages.push({ nom: 'memo', chemin: `${base}/memo` });
  if (partie === 'cours') return pages;
  pages.push({ nom: 'exercices', chemin: `${base}/exercices` });
  if ((chapitre.flash ?? []).length > 0) pages.push({ nom: 'eclair', chemin: `${base}/exercices/eclair` });
  const exercices = [...(chapitre.exercices ?? [])].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));
  for (const niveau of [1, 2, 3]) {
    const premier = exercices.find((x) => x.niveau === niveau);
    if (premier) pages.push({ nom: `marche-${niveau}`, chemin: `${base}/exercices/${segment(premier.id, `x-${slug}-`)}` });
  }
  const typeBac = [...(chapitre['type-bac'] ?? [])].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));
  if (typeBac.length > 0 && !chapitre.meta?.transverse) {
    pages.push({ nom: 'type-bac', chemin: `${base}/type-bac` });
    pages.push({ nom: 'type-bac-1', chemin: `${base}/type-bac/${segment(typeBac[0].id, `tb-${slug}-`)}` });
  }
  return pages;
}

/**
 * Les quatre captures à regarder : la première notion du cours (grand écran, clair ; petit
 * écran, sombre), puis le premier exercice de marche 1 (petit, clair) et le premier type bac
 * (grand, sombre) — ou, pour la partie cours, la dernière notion et le mémo.
 */
export function capturesARegarder(pages) {
  const noms = new Set(pages.map((p) => p.nom));
  const cours = pages.filter((p) => p.nom.startsWith('cours-'));
  const premiere = cours[0]?.nom ?? 'apercu';
  const choix = [
    [premiere, 'light', 1280],
    [premiere, 'dark', 390],
    noms.has('marche-1') ? ['marche-1', 'light', 390] : [cours.at(-1)?.nom ?? 'apercu', 'light', 390],
    noms.has('type-bac-1') ? ['type-bac-1', 'dark', 1280] : noms.has('marche-2') ? ['marche-2', 'dark', 1280] : ['memo', 'dark', 1280],
  ];
  return choix.map(([nom, theme, largeur]) => nomCapture(nom, theme, largeur));
}

export function nomCapture(nom, theme, largeur) {
  return `${nom}-${theme === 'dark' ? 'sombre' : 'clair'}-${largeur}.png`;
}

function portLibre() {
  return new Promise((ok, ko) => {
    const serveur = createServer();
    serveur.unref();
    serveur.on('error', ko);
    serveur.listen(0, () => {
      const { port } = serveur.address();
      serveur.close(() => ok(port));
    });
  });
}

async function attendreServeur(url, delaiMs = 60_000) {
  const fin = Date.now() + delaiMs;
  while (Date.now() < fin) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* pas encore prêt */
    }
    await new Promise((ok) => setTimeout(ok, 300));
  }
  throw new Error(`Le serveur ne répond pas : ${url}`);
}

async function lancerServeur(temoin) {
  const port = await portLibre();
  const vite = join(RACINE_DEPOT, 'node_modules', 'vite', 'bin', 'vite.js');
  const env = { ...process.env, VITE_BASE_URL: '/' };
  if (temoin) env.VITE_TEMOIN = '1';
  const processus = spawn(process.execPath, [vite, '--port', String(port), '--strictPort'], {
    cwd: RACINE_DEPOT,
    env,
    stdio: 'ignore',
  });
  const url = `http://localhost:${port}`;
  await attendreServeur(url);
  return { url, arreter: () => processus.kill() };
}

/** Dévoile tout ce qui est replié (étapes, démonstrations, indices, solutions). */
async function toutDevoiler(page) {
  await page.evaluate(() => {
    for (const d of document.querySelectorAll('details')) d.open = true;
  });
  for (let tour = 0; tour < 8; tour += 1) {
    const clics = await page.evaluate((source) => {
      const motif = new RegExp(source);
      let n = 0;
      for (const b of document.querySelectorAll('button')) {
        if (b.disabled || b.offsetParent === null || !motif.test((b.textContent ?? '').trim())) continue;
        b.click();
        n += 1;
      }
      return n;
    }, BOUTONS_A_DEVOILER.source);
    if (clics === 0) return;
    await page.waitForTimeout(50);
  }
}

/** Mesures dans la page : défilement horizontal (et ses coupables), formules en erreur, contenu. */
function mesurer() {
  const largeur = document.documentElement.clientWidth;
  const deborde = document.documentElement.scrollWidth > largeur + 1;
  const coupables = [];
  if (deborde) {
    const dansUnCadre = (el) => {
      for (let p = el.parentElement; p; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') return true;
      }
      return false;
    };
    for (const el of document.body.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.right <= largeur + 1 || dansUnCadre(el)) continue;
      const parentDeborde = el.parentElement && el.parentElement.getBoundingClientRect().right > largeur + 1 && !dansUnCadre(el.parentElement);
      if (parentDeborde && el.parentElement !== document.body) continue;
      const classe = typeof el.className === 'string' ? el.className.split(/\s+/).slice(0, 3).join('.') : '';
      coupables.push(`<${el.tagName.toLowerCase()}${classe ? `.${classe}` : ''}> ${Math.round(r.right)} px « ${(el.textContent ?? '').trim().slice(0, 60)} »`);
      if (coupables.length >= 3) break;
    }
  }
  const katex = [...document.querySelectorAll('.katex-error')].map(
    (e) => `${(e.getAttribute('title') ?? 'erreur KaTeX').slice(0, 120)} — « ${(e.textContent ?? '').slice(0, 60)} »`,
  );
  const texte = (document.querySelector('main')?.textContent ?? '').trim().length;
  return { deborde, largeurPage: document.documentElement.scrollWidth, coupables, katex, texte };
}

/** Regroupe un signalement par message : la liste des pages où il apparaît. */
function noter(signalements, message, ici) {
  if (!signalements.has(message)) signalements.set(message, new Set());
  signalements.get(message).add(ici.split(' · ')[0]);
}

/** Contrôle toutes les pages ; renvoie { ecarts, captures, nbCaptures }. */
export async function controlerRendu({ url, pages, sortie }) {
  const { chromium } = await import('@playwright/test');
  const executablePath = process.env.CHROMIUM_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
  const navigateur = await chromium.launch({ executablePath });
  const ecarts = [];
  const signalements = new Map();
  let nbCaptures = 0;
  try {
    // Premier chargement à blanc : Vite prépare ses dépendances et peut recharger la page.
    const chauffe = await navigateur.newPage();
    await chauffe.goto(`${url}${pages[0]?.chemin ?? '/'}`, { waitUntil: 'networkidle' });
    await chauffe.waitForTimeout(500);
    await chauffe.close();
    for (const theme of THEMES) {
      for (const largeur of LARGEURS) {
        const contexte = await navigateur.newContext({ viewport: { width: largeur, height: 900 } });
        await contexte.addInitScript((t) => {
          try {
            const brut = localStorage.getItem('bms-2026-app');
            const etat = brut ? JSON.parse(brut) : { state: {}, version: 0 };
            etat.state = { ...etat.state, theme: t };
            localStorage.setItem('bms-2026-app', JSON.stringify(etat));
          } catch {
            /* stockage indisponible : thème par défaut */
          }
        }, theme);
        const page = await contexte.newPage();
        let erreurs = [];
        let avertissements = [];
        page.on('console', (m) => {
          if (m.type() !== 'error') return;
          const texte = m.text();
          // Les « Warning: » de React (mode développement) sont des défauts d'interface, pas de contenu.
          if (texte.startsWith('Warning:')) avertissements.push(`React : ${texte.split('\n')[0].slice(0, 160)}`);
          else if (!texte.startsWith('Failed to load resource')) erreurs.push(`console : ${texte.slice(0, 200)}`);
        });
        page.on('response', (r) => {
          if (r.status() >= 400) erreurs.push(`ressource ${r.status()} : ${new URL(r.url()).pathname}`);
        });
        page.on('pageerror', (e) => erreurs.push(`exception : ${String(e.message).slice(0, 200)}`));
        for (const { nom, chemin } of pages) {
          erreurs = [];
          avertissements = [];
          const ici = `${nom} · ${theme === 'dark' ? 'sombre' : 'clair'} · ${largeur} px`;
          await page.goto(`${url}${chemin}`, { waitUntil: 'networkidle' });
          if (new URL(page.url()).pathname !== chemin) {
            ecarts.push(`${ici} : redirigé vers ${new URL(page.url()).pathname} (page introuvable ?)`);
          }
          await toutDevoiler(page);
          await page.waitForTimeout(150);
          const m = await page.evaluate(mesurer);
          if (m.deborde) ecarts.push(`${ici} : défilement horizontal (page de ${m.largeurPage} px) ${m.coupables.join(' ; ')}`);
          for (const k of m.katex) ecarts.push(`${ici} : KaTeX ${k}`);
          if (m.texte < 20) ecarts.push(`${ici} : page vide`);
          for (const e of new Set(erreurs)) ecarts.push(`${ici} : ${e}`);
          for (const a of new Set(avertissements)) noter(signalements, a, ici);
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.screenshot({ path: join(sortie, nomCapture(nom, theme, largeur)) });
          nbCaptures += 1;
        }
        await contexte.close();
      }
    }
  } finally {
    await navigateur.close();
  }
  const interface_ = [...signalements].map(([message, ou]) => `${message} — ${[...ou].join(', ')}`);
  return { ecarts, interface: interface_, nbCaptures, captures: capturesARegarder(pages).map((n) => join(sortie, n)) };
}

const estLeScript = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (estLeScript) {
  const argv = process.argv.slice(2);
  const positionnels = [];
  let partie = 'exercices';
  let sortie;
  let url;
  let temoin = false;
  let liste = false;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--partie') partie = argv[++i] ?? '';
    else if (argv[i] === '--sortie') sortie = resolve(argv[++i] ?? '');
    else if (argv[i] === '--url') url = (argv[++i] ?? '').replace(/\/$/, '');
    else if (argv[i] === '--temoin') temoin = true;
    else if (argv[i] === '--liste') liste = true;
    else positionnels.push(argv[i]);
  }
  const [matiere, slug] = positionnels;
  if (!MATIERES.includes(matiere) || !slug || !['cours', 'exercices'].includes(partie)) {
    console.error(
      'Usage : node scripts/controle-rendu.mjs <maths|physique-chimie> <chapitre> [--partie cours|exercices] [--sortie <dossier>] [--url <adresse>] [--temoin] [--liste]',
    );
    process.exit(2);
  }
  const racine = temoin ? join(RACINE_DEPOT, 'tests', 'fixtures', 'terminale') : join(RACINE_DEPOT, 'content', 'terminale');
  const chapitre = lireMatiere(racine, matiere).chapitres.get(slug);
  if (!chapitre) {
    console.error(`Chapitre introuvable : ${matiere}/${slug}`);
    process.exit(2);
  }
  if (liste) {
    const pagesSeules = pagesDuChapitre(matiere, chapitre, partie);
    console.log(JSON.stringify({ pages: pagesSeules, captures: capturesARegarder(pagesSeules) }, null, 2));
    process.exit(0);
  }
  sortie ??= mkdtempSync(join(tmpdir(), `rendu-${slug}-`));
  mkdirSync(sortie, { recursive: true });
  const pages = pagesDuChapitre(matiere, chapitre, partie);
  const serveur = url ? { url, arreter: () => undefined } : await lancerServeur(temoin);
  try {
    const { ecarts, interface: defautsInterface, nbCaptures, captures } = await controlerRendu({ url: serveur.url, pages, sortie });
    console.log(`Rendu de ${matiere}/${slug} (partie ${partie}) : ${pages.length} pages × 2 thèmes × 2 largeurs = ${nbCaptures} captures dans ${sortie}`);
    if (ecarts.length === 0) console.log('Aucun écart : ni défilement horizontal, ni erreur KaTeX, ni erreur de console.');
    else {
      console.log(`${ecarts.length} écart(s) :`);
      for (const e of ecarts) console.log(`  - ${e}`);
    }
    if (defautsInterface.length > 0) {
      console.log(`Défauts d'interface (non bloquants pour le contenu : à noter au backlog, jamais corrigés dans une session de chapitre) :`);
      for (const d of defautsInterface) console.log(`  - ${d}`);
    }
    console.log('Captures à regarder (4) :');
    for (const c of captures) console.log(`  ${c}`);
    process.exitCode = ecarts.length === 0 ? 0 : 1;
  } finally {
    serveur.arreter();
  }
}
