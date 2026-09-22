import EmptyState from '@/components/shared/EmptyState';

export default function EntretienPage() {
  return (
    <EmptyState
      accent="amber"
      title="Entretien"
      lead="L’échange avec le jury : les questions qui reviennent, celles qui piègent, et de quoi préparer ses réponses à l’avance."
      planned={[
        { label: 'Questions sur la question', description: 'Approfondir, justifier, nuancer.' },
        { label: 'Questions de cours', description: 'Ce que le jury peut demander de redémontrer.' },
        { label: 'Projet d’orientation', description: 'Relier la question au parcours envisagé.' },
        { label: 'Réponses préparées', description: 'Une fiche par question, à réviser.' },
      ]}
    />
  );
}
