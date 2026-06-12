import type { EntretienCategory, GrammairePoint } from '@/francais/lib/french-types';

export const grammairePointLabel: Record<GrammairePoint, string> = {
  'subordonnee-relative': 'Subordonnée relative',
  'subordonnee-completive': 'Subordonnée complétive',
  'subordonnee-circonstancielle': 'Subordonnée circonstancielle',
  interrogation: "L'interrogation",
  negation: 'La négation',
};

export const entretienCategoryLabel: Record<EntretienCategory, string> = {
  'choix-oeuvre': "Choix de l'œuvre",
  comprehension: 'Compréhension',
  interpretation: 'Interprétation',
  'gout-personnel': 'Goût personnel',
  culture: 'Culture',
  ouverture: 'Ouverture',
};
