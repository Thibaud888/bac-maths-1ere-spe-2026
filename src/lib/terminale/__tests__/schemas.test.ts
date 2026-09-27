import Ajv from 'ajv';
import { describe, expect, it } from 'vitest';
import figurePremiere from '../../../../schemas/figure.schema.json';
import { validateurs, validerFigure } from '../validate';

const image = (src: string) => ({ type: 'image', data: { src, alt: 'Courbe de la suite' } });

describe('schémas de terminale — figure', () => {
  it('accepte une image rangée par matière et par chapitre', () => {
    expect(validerFigure(image('terminale/maths/limites-suites/suite.svg'))).toBe(true);
    expect(validerFigure(image('terminale/physique-chimie/acides-bases/titrage.png'))).toBe(true);
  });

  it('refuse un chemin de première ou une matière inconnue', () => {
    expect(validerFigure(image('suites/suite.svg'))).toBe(false);
    expect(validerFigure(image('terminale/svt/cellule/cellule.svg'))).toBe(false);
  });

  it('laisse le schéma de première inchangé : un seul niveau de dossier', () => {
    const ajv = new Ajv({ allErrors: true, strict: false });
    const premiere = ajv.compile(figurePremiere);
    expect(premiere(image('suites/suite.svg'))).toBe(true);
    expect(premiere(image('terminale/maths/limites-suites/suite.svg'))).toBe(false);
  });
});

describe('schémas de terminale — programme, meta, notions', () => {
  const ligne = {
    id: 'bo-m-suites-07',
    chapitre: 'limites-suites',
    partie: 'Analyse',
    section: 'Suites',
    rubrique: 'capacite',
    exigible: true,
    texte: 'Texte exact.',
    premiere: false,
  };

  it('accepte une ligne du programme conforme à la charte', () => {
    expect(validateurs.programme(ligne)).toBe(true);
  });

  it('refuse un approfondissement exigible', () => {
    expect(validateurs.programme({ ...ligne, rubrique: 'approfondissement' })).toBe(false);
  });

  it('réserve le préfixe bo-pc1- aux acquis de première, et exige un chapitre sinon', () => {
    expect(validateurs.programme({ ...ligne, id: 'bo-pc1-ondes-01', premiere: false })).toBe(false);
    const { chapitre: _chapitre, ...sansChapitre } = ligne;
    expect(validateurs.programme(sansChapitre)).toBe(false);
    expect(validateurs.programme({ ...sansChapitre, id: 'bo-pc1-ondes-01', premiere: true })).toBe(true);
  });

  const meta = {
    slug: 'limites-suites',
    matiere: 'maths',
    titre: 'Limites de suites',
    titreCourt: 'Limites de suites',
    domaine: 'analyse',
    ordre: 20,
    transverse: false,
    description: 'Une phrase.',
    essentiel: ['Une.', 'Deux.', 'Trois.'],
  };

  it('exige un domaine de la bonne matière pour un chapitre ordinaire', () => {
    expect(validateurs.meta(meta)).toBe(true);
    expect(validateurs.meta({ ...meta, domaine: 'ondes' })).toBe(false);
    const { domaine: _domaine, ...sansDomaine } = meta;
    expect(validateurs.meta(sansDomaine)).toBe(false);
    expect(validateurs.meta({ ...sansDomaine, slug: 'methodes-maths', transverse: true })).toBe(true);
  });

  it('refuse un ordre qui n\'est pas un multiple de 10', () => {
    expect(validateurs.meta({ ...meta, ordre: 25 })).toBe(false);
  });

  it('exige une priorité 1, 2 ou 3 et au plus trois attendus du bac', () => {
    const notion = {
      id: 'n-limites-suites-monotone-bornee',
      chapitre: 'limites-suites',
      titre: 'Suite croissante et majorée',
      ordre: 50,
      priorite: 3,
      priorisation: 'estimation',
      pourquoi: 'Indispensable pour étudier une suite.',
      capacites: ['bo-m-suites-07'],
      prerequis: ['1e:suites'],
      attendusBac: [],
    };
    expect(validateurs.notions(notion)).toBe(true);
    expect(validateurs.notions({ ...notion, priorite: 4 })).toBe(false);
    expect(validateurs.notions({ ...notion, attendusBac: ['a b', 'c d', 'e f', 'g h'] })).toBe(false);
    expect(validateurs.notions({ ...notion, prerequis: ['suites'] })).toBe(false);
  });
});

describe('schémas de terminale — cours', () => {
  const cours = (bloc: Record<string, unknown>) => ({
    chapitre: 'limites-suites',
    sections: [{ notion: 'n-limites-suites-a', blocs: [bloc] }],
  });

  it('exige capacites sur un bloc formel, pas sur un bloc « idée »', () => {
    const definition = { id: 'l-limites-suites-001', type: 'definition', titre: 'D', texte: 'T' };
    expect(validateurs.cours(cours(definition))).toBe(false);
    expect(validateurs.cours(cours({ ...definition, capacites: ['bo-m-suites-07'] }))).toBe(true);
    expect(validateurs.cours(cours({ id: 'l-limites-suites-002', type: 'idee', texte: 'T' }))).toBe(true);
  });

  it('refuse un champ étranger au type du bloc', () => {
    expect(validateurs.cours(cours({ id: 'l-limites-suites-002', type: 'idee', texte: 'T', etapes: [] }))).toBe(false);
  });

  it('refuse une réponse à rédiger dans un bloc « vérifie »', () => {
    const verifie = (reponse: unknown) => ({
      id: 'l-limites-suites-003',
      type: 'verifie',
      question: { enonce: 'Q', reponse, explication: 'E' },
    });
    expect(validateurs.cours(cours(verifie({ type: 'vrai-faux', valeur: true, justification: 'J' })))).toBe(true);
    expect(validateurs.cours(cours(verifie({ type: 'redaction' })))).toBe(false);
  });

  it('garde le code dans un champ à part, en Python seulement', () => {
    const code = (langage: string) => ({
      id: 'l-limites-suites-004',
      type: 'code',
      titre: 'Seuil',
      texte: 'Renvoie le rang.',
      capacites: ['bo-m-suites-07'],
      code: { langage, source: 'print(2 ** 10)' },
    });
    expect(validateurs.cours(cours(code('python')))).toBe(true);
    expect(validateurs.cours(cours(code('javascript')))).toBe(false);
  });

  it('refuse un identifiant de bloc mal formé', () => {
    expect(validateurs.cours(cours({ id: 'l-limites-suites-4', type: 'idee', texte: 'T' }))).toBe(false);
  });
});

describe('schémas de terminale — réponses, exercices, type bac, éclair', () => {
  const exercice = (reponse: unknown) => ({
    id: 'x-limites-suites-001',
    chapitre: 'limites-suites',
    niveau: 1,
    notions: ['n-limites-suites-a'],
    capacites: ['bo-m-suites-07'],
    titre: 'Essai',
    duree: 3,
    calculatrice: false,
    ordre: 10,
    questions: [{ id: 'q1', label: '1.', enonce: 'Q', reponse, solution: 'S' }],
  });

  it('exige exactement une tolérance sur une réponse numérique', () => {
    expect(validateurs.exercices(exercice({ type: 'numerique', valeur: 2, tolerance: 0 }))).toBe(true);
    expect(validateurs.exercices(exercice({ type: 'numerique', valeur: '1/3', toleranceRelative: 0.01 }))).toBe(true);
    expect(validateurs.exercices(exercice({ type: 'numerique', valeur: 2 }))).toBe(false);
    expect(
      validateurs.exercices(exercice({ type: 'numerique', valeur: 2, tolerance: 0, toleranceRelative: 0.1 }))
    ).toBe(false);
    expect(validateurs.exercices(exercice({ type: 'numerique', valeur: '1,5', tolerance: 0 }))).toBe(false);
  });

  it('borne un QCM à 2-5 choix et accepte une réponse à rédiger dans un exercice', () => {
    expect(validateurs.exercices(exercice({ type: 'qcm', choix: ['a'], bonne: 0 }))).toBe(false);
    expect(validateurs.exercices(exercice({ type: 'qcm', choix: ['a', 'b'], bonne: 0 }))).toBe(true);
    expect(validateurs.exercices(exercice({ type: 'redaction' }))).toBe(true);
    expect(validateurs.exercices(exercice({ type: 'dessin' }))).toBe(false);
  });

  it('exige une source (annale ou adresse) quand l\'exercice adapte un sujet', () => {
    const avec = (source: unknown) => ({ ...exercice({ type: 'redaction' }), source });
    expect(validateurs.exercices(avec({ annale: 'an-2024-metropole-j1', adaptation: 'données modifiées' }))).toBe(true);
    expect(validateurs.exercices(avec({ url: 'https://example.org/s.pdf', adaptation: 'données modifiées' }))).toBe(true);
    expect(validateurs.exercices(avec({ adaptation: 'données modifiées' }))).toBe(false);
  });

  it('type bac : sous-questions ou solution propre, jamais les deux', () => {
    const base = {
      id: 'tb-limites-suites-001',
      chapitre: 'limites-suites',
      notions: ['n-limites-suites-a'],
      capacites: ['bo-m-suites-07'],
      titre: 'Essai',
      points: 5,
      duree: 45,
      calculatrice: true,
      ordre: 10,
    };
    const sq = (id: string) => ({ id, label: 'a)', enonce: 'Q', points: 2.5, attenduCorrecteur: 'A', solution: 'S' });
    const decoupee = { id: 'q1', label: '1.', enonce: 'Q', points: 5, sousQuestions: [sq('q1a'), sq('q1b')] };
    expect(validateurs['type-bac']({ ...base, questions: [decoupee] })).toBe(true);
    expect(validateurs['type-bac']({ ...base, questions: [{ ...decoupee, solution: 'S' }] })).toBe(false);
    const simple = { id: 'q1', label: '1.', enonce: 'Q', points: 5 };
    expect(validateurs['type-bac']({ ...base, questions: [simple] })).toBe(false);
    expect(
      validateurs['type-bac']({ ...base, questions: [{ ...simple, attenduCorrecteur: 'A', solution: 'S' }] })
    ).toBe(true);
  });

  it('question éclair : moins de 60 secondes, jamais à rédiger', () => {
    const flash = {
      id: 'fl-limites-suites-puissance',
      chapitre: 'limites-suites',
      notion: 'n-limites-suites-a',
      capacites: ['bo-m-suites-07'],
      enonce: 'Q',
      reponse: { type: 'vrai-faux', valeur: true, justification: 'J' },
      explication: 'E',
      duree: 30,
    };
    expect(validateurs.flash(flash)).toBe(true);
    expect(validateurs.flash({ ...flash, duree: 90 })).toBe(false);
    expect(validateurs.flash({ ...flash, reponse: { type: 'redaction' } })).toBe(false);
  });
});
