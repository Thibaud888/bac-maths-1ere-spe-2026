import EmptyState from '@/components/shared/EmptyState';

export default function EpreuvePage() {
  return (
    <EmptyState
      accent="amber"
      title="L’épreuve"
      lead="Ce qui se passe le jour J : le déroulé minute par minute, ce que le jury attend à chaque temps, et la façon dont la note est construite."
      planned={[
        { label: 'Le déroulé', description: 'Les temps de l’épreuve, dans l’ordre.' },
        { label: 'Le jury', description: 'Qui il est, ce qu’il évalue.' },
        { label: 'La préparation du jour', description: 'Ce qui est autorisé, ce qui ne l’est pas.' },
        { label: 'La grille', description: 'Les critères d’évaluation officiels.' },
      ]}
      footnote="Le contenu sera repris des textes officiels en vigueur pour la session 2027."
    />
  );
}
