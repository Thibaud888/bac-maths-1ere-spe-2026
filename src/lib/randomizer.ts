/**
 * Fisher-Yates shuffle. Avec seed : reproductible (LCG simple).
 * Sans seed : vraiment aléatoire via Math.random.
 */
export function shuffle<T>(array: readonly T[], seed?: number): T[] {
  const result = [...array];
  const rng = seed === undefined ? Math.random : lcg(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = result[i] as T;
    result[i] = result[j] as T;
    result[j] = tmp;
  }
  return result;
}

function lcg(seed: number): () => number {
  let state = seed >>> 0 || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

/**
 * Mélange un tableau de choix QCM en gardant la trace de la nouvelle position
 * de la réponse correcte d'origine.
 */
export function shuffleChoices<T>(
  choices: readonly T[],
  correctIndex: number
): { choices: T[]; correctIndex: number } {
  const indexed = choices.map((c, i) => ({ c, i }));
  const shuffled = shuffle(indexed);
  return {
    choices: shuffled.map((x) => x.c),
    correctIndex: shuffled.findIndex((x) => x.i === correctIndex),
  };
}
