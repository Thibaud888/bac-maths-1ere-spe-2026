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

describe('controle-rendu.mjs --liste (pages prévues, sans navigateur)', () => {
  type Liste = { pages: { nom: string; chemin: string }[]; captures: string[] };
  const liste = (args: string[]) => JSON.parse(lancer('controle-rendu.mjs', [...args, '--temoin', '--liste']).sortie) as Liste;

  it('ouvre chaque notion, le mémo, une page par marche et le premier type bac', () => {
    const { pages, captures } = liste(['maths', 'temoin-maths']);
    const noms = pages.map((p) => p.nom);
    expect(noms).toEqual([
      'apercu', 'cours-alpha', 'cours-beta', 'cours-gamma', 'memo',
      'exercices', 'eclair', 'marche-1', 'marche-2', 'marche-3', 'type-bac', 'type-bac-1',
    ]);
    expect(pages[1]?.chemin).toBe('/terminale/maths/temoin-maths/cours/alpha');
    expect(captures).toEqual([
      'cours-alpha-clair-1280.png', 'cours-alpha-sombre-390.png',
      'marche-1-clair-390.png', 'type-bac-1-sombre-1280.png',
    ]);
  });

  it('partie cours : Aperçu, notions et mémo seulement ; toujours quatre captures', () => {
    const { pages, captures } = liste(['maths', 'temoin-maths', '--partie', 'cours']);
    expect(pages.map((p) => p.nom)).toEqual(['apercu', 'cours-alpha', 'cours-beta', 'cours-gamma', 'memo']);
    expect(captures).toHaveLength(4);
    expect(captures[3]).toBe('memo-sombre-1280.png');
  });

  it('« Méthodes » : adresse propre, pas de type bac', () => {
    const { pages } = liste(['maths', 'temoin-methodes-maths']);
    expect(pages[0]?.chemin).toBe('/terminale/maths/methodes');
    expect(pages.some((p) => p.nom.startsWith('type-bac'))).toBe(false);
  });
});

describe('contexte-chapitre.mjs — la fiche de lecture', () => {
  const fiche = (args: string[]) => {
    const r = lancer('contexte-chapitre.mjs', args);
    expect(r.code, r.erreur).toBe(0);
    return r.sortie;
  };
  const programme = JSON.parse(readFileSync(join(DEPOT, 'content/terminale/maths/programme.json'), 'utf8')) as {
    id: string; chapitre: string; texte: string;
  }[];

  it('relecteur : chaque ligne du chapitre, texte exact ; les chapitres ultérieurs interdits', () => {
    const f = fiche(['maths', 'denombrement', '--role', 'relecteur']);
    const lignes = programme.filter((l) => l.chapitre === 'denombrement');
    expect(lignes.length).toBeGreaterThan(0);
    for (const l of lignes) {
      expect(f).toContain(`\`${l.id}\``);
      expect(f).toContain(l.texte);
    }
    expect(f).toMatch(/`loi-binomiale`[^\n]*ultérieur : interdit/);
    const binomiale = programme.find((l) => l.chapitre === 'loi-binomiale');
    expect(f.split('Identifiants interdits')[1]).toContain(binomiale!.id.replace(/\d+$/, ''));
    expect(f).toContain('Format de l\'épreuve');
    expect(f).toContain('Hors programme');
    // Bien plus court que les sources qu'elle remplace.
    const sources = ['programme.json', 'annales.json'].map((n) => readFileSync(join(DEPOT, 'content/terminale/maths', n), 'utf8').length);
    expect(f.length).toBeLessThan((sources[0]! + sources[1]!) / 4);
  });

  it('annales : seulement les exercices qui touchent le chapitre, formulations recopiées', () => {
    const f = fiche(['maths', 'denombrement', '--role', 'auteur-bac']);
    const annales = JSON.parse(readFileSync(join(DEPOT, 'content/terminale/maths/annales.json'), 'utf8'));
    const ids = new Set(programme.filter((l) => l.chapitre === 'denombrement').map((l) => l.id));
    for (const sujet of annales.sujets) {
      for (const ex of sujet.exercices ?? []) {
        const touche = (ex.capacites ?? []).some((c: string) => ids.has(c));
        expect(f.includes(`\`${sujet.id}\` ex. ${ex.numero} `), `${sujet.id} ex. ${ex.numero}`).toBe(touche);
      }
    }
  });

  it('chapitre suivant : index des chapitres antérieurs (notions, blocs), sans leur texte', () => {
    const f = fiche(['maths', 'loi-binomiale', '--role', 'auteur-cours']);
    const notions = JSON.parse(readFileSync(join(DEPOT, 'content/terminale/maths/chapitres/denombrement/notions.json'), 'utf8'));
    for (const n of notions) expect(f).toContain(`\`${n.id}\``);
    const cours = JSON.parse(readFileSync(join(DEPOT, 'content/terminale/maths/chapitres/denombrement/cours.json'), 'utf8'));
    const bloc = cours.sections[0].blocs.find((b: { type: string }) => b.type === 'definition');
    expect(f).toContain(`\`${bloc.id}\``);
    expect(f).not.toContain(bloc.texte);
    expect(f).toMatch(/`denombrement`[^\n]*antérieur : citable/);
  });

  it('élève-testeur : l\'index seulement, ni programme ni annales ; physique-chimie sans annales', () => {
    const f = fiche(['maths', 'loi-binomiale', '--role', 'eleve-testeur']);
    expect(f).not.toContain('Lignes du programme');
    expect(f).not.toContain('annales.json`)');
    expect(f).toContain('Index des chapitres antérieurs');
    const pc = fiche(['physique-chimie', 'acides-bases', '--role', 'architecte']);
    expect(pc).toContain('Pas d\'index des annales');
    expect(pc).toContain('Particularités de la matière');
  });

  it('refuse un rôle inconnu ou un chapitre sans ligne du programme', () => {
    expect(lancer('contexte-chapitre.mjs', ['maths', 'denombrement', '--role', 'chef']).code).toBe(2);
    expect(lancer('contexte-chapitre.mjs', ['maths', 'inexistant']).code).toBe(2);
  });
});

describe('controles-mecaniques.mjs — avant la relecture', () => {
  type Resultat = { ecarts: Ecart[]; avertissements: Ecart[]; stats: { formules: number } };
  const controler = (matiere: string, chapitre: string, racine?: string) => {
    const r = lancer('controles-mecaniques.mjs', [matiere, chapitre, '--json', ...(racine ? ['--racine', racine] : [])]);
    return { code: r.code, resultat: JSON.parse(r.sortie) as Resultat };
  };
  const reglesDe = (r: Resultat) => new Set(r.ecarts.map((e) => e.regle));
  const PC = 'physique-chimie/chapitres/temoin-physique-chimie';

  it('aucun bloquant sur les chapitres écrits et sur le témoin', () => {
    for (const [m, c] of [['maths', 'denombrement'], ['physique-chimie', 'acides-bases']] as const) {
      const { code, resultat } = controler(m, c);
      expect(resultat.ecarts, `${m}/${c}`).toEqual([]);
      expect(code).toBe(0);
      expect(resultat.stats.formules).toBeGreaterThan(1000);
    }
    for (const [m, c] of [['maths', 'temoin-maths'], ['physique-chimie', 'temoin-physique-chimie']] as const) {
      expect(controler(m, c, TEMOIN).resultat.ecarts, `${m}/${c}`).toEqual([]);
    }
  });

  it('trouve un indice qui donne la valeur, une unité manquante, une formule cassée', () => {
    const c = copieDuTemoin();
    const exercices = c.lire(`${PC}/exercices.json`);
    const q = exercices[0].questions[0];
    q.indices[1] = 'On trouve $0{,}05$ : il reste à écrire l\'unité.';
    const q2 = exercices[4].questions[1];
    delete q2.reponse.unite;
    q2.enonce = 'Calculer la vitesse du mobile.';
    exercices[1].titre = 'Une formule $\\frac{1}{$ cassée';
    c.ecrire(`${PC}/exercices.json`, exercices);
    const { code, resultat } = controler('physique-chimie', 'temoin-physique-chimie', c.racine);
    expect(code).toBe(1);
    const ids = (regle: string) => resultat.ecarts.filter((e) => e.regle === regle).map((e) => e.id);
    expect(ids('indice-donne-la-valeur')).toEqual([`${exercices[0].id} ${q.id}`]);
    expect(ids('unite')).toEqual([`${exercices[4].id} ${q2.id}`]);
    expect(ids('katex')[0]).toContain(exercices[1].id);
  });

  it('trouve une virgule décimale, un vouvoiement, des indices en trop', () => {
    const c = copieDuTemoin();
    const cours = c.lire('maths/chapitres/temoin-maths/cours.json');
    const bloc = cours.sections[0].blocs.find((b: { texte?: string }) => typeof b.texte === 'string');
    bloc.texte = `${bloc.texte} Calculez $x = 2,5$ puis vérifiez votre résultat.`;
    c.ecrire('maths/chapitres/temoin-maths/cours.json', cours);
    const exercices = c.lire('maths/chapitres/temoin-maths/exercices.json');
    const m1 = exercices.find((x: { niveau: number }) => x.niveau === 1);
    m1.questions[0].indices.push('Un troisième indice.');
    c.ecrire('maths/chapitres/temoin-maths/exercices.json', exercices);
    const { resultat } = controler('maths', 'temoin-maths', c.racine);
    const r = reglesDe(resultat);
    expect(r.has('virgule')).toBe(true);
    expect(r.has('tutoiement')).toBe(true);
    expect(resultat.ecarts.filter((e) => e.regle === 'tutoiement').length).toBeGreaterThanOrEqual(2);
    expect(r.has('couverture/marche')).toBe(true);
  });

  it('trouve une somme de points fausse dans un type bac', () => {
    const c = copieDuTemoin();
    const tb = c.lire('maths/chapitres/temoin-maths/type-bac.json');
    tb[0].points += 1;
    c.ecrire('maths/chapitres/temoin-maths/type-bac.json', tb);
    expect(reglesDe(controler('maths', 'temoin-maths', c.racine).resultat).has('integrite')).toBe(true);
  });
});

describe('extraire-items.mjs — tours 2 et 3 du relecteur', () => {
  it('rend les items par identifiant, avec la notion d\'un bloc', () => {
    const r = lancer('extraire-items.mjs', ['maths', 'temoin-maths', '--racine', TEMOIN, 'x-temoin-maths-001', 'n-temoin-maths-alpha']);
    expect(r.code).toBe(0);
    const sortie = JSON.parse(r.sortie);
    expect(sortie.items.map((i: { fichier: string }) => i.fichier)).toEqual(['exercices', 'notions']);
    expect(lancer('extraire-items.mjs', ['maths', 'temoin-maths', '--racine', TEMOIN, 'x-inconnu']).code).toBe(2);
  });

  it('rend seulement ce qui a changé depuis l\'instantané, et ce qui a disparu', () => {
    const c = copieDuTemoin();
    const instantane = mkdtempSync(join(tmpdir(), 'instantane-'));
    copies.push(instantane);
    expect(lancer('extraire-items.mjs', ['maths', 'temoin-maths', '--racine', c.racine, '--instantane', instantane]).code).toBe(0);
    const exercices = c.lire('maths/chapitres/temoin-maths/exercices.json');
    exercices[2].titre = 'Titre corrigé';
    const retire = exercices.pop();
    c.ecrire('maths/chapitres/temoin-maths/exercices.json', exercices);
    const r = lancer('extraire-items.mjs', ['maths', 'temoin-maths', '--racine', c.racine, '--depuis', instantane]);
    const sortie = JSON.parse(r.sortie);
    expect(sortie.items.map((i: { id: string }) => i.id)).toEqual([exercices[2].id]);
    expect(sortie.supprimes).toEqual([retire.id]);
  });
});
