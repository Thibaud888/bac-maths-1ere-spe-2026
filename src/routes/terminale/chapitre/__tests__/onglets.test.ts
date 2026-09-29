import { describe, expect, it } from 'vitest';
import type { Chapitre } from '@/lib/terminale/types';
import { ongletsChapitre } from '../ChapitreLayout';

function chapitre(transverse: boolean): Chapitre {
  return {
    meta: { matiere: 'maths', slug: transverse ? 'methodes' : 'essai', transverse },
  } as unknown as Chapitre;
}

describe('onglets d’un chapitre', () => {
  it('placent le mémo juste après le cours, avant les exercices', () => {
    expect(ongletsChapitre(chapitre(false)).map((o) => o.label)).toEqual([
      'Aperçu',
      'Cours',
      'Mémo',
      'Exercices',
      'Type bac',
    ]);
  });

  it('n’ont pas de type bac pour le chapitre « Méthodes »', () => {
    expect(ongletsChapitre(chapitre(true)).map((o) => o.label)).toEqual(['Aperçu', 'Cours', 'Mémo', 'Exercices']);
  });
});
