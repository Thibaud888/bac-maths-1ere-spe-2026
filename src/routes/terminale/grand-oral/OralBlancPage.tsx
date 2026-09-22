import EmptyState from '@/components/shared/EmptyState';

export default function OralBlancPage() {
  return (
    <EmptyState
      accent="amber"
      title="Oral blanc"
      lead="S’entraîner dans les conditions de l’épreuve : minuteur, questions tirées au sort, et grille d’auto-évaluation à la fin."
      planned={[
        { label: 'Minuteur', description: 'Le temps de chaque phase, comme le jour J.' },
        { label: 'Tirage', description: 'Une des deux questions, choisie au hasard.' },
        { label: 'Questions de jury', description: 'Relances tirées de la page Entretien.' },
        { label: 'Auto-évaluation', description: 'Ce qui a tenu, ce qui a lâché.' },
      ]}
      footnote="Reprendra le simulateur déjà en place pour l’oral de français."
    />
  );
}
