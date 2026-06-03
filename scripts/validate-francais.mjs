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
};

const validators = {};
for (const [key, file] of Object.entries(schemaFiles)) {
  const schema = JSON.parse(
    readFileSync(join(root, 'schemas', 'francais', file), 'utf8')
  );
  validators[key] = ajv.compile(schema);
}

const modulesDir = join(root, 'content', 'francais');
let total = 0;
let invalid = 0;
const problems = [];

if (!safeStat(modulesDir)) {
  console.error(`Aucun dossier ${modulesDir} — rien à valider.`);
  process.exit(0);
}

for (const slug of readdirSync(modulesDir)) {
  const modDir = join(modulesDir, slug);
  if (!statSync(modDir).isDirectory()) continue;

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
