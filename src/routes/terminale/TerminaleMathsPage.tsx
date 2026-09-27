import EmptyState from '@/components/shared/EmptyState';

export default function TerminaleMathsPage() {
  return (
    <EmptyState
      accent="blue"
      title="Maths — spécialité, terminale"
      lead="Chaque chapitre se suit de bout en bout : apprendre le cours, s’entraîner par marches, puis préparer l’épreuve. Les notions qui tombent le plus souvent au bac passent devant."
      planned={[
        {
          label: 'Aperçu',
          description: 'Les notions du chapitre, les incontournables en tête, et où tu en es.',
        },
        {
          label: 'Cours',
          description: 'Notion par notion : l’idée, la règle, des exemples pas à pas, les pièges.',
        },
        {
          label: 'Exercices',
          description: 'Trois marches : comprendre, s’entraîner, approfondir — avec indices.',
        },
        {
          label: 'Type bac',
          description: 'Exercices au format de l’épreuve, avec barème et attentes du correcteur.',
        },
        {
          label: 'Mémo',
          description: 'Formules et méthodes à garder sous les yeux, et questions éclair.',
        },
      ]}
    />
  );
}
