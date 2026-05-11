import { describe, it, expect } from 'vitest';
import { shuffle, shuffleChoices } from '../randomizer';

describe('shuffle', () => {
  it('returns same elements in different order (seeded)', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr, 42);
    expect(result).toHaveLength(arr.length);
    expect(result.sort()).toEqual([...arr].sort());
  });

  it('is reproducible with the same seed', () => {
    const arr = ['a', 'b', 'c', 'd'];
    expect(shuffle(arr, 123)).toEqual(shuffle(arr, 123));
  });

  it('produces different orderings with different seeds', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    const r1 = shuffle(arr, 1);
    const r2 = shuffle(arr, 2);
    expect(r1).not.toEqual(r2);
  });

  it('does not mutate the input array', () => {
    const arr = [1, 2, 3];
    const original = [...arr];
    shuffle(arr, 7);
    expect(arr).toEqual(original);
  });
});

describe('shuffleChoices', () => {
  it('preserves the correct answer after shuffle', () => {
    const choices = ['Paris', 'Lyon', 'Marseille', 'Bordeaux'];
    const correctIndex = 2; // 'Marseille'
    const { choices: shuffled, correctIndex: newIndex } = shuffleChoices(choices, correctIndex);
    expect(shuffled[newIndex]).toBe('Marseille');
  });

  it('contains all original choices', () => {
    const choices = ['a', 'b', 'c'];
    const { choices: shuffled } = shuffleChoices(choices, 0);
    expect(shuffled.sort()).toEqual([...choices].sort());
  });

  it('new correctIndex is within bounds', () => {
    const choices = ['x', 'y', 'z'];
    const { choices: shuffled, correctIndex: newIdx } = shuffleChoices(choices, 1);
    expect(newIdx).toBeGreaterThanOrEqual(0);
    expect(newIdx).toBeLessThan(shuffled.length);
  });
});
