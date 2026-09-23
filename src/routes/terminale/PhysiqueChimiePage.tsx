import EmptyState from '@/components/shared/EmptyState';

export default function PhysiqueChimiePage() {
  return (
    <EmptyState
      accent="violet"
      title="Physique-chimie — spécialité, terminale"
      lead="Même principe qu’en maths, avec une différence : les automatismes laissent la place aux méthodes-types, qui sont le vrai enjeu de l’épreuve."
      planned={[
        {
          label: 'Formulaire',
          description: 'Relations, unités et constantes, regroupées par thème.',
        },
        {
          label: 'Méthodes',
          description: 'Les démarches qui reviennent : bilan d’énergie, dosage, cinétique…',
        },
        {
          label: 'Exercices',
          description: 'Applications directes, avec correction progressive.',
        },
        {
          label: 'Type bac',
          description: 'Exercices longs au format de l’épreuve écrite.',
        },
      ]}
    />
  );
}
