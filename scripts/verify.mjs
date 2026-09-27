#!/usr/bin/env node
// Vérification complète du repo : typecheck + tests + validation de contenu + build.
// Usage : node scripts/verify.mjs [--quick]  (--quick : sans le build)
// La session Claude doit le lancer et regarder le résultat AVANT de conclure.
import { execSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Le chapitre-témoin de terminale (tests/fixtures/terminale/) ne sert qu'en
// développement (VITE_TEMOIN=1) : il ne doit jamais entrer dans le site publié.
function temoinAbsentDuBuild() {
  const marqueurs = ["bo-m-temoin-", "bo-pc-temoin-"];
  const fichiers = (dossier) =>
    readdirSync(dossier, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? fichiers(join(dossier, e.name)) : [join(dossier, e.name)]
    );
  for (const fichier of fichiers("dist").filter((f) => /\.(js|json|html)$/.test(f))) {
    const texte = readFileSync(fichier, "utf8");
    const trouve = marqueurs.find((m) => texte.includes(m));
    if (trouve) throw Object.assign(new Error(), { stdout: `${fichier} contient « ${trouve} » : le témoin est dans le build.` });
  }
}

const quick = process.argv.includes("--quick");
const steps = [
  ["typecheck", "npm run typecheck"],
  ["tests", "npm run test"],
  ["contenu maths", "npm run validate-content"],
  ["contenu français", "npm run validate-francais"],
  ...(quick ? [] : [["build", "npm run build"], ["témoin absent du build", temoinAbsentDuBuild]]),
];

for (const [nom, cmd] of steps) {
  process.stdout.write(`• ${nom}… `);
  try {
    if (typeof cmd === "function") cmd();
    else execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] });
    console.log("OK");
  } catch (e) {
    console.log("ÉCHEC");
    console.error(String(e.stdout ?? ""));
    console.error(String(e.stderr ?? ""));
    console.error(`VERIFY ÉCHEC : étape « ${nom} »${typeof cmd === "string" ? ` (${cmd})` : ""}`);
    process.exit(1);
  }
}
console.log(`VERIFY OK : ${steps.length} étapes passées${quick ? " (mode --quick, sans build)" : ""}.`);
