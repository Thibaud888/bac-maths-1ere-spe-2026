import EmptyState from '@/components/shared/EmptyState';

export default function PreparationPage() {
  return (
    <EmptyState
      accent="amber"
      title="Préparation"
      lead="Comment construire l’exposé : trouver l’angle, bâtir le plan, préparer le support, et travailler la prise de parole."
      planned={[
        { label: 'Trouver l’angle', description: 'Transformer un thème en vraie question.' },
        { label: 'Construire le plan', description: 'Les structures qui tiennent en quelques minutes.' },
        { label: 'Le support', description: 'Ce qu’on a le droit de préparer, et ce qui sert vraiment.' },
        { label: 'La voix et le corps', description: 'Débit, regard, posture : ce qui s’entraîne.' },
      ]}
    />
  );
}
