#!/usr/bin/env node
// Vérification complète du repo : typecheck + tests + validation de contenu + build.
// Usage : node scripts/verify.mjs [--quick]  (--quick : sans le build)
// La session Claude doit le lancer et regarder le résultat AVANT de conclure.
import { execSync } from "node:child_process";

const quick = process.argv.includes("--quick");
const steps = [
  ["typecheck", "npm run typecheck"],
  ["tests", "npm run test"],
  ["contenu maths", "npm run validate-content"],
  ["contenu français", "npm run validate-francais"],
  ...(quick ? [] : [["build", "npm run build"]]),
];

for (const [nom, cmd] of steps) {
  process.stdout.write(`• ${nom}… `);
  try {
    execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] });
    console.log("OK");
  } catch (e) {
    console.log("ÉCHEC");
    console.error(String(e.stdout ?? ""));
    console.error(String(e.stderr ?? ""));
    console.error(`VERIFY ÉCHEC : étape « ${nom} » (${cmd})`);
    process.exit(1);
  }
}
console.log(`VERIFY OK : ${steps.length} étapes passées${quick ? " (mode --quick, sans build)" : ""}.`);
