import EmptyState from '@/components/shared/EmptyState';

export default function LeBacPage() {
  return (
    <EmptyState
      accent="sky"
      title="Le bac, mode d’emploi"
      lead="Ce qui compte, et combien : quelles matières se jouent en contrôle continu, lesquelles ont une épreuve, quand elles tombent, et comment la moyenne finale est calculée."
      planned={[
        { label: 'Les épreuves', description: 'Écrit, oral, pratique : qui passe quoi, et quand.' },
        { label: 'Le contrôle continu', description: 'Les matières évaluées sur les bulletins, et sur quelles années.' },
        { label: 'Les coefficients', description: 'Le poids de chaque bloc dans la note finale.' },
        { label: 'Le calendrier', description: 'Les dates des épreuves de la session 2027.' },
        { label: 'Les mentions', description: 'Les seuils, et le rattrapage.' },
        { label: 'Les options', description: 'Comment elles comptent, et ce qu’elles changent vraiment.' },
      ]}
      footnote="Chaque chiffre publié ici sera rattaché à sa source officielle (education.gouv.fr, éduscol)."
    />
  );
}
