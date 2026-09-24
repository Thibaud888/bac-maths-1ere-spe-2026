import EmptyState from '@/components/shared/EmptyState';

export default function PhysiqueChimiePage() {
  return (
    <EmptyState
      accent="violet"
      title="Physique-chimie — spécialité, terminale"
      lead="Même chemin qu’en maths, du cours à l’épreuve. Unités, chiffres significatifs et démarche expérimentale y tiennent une place à part."
      planned={[
        {
          label: 'Aperçu',
          description: 'Les notions du chapitre, les incontournables en tête, et où tu en es.',
        },
        {
          label: 'Cours',
          description: 'Notion par notion : l’idée, la loi, des exemples pas à pas, les expériences.',
        },
        {
          label: 'Exercices',
          description: 'Trois marches : comprendre, s’entraîner, approfondir — avec indices.',
        },
        {
          label: 'Type bac',
          description: 'Exercices avec documents, au format de l’écrit, barème compris.',
        },
        {
          label: 'Mémo',
          description: 'Relations, unités et méthodes à garder sous les yeux, et questions éclair.',
        },
        {
          label: 'Épreuve pratique',
          description: 'Les capacités expérimentales, les protocoles et les incertitudes.',
        },
      ]}
    />
  );
}
