#!/usr/bin/env node
/**
 * Valide tous les fichiers JSON de `content/chapters/*` contre les schémas Ajv,
 * ainsi que `content/bac-blanc/`, `content/bac/`, `content/terminale/grand-oral/` et les
 * chapitres de terminale (`content/terminale/<matiere>/`, schémas `schemas/terminale/`),
 * dont le texte exact des programmes officiels (`scripts/programme-conforme.mjs`).
 * Usage : node scripts/validate-content.mjs
 * Exit 0 si tout est valide, 1 sinon.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import {
  compilerSchemas,
  controlerIntegrite,
  lireRacine,
  validerSchemas,
} from './lib/terminale.mjs';
import { matieresAvecProgramme, verifierProgramme } from './programme-conforme.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const ajv = new Ajv({ allErrors: true, strict: false });

function readSchema(relativePath) {
  return JSON.parse(readFileSync(join(root, 'schemas', relativePath), 'utf8'));
}

const figureSchema = JSON.parse(
  readFileSync(join(root, 'schemas', 'figure.schema.json'), 'utf8')
);
ajv.addSchema(figureSchema, 'figure.schema.json');

const schemaFiles = {
  formulas: 'formula.schema.json',
  automatisms: 'automatism.schema.json',
  classics: 'classic-exercise.schema.json',
  'exam-style': 'exam-exercise.schema.json',
};

const validators = {};
for (const [key, file] of Object.entries(schemaFiles)) {
  const schema = JSON.parse(readFileSync(join(root, 'schemas', file), 'utf8'));
  validators[key] = ajv.compile(schema);
}

const chaptersDir = join(root, 'content', 'chapters');
let total = 0;
let invalid = 0;
const problems = [];

if (!safeStat(chaptersDir)) {
  console.error(`Aucun dossier ${chaptersDir} — rien à valider.`);
  process.exit(0);
}

for (const slug of readdirSync(chaptersDir)) {
  const chapDir = join(chaptersDir, slug);
  if (!statSync(chapDir).isDirectory()) continue;

  for (const [type, validate] of Object.entries(validators)) {
    const filePath = join(chapDir, `${type}.json`);
    if (!safeStat(filePath)) continue;
    let data;
    try {
      data = JSON.parse(readFileSync(filePath, 'utf8'));
    } catch (err) {
      invalid += 1;
      problems.push({
        file: filePath,
        message: `JSON invalide : ${err.message}`,
      });
      continue;
    }
    if (!Array.isArray(data)) {
      invalid += 1;
      problems.push({
        file: filePath,
        message: `Le fichier doit contenir un tableau (reçu ${typeof data}).`,
      });
      continue;
    }
    data.forEach((item, idx) => {
      total += 1;
      const ok = validate(item);
      if (!ok) {
        invalid += 1;
        const id = item?.id ?? `<sans id, index ${idx}>`;
        problems.push({
          file: filePath,
          message: `[${id}] ${(validate.errors ?? [])
            .map((e) => `${e.instancePath || '<root>'} ${e.message ?? '?'}`)
            .join(' ; ')}`,
        });
      }
    });
  }
}

// --- Bac blanc ---
const bacBlancDir = join(root, 'content', 'bac-blanc');
const paperSchema = JSON.parse(
  readFileSync(join(root, 'schemas', 'bac-blanc-paper.schema.json'), 'utf8')
);
const paperValidator = ajv.compile(paperSchema);
const bacBlancValidators = {
  papers: paperValidator,
  automatisms: validators.automatisms,
  'exam-style': validators['exam-style'],
};
if (safeStat(bacBlancDir)) {
  for (const [type, validate] of Object.entries(bacBlancValidators)) {
    const filePath = join(bacBlancDir, `${type}.json`);
    if (!safeStat(filePath)) continue;
    let data;
    try {
      data = JSON.parse(readFileSync(filePath, 'utf8'));
    } catch (err) {
      invalid += 1;
      problems.push({
        file: filePath,
        message: `JSON invalide : ${err.message}`,
      });
      continue;
    }
    if (!Array.isArray(data)) {
      invalid += 1;
      problems.push({
        file: filePath,
        message: `Le fichier doit contenir un tableau (reçu ${typeof data}).`,
      });
      continue;
    }
    data.forEach((item, idx) => {
      total += 1;
      const ok = validate(item);
      if (!ok) {
        invalid += 1;
        const id = item?.id ?? `<sans id, index ${idx}>`;
        problems.push({
          file: filePath,
          message: `[${id}] ${(validate.errors ?? [])
            .map((e) => `${e.instancePath || '<root>'} ${e.message ?? '?'}`)
            .join(' ; ')}`,
        });
      }
    });
  }
}

// --- Le bac, mode d'emploi ---
const bacDir = join(root, 'content', 'bac');
const bacValidators = {
  sources: ajv.compile(readSchema(join('bac', 'source.schema.json'))),
  coefficients: ajv.compile(readSchema(join('bac', 'coefficient.schema.json'))),
  epreuves: ajv.compile(readSchema(join('bac', 'epreuve.schema.json'))),
  calendrier: ajv.compile(readSchema(join('bac', 'jalon.schema.json'))),
  mentions: ajv.compile(readSchema(join('bac', 'mention.schema.json'))),
};
const bacData = {};
if (safeStat(bacDir)) {
  for (const [type, validate] of Object.entries(bacValidators)) {
    const filePath = join(bacDir, `${type}.json`);
    if (!safeStat(filePath)) continue;
    let data;
    try {
      data = JSON.parse(readFileSync(filePath, 'utf8'));
    } catch (err) {
      invalid += 1;
      problems.push({ file: filePath, message: `JSON invalide : ${err.message}` });
      continue;
    }
    if (!Array.isArray(data)) {
      invalid += 1;
      problems.push({
        file: filePath,
        message: `Le fichier doit contenir un tableau (reçu ${typeof data}).`,
      });
      continue;
    }
    bacData[type] = data;
    data.forEach((item, idx) => {
      total += 1;
      if (validate(item)) return;
      invalid += 1;
      const id = item?.id ?? `<sans id, index ${idx}>`;
      problems.push({
        file: filePath,
        message: `[${id}] ${(validate.errors ?? [])
          .map((e) => `${e.instancePath || '<root>'} ${e.message ?? '?'}`)
          .join(' ; ')}`,
      });
    });
  }

  // Intégrité entre fichiers : aucune source ni aucun coefficient fantôme.
  const sourceIds = new Set((bacData.sources ?? []).map((s) => s.id));
  const coefficientIds = new Set((bacData.coefficients ?? []).map((c) => c.id));
  for (const [type, data] of Object.entries(bacData)) {
    if (type === 'sources') continue;
    for (const item of data) {
      for (const sourceId of item.sources ?? []) {
        if (sourceIds.has(sourceId)) continue;
        invalid += 1;
        problems.push({
          file: join(bacDir, `${type}.json`),
          message: `[${item.id}] source inconnue : ${sourceId}`,
        });
      }
      if (item.coefficientId && !coefficientIds.has(item.coefficientId)) {
        invalid += 1;
        problems.push({
          file: join(bacDir, `${type}.json`),
          message: `[${item.id}] coefficient inconnu : ${item.coefficientId}`,
        });
      }
    }
  }
}

// --- Grand oral (terminale) ---
// Les sources citées sont celles de content/bac/sources.json : un seul registre.
const grandOralDir = join(root, 'content', 'terminale', 'grand-oral');
const ficheGo = ajv.compile(readSchema(join('grand-oral', 'fiche.schema.json')));
const grandOralFiles = {
  deroule: { validate: ajv.compile(readSchema(join('grand-oral', 'temps.schema.json'))) },
  epreuve: { validate: ficheGo, section: 'epreuve' },
  preparation: { validate: ficheGo, section: 'preparation' },
  expose: { validate: ficheGo, section: 'expose' },
  entretien: { validate: ficheGo, section: 'entretien' },
  criteres: { validate: ajv.compile(readSchema(join('grand-oral', 'critere.schema.json'))) },
  relances: { validate: ajv.compile(readSchema(join('grand-oral', 'relance.schema.json'))) },
};
if (safeStat(grandOralDir)) {
  const bacSourceIds = new Set(
    JSON.parse(readFileSync(join(root, 'content', 'bac', 'sources.json'), 'utf8')).map(
      (s) => s.id
    )
  );
  const seenIds = new Set();
  for (const [type, { validate, section }] of Object.entries(grandOralFiles)) {
    const filePath = join(grandOralDir, `${type}.json`);
    if (!safeStat(filePath)) {
      invalid += 1;
      problems.push({ file: filePath, message: 'Fichier manquant.' });
      continue;
    }
    let data;
    try {
      data = JSON.parse(readFileSync(filePath, 'utf8'));
    } catch (err) {
      invalid += 1;
      problems.push({ file: filePath, message: `JSON invalide : ${err.message}` });
      continue;
    }
    if (!Array.isArray(data)) {
      invalid += 1;
      problems.push({
        file: filePath,
        message: `Le fichier doit contenir un tableau (reçu ${typeof data}).`,
      });
      continue;
    }
    data.forEach((item, idx) => {
      total += 1;
      const id = item?.id ?? `<sans id, index ${idx}>`;
      const errors = [];
      if (!validate(item)) {
        errors.push(
          ...(validate.errors ?? []).map(
            (e) => `${e.instancePath || '<root>'} ${e.message ?? '?'}`
          )
        );
      }
      if (seenIds.has(id)) errors.push(`identifiant en double : ${id}`);
      seenIds.add(id);
      if (section && item?.section !== section) {
        errors.push(`section « ${item?.section} » dans ${type}.json`);
      }
      for (const sourceId of item?.sources ?? []) {
        if (!bacSourceIds.has(sourceId)) errors.push(`source inconnue : ${sourceId}`);
      }
      if (errors.length === 0) return;
      invalid += 1;
      problems.push({ file: filePath, message: `[${id}] ${errors.join(' ; ')}` });
    });
  }
}

// --- Chapitres de terminale (maths, physique-chimie) ---
// Schémas propres (schemas/terminale/, instance Ajv à part : l'identifiant
// figure.schema.json est déjà pris par la première) puis intégrité : renvois,
// doublons, totaux de points. La couverture du programme, elle, se contrôle chapitre
// par chapitre avec scripts/couverture-terminale.mjs.
const matieresTerminale = lireRacine(join(root, 'content', 'terminale'));
if (matieresTerminale.length > 0) {
  const validateursTerminale = compilerSchemas();
  const problemesTerminale = [];
  for (const matiere of matieresTerminale) {
    problemesTerminale.push(...matiere.problemes);
    const resultat = validerSchemas(matiere, validateursTerminale);
    total += resultat.total;
    problemesTerminale.push(...resultat.problemes);
  }
  problemesTerminale.push(...controlerIntegrite(matieresTerminale));
  invalid += problemesTerminale.length;
  for (const p of problemesTerminale) {
    problems.push({ file: p.fichier, message: `${p.id ? `[${p.id}] ` : ''}${p.message}` });
  }
}

// --- Terminale : texte exact des programmes officiels ---
// Chaque ligne de programme.json reprend mot pour mot le texte du Bulletin officiel
// enregistré dans le référentiel de la matière (scripts/programme-conforme.mjs).
for (const matiere of matieresAvecProgramme()) {
  const filePath = join(root, 'content', 'terminale', matiere, 'programme.json');
  let resultat;
  try {
    resultat = verifierProgramme(matiere);
  } catch (err) {
    invalid += 1;
    problems.push({ file: filePath, message: `contrôle du texte officiel impossible : ${err.message}` });
    continue;
  }
  if (resultat.texteManquant) {
    invalid += 1;
    problems.push({
      file: filePath,
      message: 'texte officiel non enregistré (texte-officiel/programme*.txt du référentiel)',
    });
  }
  for (const e of resultat.ecarts) {
    invalid += 1;
    problems.push({ file: filePath, message: `[${e.id}] ${e.message}` });
  }
}

console.log(`Validés : ${total - invalid} / ${total}`);
if (problems.length === 0) {
  console.log('✓ Tout le contenu est conforme aux schémas.');
  process.exit(0);
}

console.error(`\n✗ ${problems.length} problème(s) détecté(s) :`);
for (const p of problems) {
  console.error(`  ${p.file}\n    ${p.message}`);
}
process.exit(1);

function safeStat(path) {
  try {
    return statSync(path);
  } catch {
    return null;
  }
}
