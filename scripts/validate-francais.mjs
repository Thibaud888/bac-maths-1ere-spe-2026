#!/usr/bin/env node
/**
 * Valide tous les fichiers JSON de `content/francais/*` contre les schémas
 * français (`schemas/francais/*`).
 * Usage : node scripts/validate-francais.mjs
 * Exit 0 si tout est valide, 1 sinon.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const ajv = new Ajv({ allErrors: true, strict: false });

const schemaFiles = {
  fiches: 'fiche.schema.json',
  quiz: 'quiz.schema.json',
  exercices: 'french-exercise.schema.json',
  sujets: 'french-subject.schema.json',
};

const validators = {};
for (const [key, file] of Object.entries(schemaFiles)) {
  const schema = JSON.parse(
    readFileSync(join(root, 'schemas', 'francais', file), 'utf8')
  );
  validators[key] = ajv.compile(schema);
}

const flashcardDeckSchema = JSON.parse(
  readFileSync(join(root, 'schemas', 'francais', 'flashcard-deck.schema.json'), 'utf8')
);
const validateFlashcardDeck = ajv.compile(flashcardDeckSchema);

const validatorCache = new Map();
function loadValidator(file) {
  let validate = validatorCache.get(file);
  if (!validate) {
    validate = ajv.compile(
      JSON.parse(readFileSync(join(root, 'schemas', 'francais', file), 'utf8'))
    );
    validatorCache.set(file, validate);
  }
  return validate;
}

// Oral EAF — un validateur par fichier (oral-meta.json est un objet, les
// autres sont des tableaux).
const oralValidators = {
  'oral-meta.json': { validate: loadValidator('oral-meta.schema.json'), array: false },
  'epreuve.json': { validate: loadValidator('oral-fiche.schema.json'), array: true },
  'methode.json': { validate: loadValidator('oral-fiche.schema.json'), array: true },
  'grammaire-fiches.json': { validate: loadValidator('oral-fiche.schema.json'), array: true },
  'grammaire-quiz.json': { validate: loadValidator('oral-quiz.schema.json'), array: true },
};

// Descriptif par élève : un dossier par élève sous `oral/eleves/<id>/`.
const oralStudentValidators = {
  'profil.json': { validate: loadValidator('oral-student.schema.json'), array: false },
  'textes.json': { validate: loadValidator('oral-text.schema.json'), array: true },
  'entretien.json': { validate: loadValidator('entretien-question.schema.json'), array: true },
};

const modulesDir = join(root, 'content', 'francais');
let total = 0;
let invalid = 0;
const problems = [];

/** Valide un fichier JSON (tableau d'items ou objet unique) contre `validate`. */
function validateJsonFile(filePath, validate, array) {
  if (!safeStat(filePath)) return;
  let data;
  try {
    data = JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (err) {
    invalid += 1;
    problems.push({ file: filePath, message: `JSON invalide : ${err.message}` });
    return;
  }
  if (array && !Array.isArray(data)) {
    invalid += 1;
    problems.push({
      file: filePath,
      message: `Le fichier doit contenir un tableau (reçu ${typeof data}).`,
    });
    return;
  }
  const records = array ? data : [data];
  records.forEach((item, idx) => {
    total += 1;
    if (!validate(item)) {
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

if (!safeStat(modulesDir)) {
  console.error(`Aucun dossier ${modulesDir} — rien à valider.`);
  process.exit(0);
}

for (const slug of readdirSync(modulesDir)) {
  const modDir = join(modulesDir, slug);
  if (!statSync(modDir).isDirectory()) continue;

  // Flashcard decks (express/) — each file is a FlashcardDeck object, not an array
  if (slug === 'express') {
    for (const filename of readdirSync(modDir)) {
      if (!filename.startsWith('deck-') || !filename.endsWith('.json')) continue;
      const filePath = join(modDir, filename);
      let data;
      try {
        data = JSON.parse(readFileSync(filePath, 'utf8'));
      } catch (err) {
        invalid += 1;
        problems.push({ file: filePath, message: `JSON invalide : ${err.message}` });
        continue;
      }
      total += 1;
      const ok = validateFlashcardDeck(data);
      if (!ok) {
        invalid += 1;
        problems.push({
          file: filePath,
          message: (validateFlashcardDeck.errors ?? [])
            .map((e) => `${e.instancePath || '<root>'} ${e.message ?? '?'}`)
            .join(' ; '),
        });
      }
    }
    continue;
  }

  // Oral EAF (oral/) — fichiers nommés à part, jamais des noms de modules.
  if (slug === 'oral') {
    // Contenu commun à tous les élèves.
    for (const [filename, { validate, array }] of Object.entries(oralValidators)) {
      validateJsonFile(join(modDir, filename), validate, array);
    }
    // Descriptif propre à chaque élève : oral/eleves/<id>/.
    const elevesDir = join(modDir, 'eleves');
    if (safeStat(elevesDir)) {
      for (const eleve of readdirSync(elevesDir)) {
        const eleveDir = join(elevesDir, eleve);
        if (!statSync(eleveDir).isDirectory()) continue;
        for (const [filename, { validate, array }] of Object.entries(
          oralStudentValidators
        )) {
          validateJsonFile(join(eleveDir, filename), validate, array);
        }
      }
    }
    continue;
  }

  for (const [type, validate] of Object.entries(validators)) {
    const filePath = join(modDir, `${type}.json`);
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

console.log(`Validés : ${total - invalid} / ${total}`);
if (problems.length === 0) {
  console.log('✓ Tout le contenu français est conforme aux schémas.');
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
