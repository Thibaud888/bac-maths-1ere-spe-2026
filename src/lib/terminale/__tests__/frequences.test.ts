import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

/** scripts/frequences-annales.mjs (charte § 5.1), lancé sur une copie du témoin. */

const DEPOT = resolve(__dirname, '../../../..');
const TEMOIN = join(DEPOT, 'tests', 'fixtures', 'terminale');
const copies: string[] = [];
afterAll(() => copies.forEach((d) => rmSync(d, { recursive: true, force: true })));

function lancer(args: string[]) {
  const r = spawnSync(process.execPath, [join(DEPOT, 'scripts', 'frequences-annales.mjs'), ...args], {
    cwd: DEPOT,
    encoding: 'utf8',
  });
  return { code: r.status, sortie: r.stdout, erreur: r.stderr };
}

/** Un index d'essai : trois sujets, dont un « partiel » qui exclut bo-m-temoin-03. */
function racineAvecIndex(complet: boolean): string {
  const racine = mkdtempSync(join(tmpdir(), 'frequences-'));
  copies.push(racine);
  cpSync(TEMOIN, racine, { recursive: true });
  const exercice = (capacites: string[]) => ({ numero: 1, points: 5, titre: 'Essai', capacites, formulations: [] });
  const annales = {
    complet,
    depuis: 2021,
    sujets: [
      { id: 'an-2022-essai-j1', annee: 2022, lieu: 'Essai', url: 'https://example.org/1.pdf', programmeEvalue: 'partiel', exclus: ['bo-m-temoin-03'], exercices: [exercice(['bo-m-temoin-01'])] },
      { id: 'an-2024-essai-j1', annee: 2024, lieu: 'Essai', url: 'https://example.org/2.pdf', programmeEvalue: 'complet', exercices: [exercice(['bo-m-temoin-01', 'bo-m-temoin-03'])] },
      { id: 'an-2024-essai-j2', annee: 2024, lieu: 'Essai', url: 'https://example.org/3.pdf', programmeEvalue: 'complet', exercices: [exercice(['bo-m-temoin-05'])] },
    ],
  };
  writeFileSync(join(racine, 'maths', 'annales.json'), JSON.stringify(annales));
  return racine;
}

describe('frequences-annales.mjs', () => {
  it('refuse de publier tant que l’index n’est pas complet', () => {
    const r = lancer(['maths', 'temoin-maths', '--racine', racineAvecIndex(false)]);
    expect(r.code).toBe(1);
    expect(r.erreur).toContain('pas complet');
  });

  it('compte, par notion, les sujets où elle pouvait tomber et ceux où elle est tombée', () => {
    const r = lancer(['maths', 'temoin-maths', '--racine', racineAvecIndex(true), '--json']);
    expect(r.code).toBe(0);
    const resultat = JSON.parse(r.sortie) as {
      notions: { id: string; tombes: number; possibles: number; priorite: number }[];
      lignes: { id: string; tombes: number; possibles: number }[];
    };
    const notion = (id: string) => resultat.notions.find((n) => n.id === id);
    // alpha (lignes 01, 02) : dans 2 sujets sur 3 → incontournable.
    expect(notion('n-temoin-maths-alpha')).toMatchObject({ tombes: 2, possibles: 3, priorite: 3 });
    // beta (lignes 03, 04) : la ligne 03 est exclue du sujet partiel, mais la 04 pouvait
    // tomber : le sujet compte au dénominateur ; tombée une fois.
    expect(notion('n-temoin-maths-beta')).toMatchObject({ tombes: 1, possibles: 3, priorite: 2 });
    const ligne03 = resultat.lignes.find((l) => l.id === 'bo-m-temoin-03');
    expect(ligne03).toMatchObject({ tombes: 1, possibles: 2 });
    expect(notion('n-temoin-maths-gamma')).toMatchObject({ tombes: 1, possibles: 3 });
  });

  it('donne un tableau par chapitre sans chapitre demandé', () => {
    const r = lancer(['maths', '--racine', racineAvecIndex(true)]);
    expect(r.code).toBe(0);
    expect(r.sortie).toContain('temoin-maths');
  });
});
