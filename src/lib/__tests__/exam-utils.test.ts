import { describe, it, expect } from 'vitest';
import { leafIds } from '../exam-utils';
import type { ExamExercise } from '../types';

function makeExercise(
  questions: { id: string; subquestions?: { id: string }[] }[]
): ExamExercise {
  return {
    id: 'e-test-001',
    chapter: 'derivation',
    title: 'Test',
    difficulty: 1,
    estimatedMinutes: 20,
    totalMarks: 5,
    questions: questions.map((q) => ({
      id: q.id,
      label: q.id,
      statement: 'test',
      marks: 1,
      hints: ['hint'],
      solution: 'solution',
      ...(q.subquestions
        ? {
            subquestions: q.subquestions.map((sq) => ({
              id: sq.id,
              label: sq.id,
              statement: 'sq test',
              hints: ['hint'],
              solution: 'sq solution',
            })),
          }
        : {}),
    })),
  };
}

describe('leafIds', () => {
  it('returns top-level question ids when no subquestions', () => {
    const exo = makeExercise([{ id: 'q1' }, { id: 'q2' }, { id: 'q3' }]);
    expect(leafIds(exo)).toEqual([
      'e-test-001::q1',
      'e-test-001::q2',
      'e-test-001::q3',
    ]);
  });

  it('returns subquestion ids when subquestions are present', () => {
    const exo = makeExercise([
      { id: 'q1', subquestions: [{ id: 'q1a' }, { id: 'q1b' }] },
      { id: 'q2', subquestions: [{ id: 'q2a' }] },
    ]);
    expect(leafIds(exo)).toEqual([
      'e-test-001::q1a',
      'e-test-001::q1b',
      'e-test-001::q2a',
    ]);
  });

  it('mixes top-level and subquestion ids', () => {
    const exo = makeExercise([
      { id: 'q1' },
      { id: 'q2', subquestions: [{ id: 'q2a' }, { id: 'q2b' }] },
    ]);
    expect(leafIds(exo)).toEqual([
      'e-test-001::q1',
      'e-test-001::q2a',
      'e-test-001::q2b',
    ]);
  });

  it('returns empty array for exercise with no questions', () => {
    const exo = makeExercise([]);
    expect(leafIds(exo)).toEqual([]);
  });
});
