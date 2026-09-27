import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

/**
 * Les deux scripts de la terminale, lancés comme le fait une session :
 * scripts/couverture-terminale.mjs (charte § 9.3) et scripts/sans-reponses.mjs (§ 12).
 */

const DEPOT = resolve(__dirname, '../../../..');
const TEMOIN = join(DEPOT, 'tests', 'fixtures', 'terminale');

type Ecart = { regle: string; id?: string; message: string };
type Rapport = { ecarts: Ecart[]; avertissements: Ecart[]; quotas: Record<string, unknown>[] };

function lancer(script: string, args: string[]) {
  const r = spawnSync(process.execPath, [join(DEPOT, 'scripts', script), ...args], {
    cwd: DEPOT,
    encoding: 'utf8',
  });
  return { code: r.status, sortie: r.stdout, erreur: r.stderr };
}

function couverture(matiere: string, chapitre: string, racine: string, partie?: 'cours' | 'exercices') {
  const args = [matiere, chapitre, '--racine', racine, '--json', ...(partie ? ['--partie', partie] : [])];
  const r = lancer('couverture-terminale.mjs', args);
  return { code: r.code, rapport: JSON.parse(r.sortie) as Rapport };
}

const copies: string[] = [];
afterAll(() => copies.forEach((d) => rmSync(d, { recursive: true, force: true })));

/** Copie du témoin qu'un test peut abîmer. */
function copieDuTemoin(): { racine: string; lire: (f: string) => any; ecrire: (f: string, v: unknown) => void } {
  const racine = mkdtempSync(join(tmpdir(), 'temoin-'));
  copies.push(racine);
  cpSync(TEMOIN, racine, { recursive: true });
  return {
    racine,
    lire: (f) => JSON.parse(readFileSync(join(racine, f), 'utf8')),
    ecrire: (f, v) => {
      mkdirSync(join(racine, f, '..'), { recursive: true });
      writeFileSync(join(racine, f), JSON.stringify(v, null, 2));
    },
  };
}

const regles = (r: Rapport) => new Set(r.ecarts.map((e) => e.regle));

describe('couverture-terminale.mjs — le témoin est un chapitre fini', () => {
  it.each([
    ['maths', 'temoin-maths'],
    ['maths', 'temoin-methodes-maths'],
    ['physique-chimie', 'temoin-physique-chimie'],
  ])('%s / %s : rapport vide, sans avertissement', (matiere, chapitre) => {
    for (const partie of ['cours', 'exercices'] as const) {
      const { code, rapport } = couverture(matiere, chapitre, TEMOIN, partie);
      expect(rapport.ecarts).toEqual([]);
      expect(rapport.avertissements).toEqual([]);
      expect(code).toBe(0);
    }
  });

  it('donne le compte par notion face aux planchers', () => {
    const { rapport } = couverture('maths', 'temoin-maths', TEMOIN);
    expect(rapport.quotas).toContainEqual(
      expect.objectContaining({ notion: 'n-temoin-maths-alpha', priorite: 3, m1: 3, flash: 3, typeBac: 2 })
    );
  });

  it('sort en code 2 sur un chapitre introuvable ou une matière inconnue', () => {
    expect(lancer('couverture-terminale.mjs', ['maths', 'nulle-part', '--racine', TEMOIN]).code).toBe(2);
    expect(lancer('couverture-terminale.mjs', ['svt', 'temoin-maths', '--racine', TEMOIN]).code).toBe(2);
  });
});

describe('couverture-terminale.mjs — ce qu\'il signale', () => {
  const chap = 'maths/chapitres/temoin-maths';
  const c = copieDuTemoin();

  // Un chapitre suivant (écrit) et un chapitre pas encore écrit.
  const programme = c.lire('maths/programme.json');
  const ligne = programme[0];
  programme.push({ ...ligne, id: 'bo-m-temoin-80', chapitre: 'temoin-maths-suite' });
  programme.push({ ...ligne, id: 'bo-m-temoin-81', chapitre: 'pas-encore-ecrit' });
  c.ecrire('maths/programme.json', programme);
  c.ecrire('maths/chapitres/temoin-maths-suite/meta.json', {
    ...c.lire(`${chap}/meta.json`),
    slug: 'temoin-maths-suite',
    ordre: 20,
  });

  const notions = c.lire(`${chap}/notions.json`);
  notions[0].prerequis.push('n-temoin-maths-gamma'); // notion placée après
  notions[0].attendusBac = ['Formulation inventée.'];
  notions[1].capacites = ['bo-m-temoin-04']; // bo-m-temoin-03 hors notion
  c.ecrire(`${chap}/notions.json`, notions);

  const cours = c.lire(`${chap}/cours.json`);
  const section = cours.sections[0].blocs;
  [section[0], section[1]] = [section[1], section[0]]; // « rappel » avant « idée »
  section.find((b: any) => b.type === 'demonstration').capacites = ['bo-m-temoin-01'];
  section.find((b: any) => b.type === 'figure').figure = {
    type: 'image',
    data: { src: 'terminale/maths/temoin-maths/absente.svg', alt: 'Figure absente' },
  };
  delete section.find((b: any) => b.type === 'definition').capacites;
  c.ecrire(`${chap}/cours.json`, cours);

  const exercices = c.lire(`${chap}/exercices.json`);
  exercices[0].capacites.push('bo-m-temoin-80', 'bo-m-temoin-06'); // chapitre ultérieur, non exigible
  exercices[1].capacites.push('bo-m-temoin-81'); // chapitre pas encore écrit
  exercices[2].duree = 12; // marche 1 : ≤ 5 min
  exercices[2].questions[0].reponse = { type: 'redaction' };
  c.ecrire(`${chap}/exercices.json`, exercices);

  c.ecrire(`${chap}/flash.json`, c.lire(`${chap}/flash.json`).filter((f: any) => f.notion !== 'n-temoin-maths-gamma'));
  const typeBac = c.lire(`${chap}/type-bac.json`);
  typeBac[0].points = 6;
  c.ecrire(`${chap}/type-bac.json`, typeBac.slice(0, 2));

  const { code, rapport } = couverture('maths', 'temoin-maths', c.racine);
  const vues = regles(rapport);
  const trouve = (regle: string, id?: string) =>
    rapport.ecarts.some((e) => e.regle === regle && (id === undefined || e.id === id));

  it('sort en code 1 dès qu\'il y a un écart', () => {
    expect(code).toBe(1);
  });

  it('refuse le non-conforme au schéma et les données incohérentes', () => {
    expect(vues.has('schema')).toBe(true);
    expect(trouve('integrite', 'tb-temoin-maths-001')).toBe(true); // points faux
    expect(trouve('figure-absente', 'l-temoin-maths-010')).toBe(true);
  });

  it('signale les lignes hors notion et les exigences du § 9.2 non remplies', () => {
    expect(trouve('hors-notion', 'bo-m-temoin-03')).toBe(true);
    expect(trouve('exigence', 'bo-m-temoin-02')).toBe(true); // plus de démonstration exigible
    expect(trouve('exigence', 'bo-m-temoin-05')).toBe(true); // plus de question éclair
    expect(trouve('demonstration-exigible', 'l-temoin-maths-007')).toBe(true);
  });

  it('signale les citations interdites', () => {
    expect(trouve('chapitre-ulterieur', 'x-temoin-maths-001')).toBe(true);
    expect(trouve('chapitre-non-ecrit', 'x-temoin-maths-002')).toBe(true);
    expect(trouve('non-exigible', 'x-temoin-maths-001')).toBe(true);
    expect(trouve('hors-notions-de-l-element', 'x-temoin-maths-001')).toBe(true);
    expect(trouve('prerequis-ulterieur', 'n-temoin-maths-alpha')).toBe(true);
  });

  it('signale planchers, forme des marches, déroulé et formulations inventées', () => {
    expect(trouve('plancher', 'n-temoin-maths-gamma')).toBe(true);
    expect(trouve('marche', 'x-temoin-maths-003')).toBe(true);
    expect(trouve('marche', 'x-temoin-maths-003 q1')).toBe(true);
    expect(trouve('type-bac-nombre')).toBe(true);
    expect(trouve('deroule', 'l-temoin-maths-002')).toBe(true);
    expect(trouve('attendu-hors-annales', 'n-temoin-maths-alpha')).toBe(true);
  });

  it('--partie cours ne regarde ni les exercices, ni les éclairs, ni le type bac', () => {
    const cours = couverture('maths', 'temoin-maths', c.racine, 'cours').rapport;
    const vuesCours = regles(cours);
    for (const r of ['marche', 'type-bac-nombre', 'chapitre-ulterieur', 'chapitre-non-ecrit']) {
      expect(vuesCours.has(r), r).toBe(false);
    }
    expect(cours.ecarts.some((e) => e.id === 'tb-temoin-maths-001')).toBe(false);
    expect(cours.ecarts.some((e) => e.regle === 'exigence' && e.id === 'bo-m-temoin-05')).toBe(false);
    expect(vuesCours.has('deroule')).toBe(true);
    expect(vuesCours.has('hors-notion')).toBe(true);
  });
});

describe('couverture-terminale.mjs — garde-fous du chapitre', () => {
  it('refuse trop d\'incontournables estimés et un chapitre de moins de trois notions', () => {
    const c = copieDuTemoin();
    const chap = 'physique-chimie/chapitres/temoin-physique-chimie';
    const notions = c.lire(`${chap}/notions.json`);
    notions[1].priorite = 3;
    notions[2].priorite = 3;
    c.ecrire(`${chap}/notions.json`, notions);
    expect(regles(couverture('physique-chimie', 'temoin-physique-chimie', c.racine, 'cours').rapport).has('trop-incontournables')).toBe(true);
    c.ecrire(`${chap}/notions.json`, notions.slice(0, 2));
    expect(regles(couverture('physique-chimie', 'temoin-physique-chimie', c.racine, 'cours').rapport).has('nombre-notions')).toBe(true);
  });

  it('avertit d\'une valeur sans unité en physique-chimie, sans la bloquer', () => {
    const c = copieDuTemoin();
    const chap = 'physique-chimie/chapitres/temoin-physique-chimie';
    const flash = c.lire(`${chap}/flash.json`);
    delete flash[0].reponse.unite;
    c.ecrire(`${chap}/flash.json`, flash);
    const { code, rapport } = couverture('physique-chimie', 'temoin-physique-chimie', c.racine);
    expect(code).toBe(0);
    expect(rapport.avertissements.map((a) => a.regle)).toContain('unite');
  });
});

describe('sans-reponses.mjs', () => {
  const r = lancer('sans-reponses.mjs', ['maths', 'temoin-maths', '--racine', TEMOIN]);
  const version = JSON.parse(r.sortie);

  it('rend exercices, type bac et questions éclair du chapitre', () => {
    expect(r.code).toBe(0);
    expect(version.exercices.length).toBe(14);
    expect(version.typeBac.length).toBe(3);
    expect(version.flash.length).toBe(6);
  });

  it('ne laisse aucune solution, aucun indice, aucune réponse', () => {
    const interdits = [
      'solution', 'indices', 'revoir', 'erreurFrequente', 'attenduCorrecteur', 'explication',
      'bonne', 'bonnes', 'valeur', 'justification', 'pourquoiFaux', 'tolerance', 'toleranceRelative',
    ];
    const cles = new Set<string>();
    const parcourir = (v: unknown): void => {
      if (Array.isArray(v)) v.forEach(parcourir);
      else if (v && typeof v === 'object') {
        for (const [k, x] of Object.entries(v)) {
          cles.add(k);
          parcourir(x);
        }
      }
    };
    parcourir(version);
    for (const cle of interdits) expect(cles.has(cle), cle).toBe(false);
  });

  it('garde ce qu\'il faut pour répondre : choix du QCM, éléments mélangés, énoncés', () => {
    const qcm = version.exercices[0].questions[0].reponse;
    expect(qcm).toEqual({ type: 'qcm', choix: ['$1$', '$3$', '$7$'] });
    const original = JSON.parse(
      readFileSync(join(TEMOIN, 'maths/chapitres/temoin-maths/exercices.json'), 'utf8')
    )[3].questions[0].reponse.elements;
    const melange = version.exercices[3].questions[0].reponse.elements;
    expect([...melange].sort()).toEqual([...original].sort());
    expect(melange).not.toEqual(original);
    expect(version.typeBac[1].questions[1].sousQuestions[0].enonce).toBeTruthy();
  });

  it('écrit dans un fichier avec --sortie', () => {
    const c = copieDuTemoin();
    const fichier = join(c.racine, 'sans-reponses.json');
    const e = lancer('sans-reponses.mjs', ['physique-chimie', 'temoin-physique-chimie', '--racine', TEMOIN, '--sortie', fichier]);
    expect(e.code).toBe(0);
    expect(JSON.parse(readFileSync(fichier, 'utf8')).chapitre).toBe('temoin-physique-chimie');
  });
});
