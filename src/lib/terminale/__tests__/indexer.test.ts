import { describe, expect, it, vi } from 'vitest';
import { indexerTerminale, type FichierBrut } from '../indexer';
import { segmentNotion, trierParPriorite } from '../content';

/** Le chapitre-témoin, tel que le charge `content.ts` avec VITE_TEMOIN=1. */
const brut = import.meta.glob<unknown>('/tests/fixtures/terminale/**/*.json', {
  eager: true,
  import: 'default',
});
const temoin = (): FichierBrut[] =>
  Object.entries(brut).map(([chemin, donnees]) => ({
    chemin,
    donnees: structuredClone(donnees),
    temoin: true,
  }));

/** Même fichier, présenté comme du vrai contenu (content/terminale/). */
const commeContenu = (f: FichierBrut): FichierBrut => ({
  ...f,
  chemin: f.chemin.replace('/tests/fixtures/terminale/', '/content/terminale/'),
  temoin: false,
});

describe('chargeur de terminale — chapitre-témoin', () => {
  it('valide et charge les trois chapitres du témoin sans rien signaler', () => {
    const signaler = vi.fn();
    const index = indexerTerminale(temoin(), signaler);
    expect(signaler).not.toHaveBeenCalled();
    expect([...index.chapitres.keys()].sort()).toEqual([
      'temoin-maths',
      'temoin-methodes-maths',
      'temoin-physique-chimie',
    ]);
    const maths = index.chapitres.get('temoin-maths');
    expect(maths?.temoin).toBe(true);
    expect(maths?.cours?.sections).toHaveLength(3);
    expect(maths?.exercices.length).toBeGreaterThan(0);
    expect(maths?.typeBac.length).toBe(3);
    expect(index.chapitres.get('temoin-methodes-maths')?.meta.transverse).toBe(true);
  });

  it('couvre chaque type de bloc et chaque type de réponse', () => {
    const index = indexerTerminale(temoin(), vi.fn());
    const types = new Set([...index.blocs.values()].map(({ bloc }) => bloc.type));
    expect([...types].sort()).toEqual(
      [
        'anime', 'code', 'complement', 'definition', 'demonstration', 'exemple', 'experience', 'figure',
        'idee', 'lien-matiere', 'methode', 'piege', 'propriete', 'rappel', 'retenir', 'verifie',
      ].sort()
    );
    const reponses = new Set(
      [...index.chapitres.values()].flatMap((c) => [
        ...c.exercices.flatMap((x) => x.questions.map((q) => q.reponse?.type)),
        ...c.flash.map((f) => f.reponse.type),
      ])
    );
    for (const t of ['qcm', 'qcm-multiple', 'vrai-faux', 'numerique', 'ordre', 'redaction']) {
      expect(reponses.has(t as never), t).toBe(true);
    }
  });

  it('range les notions dans l\'ordre du cours et indexe notions, blocs, programme', () => {
    const index = indexerTerminale(temoin(), vi.fn());
    const notions = index.chapitres.get('temoin-maths')?.notions ?? [];
    expect(notions.map((n) => n.ordre)).toEqual([...notions.map((n) => n.ordre)].sort((a, b) => a - b));
    expect(index.notions.get('n-temoin-maths-alpha')?.chapitre).toBe('temoin-maths');
    expect(index.blocs.get('l-temoin-maths-007')?.notion).toBe('n-temoin-maths-alpha');
    expect(index.programme.get('bo-pc1-temoin-01')?.matiere).toBe('physique-chimie');
    expect(index.annales.get('maths')?.sujets).toHaveLength(1);
  });

  it('fait passer le vrai contenu avant le témoin quand un slug se répète', () => {
    const signaler = vi.fn();
    const fichiers = temoin();
    const vraiMeta = fichiers.filter((f) => f.chemin.includes('/chapitres/temoin-maths/')).map(commeContenu);
    const index = indexerTerminale([...fichiers, ...vraiMeta], signaler);
    expect(index.chapitres.get('temoin-maths')?.temoin).toBe(false);
    expect(signaler).toHaveBeenCalledWith(expect.stringContaining('existe déjà'), expect.anything());
  });

  it('ajoute les sujets d\'annales du témoin sans changer « complet »', () => {
    const fichiers = temoin();
    const annales = fichiers.find((f) => f.chemin.endsWith('/maths/annales.json'));
    if (!annales) throw new Error('annales du témoin introuvables');
    const vraies = commeContenu({ ...annales, donnees: { complet: true, depuis: 2021, sujets: [] } });
    const index = indexerTerminale([...fichiers, vraies], vi.fn());
    expect(index.annales.get('maths')?.complet).toBe(true);
    expect(index.annales.get('maths')?.sujets).toHaveLength(1);
  });

  it('écarte et signale une entrée invalide, un identifiant ou une ligne en double', () => {
    const fichiers = temoin();
    const exercices = fichiers.find((f) => f.chemin.endsWith('/temoin-maths/exercices.json'));
    const programme = fichiers.find((f) => f.chemin.endsWith('/maths/programme.json'));
    if (!exercices || !programme) throw new Error('fichiers du témoin introuvables');
    const liste = exercices.donnees as Record<string, unknown>[];
    const premier = liste[0] ?? {};
    liste.push({ ...premier }); // même identifiant
    liste.push({ ...premier, id: 'x-temoin-maths-999', niveau: 4 }); // invalide
    const lignes = programme.donnees as unknown[];
    lignes.push(lignes[0]);
    const signaler = vi.fn();
    const index = indexerTerminale(fichiers, signaler);
    const messages = signaler.mock.calls.map(([m]) => String(m));
    expect(messages.some((m) => m.includes('identifiant en double x-temoin-maths-001'))).toBe(true);
    expect(messages.some((m) => m.includes('entrée invalide'))).toBe(true);
    expect(messages.some((m) => m.includes('ligne en double bo-m-temoin-01'))).toBe(true);
    const ids = index.chapitres.get('temoin-maths')?.exercices.map((x) => x.id) ?? [];
    expect(ids).not.toContain('x-temoin-maths-999');
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('écarte un chapitre dont meta.json ne correspond pas à son dossier', () => {
    const fichiers = temoin().map((f) =>
      f.chemin.endsWith('/temoin-maths/meta.json')
        ? { ...f, donnees: { ...(f.donnees as object), slug: 'autre-slug' } }
        : f
    );
    const signaler = vi.fn();
    const index = indexerTerminale(fichiers, signaler);
    expect(index.chapitres.has('temoin-maths')).toBe(false);
    expect(signaler).toHaveBeenCalledWith(expect.stringContaining('≠ dossier'), expect.anything());
  });
});

describe('chargeur de terminale — accesseurs', () => {
  it('tire le segment d\'adresse de la fin de l\'identifiant de la notion', () => {
    expect(segmentNotion({ id: 'n-limites-suites-monotone-bornee', chapitre: 'limites-suites' })).toBe(
      'monotone-bornee'
    );
  });

  it('trie par priorité décroissante, puis ordre, puis rang dans le fichier', () => {
    const items = [
      { id: 'a', p: 1 as const, ordre: 10 },
      { id: 'b', p: 3 as const, ordre: 20 },
      { id: 'c', p: 3 as const, ordre: 10 },
      { id: 'd', p: 2 as const },
      { id: 'e', p: 2 as const },
    ];
    expect(trierParPriorite(items, (x) => x.p).map((x) => x.id)).toEqual(['c', 'b', 'd', 'e', 'a']);
  });
});
