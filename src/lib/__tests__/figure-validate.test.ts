import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import figureSchema from '../../../schemas/figure.schema.json';
import classicSchema from '../../../schemas/classic-exercise.schema.json';
import examSchema from '../../../schemas/exam-exercise.schema.json';

const ajv = new Ajv({ allErrors: true, strict: false });
ajv.addSchema(figureSchema, 'figure.schema.json');
const validateFigure = ajv.compile(figureSchema);
const validateClassic = ajv.compile(classicSchema);
const validateExam = ajv.compile(examSchema);

describe('figure schema — valid fixtures', () => {
  it('accepts a valid image figure', () => {
    const fig = {
      type: 'image',
      data: { src: 'probas-cond/arbre.svg', alt: 'Arbre pondéré' },
    };
    expect(validateFigure(fig)).toBe(true);
  });

  it('accepts an image figure with optional fields', () => {
    const fig = {
      type: 'image',
      data: { src: 'derivation/tangente.png', alt: 'Tangente', width: 400, height: 300 },
      caption: 'Courbe et tangente en a',
    };
    expect(validateFigure(fig)).toBe(true);
  });

  it('accepts a simple tree figure', () => {
    const fig = {
      type: 'tree',
      data: {
        root: {
          label: 'Ω',
          children: [
            { label: 'A', weight: '0,6' },
            { label: 'B', weight: '0,4' },
          ],
        },
      },
    };
    expect(validateFigure(fig)).toBe(true);
  });

  it('accepts a 3-level tree with LaTeX weights', () => {
    const fig = {
      type: 'tree',
      data: {
        root: {
          label: 'Ω',
          children: [
            {
              label: 'A',
              weight: '$\\frac{1}{3}$',
              children: [
                { label: 'D', weight: '$\\frac{1}{4}$' },
                { label: '$\\overline{D}$', weight: '$\\frac{3}{4}$' },
              ],
            },
            { label: 'B', weight: '$\\frac{2}{3}$', children: [
              { label: 'D', weight: '0' },
              { label: '$\\overline{D}$', weight: '1' },
            ]},
          ],
        },
        orientation: 'horizontal',
      },
    };
    expect(validateFigure(fig)).toBe(true);
  });
});

describe('figure schema — invalid fixtures', () => {
  it('rejects unknown type', () => {
    const fig = { type: 'graph', data: {} };
    expect(validateFigure(fig)).toBe(false);
  });

  it('rejects image with missing alt', () => {
    const fig = { type: 'image', data: { src: 'test/img.svg' } };
    expect(validateFigure(fig)).toBe(false);
  });

  it('rejects tree with missing root', () => {
    const fig = { type: 'tree', data: { orientation: 'horizontal' } };
    expect(validateFigure(fig)).toBe(false);
  });

  it('rejects image src with wrong extension', () => {
    const fig = { type: 'image', data: { src: 'test/img.gif', alt: 'test' } };
    expect(validateFigure(fig)).toBe(false);
  });
});

describe('figure in classic exercise schema', () => {
  const baseExercise = {
    id: 'c-suites-001',
    chapter: 'suites',
    title: 'Exercice test',
    difficulty: 1,
    estimatedMinutes: 5,
    questions: [
      {
        id: 'q1',
        label: '1.',
        statement: 'Calculer $u_3$.',
        hints: ['Utiliser la formule.'],
        solution: 'On a $u_3 = 2$.',
      },
    ],
  };

  it('accepts exercise without figure', () => {
    expect(validateClassic(baseExercise)).toBe(true);
  });

  it('accepts exercise with root-level image figure', () => {
    const ex = {
      ...baseExercise,
      figure: { type: 'image', data: { src: 'suites/graphe.svg', alt: 'Graphe' } },
    };
    expect(validateClassic(ex)).toBe(true);
  });

  it('accepts exercise with question-level tree figure', () => {
    const ex = {
      ...baseExercise,
      questions: [
        {
          ...baseExercise.questions[0],
          figure: {
            type: 'tree',
            data: { root: { label: 'Ω', children: [{ label: 'A' }] } },
          },
        },
      ],
    };
    expect(validateClassic(ex)).toBe(true);
  });
});

describe('figure in exam exercise schema', () => {
  const baseExam = {
    id: 'e-suites-001',
    chapter: 'suites',
    title: 'Exercice type bac',
    difficulty: 2,
    estimatedMinutes: 20,
    totalMarks: 6,
    questions: [
      {
        id: 'q1',
        label: '1.',
        statement: 'Calculer.',
        marks: 3,
        hints: ['Indice.'],
        solution: 'La solution.',
        subquestions: [
          {
            id: 'q1a',
            label: 'a)',
            statement: 'Première sous-question.',
            hints: ['Aide.'],
            solution: 'Réponse a.',
          },
        ],
      },
    ],
  };

  it('accepts exam exercise without figure', () => {
    expect(validateExam(baseExam)).toBe(true);
  });

  it('accepts exam exercise with subquestion-level tree figure', () => {
    const ex = {
      ...baseExam,
      questions: [
        {
          ...baseExam.questions[0],
          subquestions: [
            {
              ...baseExam.questions[0]!.subquestions![0],
              figure: {
                type: 'tree',
                data: {
                  root: { label: 'Ω', children: [{ label: 'A', weight: '0,5' }] },
                },
              },
            },
          ],
        },
      ],
    };
    expect(validateExam(ex)).toBe(true);
  });
});
