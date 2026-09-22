import EmptyState from '@/components/shared/EmptyState';

export default function QuestionsPage() {
  return (
    <EmptyState
      accent="amber"
      title="Mes 2 questions"
      lead="Les deux questions présentées au jury, adossées aux spécialités. Cette page gardera leur formulation, leur plan et les sources utilisées."
      planned={[
        { label: 'Question 1', description: 'Formulation, angle choisi, plan de la réponse.' },
        { label: 'Question 2', description: 'Idem, sur l’autre spécialité ou le croisement des deux.' },
        { label: 'Pourquoi ces questions', description: 'Le lien avec le parcours et le projet d’orientation.' },
        { label: 'Sources', description: 'Ce sur quoi s’appuie chaque réponse.' },
      ]}
      footnote="Page personnelle : son contenu dépend des questions réellement choisies."
    />
  );
}
