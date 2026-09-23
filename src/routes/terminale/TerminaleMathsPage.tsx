import EmptyState from '@/components/shared/EmptyState';

export default function TerminaleMathsPage() {
  return (
    <EmptyState
      accent="blue"
      title="Maths — spécialité, terminale"
      lead="Comme en première : on choisit un chapitre, puis un mode de travail. Les chapitres apparaîtront dans le menu au fur et à mesure."
      planned={[
        {
          label: 'Formulaire',
          description: 'Les formules et théorèmes du chapitre, en cartes de référence.',
        },
        {
          label: 'Automatismes',
          description: 'Questions rapides à traiter de tête, pour ancrer les réflexes.',
        },
        {
          label: 'Classiques',
          description: 'Applications directes du cours, avec correction progressive.',
        },
        {
          label: 'Type bac',
          description: 'Exercices multi-questions au format de l’épreuve écrite.',
        },
      ]}
    />
  );
}
