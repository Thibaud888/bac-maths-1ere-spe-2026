#!/usr/bin/env node
// Liste les sujets de bac de maths (spécialité, terminale) publiés par l'APMEP, année par
// année, et télécharge leur source LaTeX (le texte du sujet, jamais le corrigé) pour
// l'indexation des annales (agent annales-indexeur, charte terminale § 3.2).
//
// Usage :
//   node scripts/annales-apmep.mjs 2021 2022 … [--sortie <dossier>] [--json]
//
// Pour chaque année : la page https://www.apmep.fr/Annee-<année> est un tableau dont chaque
// ligne porte le lieu et la date, puis sujet (PDF), corrigé (PDF), sujet (LaTeX), corrigé
// (LaTeX). Le script garde la première colonne, le PDF du sujet et la source LaTeX du
// sujet ; il écarte les corrigés et les recueils de l'année (« Année 2024 … »). Avec
// --sortie, chaque source est enregistrée dans <dossier>/<année>/<fichier>.tex, avec à côté
// <fichier>.txt : le corps du sujet seul (sans préambule ni dessins pstricks/TikZ), plus
// court à lire pour l'indexation ; la liste va dans <dossier>/sujets.json.
import { mkdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const BASE = "https://www.apmep.fr/";

const args = process.argv.slice(2);
const sortie = args.includes("--sortie") ? args[args.indexOf("--sortie") + 1] : undefined;
const json = args.includes("--json");
const annees = args.filter((a) => /^20\d\d$/.test(a)).map(Number);
if (annees.length === 0) {
  console.error("Usage : node scripts/annales-apmep.mjs <année>… [--sortie <dossier>] [--json]");
  process.exit(2);
}

function texte(fragment) {
  return fragment
    .replace(/<br[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function liens(fragment) {
  return [...fragment.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
}

const estCorrige = (lien) => /corr/i.test(basename(lien));

/** Recueil de toute une année : il redit les sujets de la page, on l'écarte. */
const estRecueil = (libelle) => /^Ann[ée]e \d{4}/i.test(libelle);

/** Le corps d'un sujet : sans préambule ni code de dessin (pstricks, TikZ). */
function corps(source) {
  const debut = source.indexOf("\\begin{document}");
  let texte = debut >= 0 ? source.slice(debut + "\\begin{document}".length) : source;
  const fin = texte.indexOf("\\end{document}");
  if (fin >= 0) texte = texte.slice(0, fin);
  for (const env of ["pspicture\\*?", "tikzpicture", "psmatrix"]) {
    texte = texte.replace(new RegExp(`\\\\begin\\{${env}\\}[\\s\\S]*?\\\\end\\{${env}\\}`, "g"), "[figure]");
  }
  return texte
    .split("\n")
    .filter((l) => !/^\s*%/.test(l))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

/** Les lignes du tableau d'une page annuelle : lieu, sujet PDF, sujet LaTeX. */
function lignes(page, annee) {
  const sujets = [];
  for (const ligne of page.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
    const cellules = [...ligne[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => m[1]);
    if (cellules.length < 2) continue;
    const libelle = texte(cellules[0]);
    const tous = cellules.slice(1).flatMap(liens);
    const pdf = tous.find((l) => l.endsWith(".pdf") && !estCorrige(l));
    const tex = tous.find((l) => l.endsWith(".tex") && !estCorrige(l));
    if ((!pdf && !tex) || estRecueil(libelle)) continue;
    sujets.push({
      annee,
      libelle,
      pdf: pdf ? new URL(pdf, BASE).href : null,
      tex: tex ? new URL(tex, BASE).href : null,
    });
  }
  return sujets;
}

async function lire(url) {
  const reponse = await fetch(url);
  if (!reponse.ok) throw new Error(`${url} : ${reponse.status}`);
  return reponse.text();
}

const tout = [];
for (const annee of annees) {
  const page = await lire(`${BASE}Annee-${annee}`);
  const sujets = lignes(page, annee);
  for (const sujet of sujets) {
    if (sortie && sujet.tex) {
      const dossier = join(sortie, String(annee));
      mkdirSync(dossier, { recursive: true });
      const fichier = join(dossier, basename(sujet.tex));
      const source = await lire(sujet.tex);
      writeFileSync(fichier, source);
      writeFileSync(fichier.replace(/\.tex$/, ".txt"), corps(source));
      sujet.fichier = fichier.replace(/\.tex$/, ".txt");
    }
  }
  tout.push(...sujets);
  if (!json) {
    console.log(`\n${annee} : ${sujets.length} sujets`);
    for (const s of sujets) console.log(`- ${s.libelle} | ${s.pdf ?? "(pas de PDF)"}${s.tex ? "" : " | pas de LaTeX"}`);
  }
}
if (sortie) writeFileSync(join(sortie, "sujets.json"), JSON.stringify(tout, null, 2) + "\n");
if (json) console.log(JSON.stringify(tout, null, 2));
