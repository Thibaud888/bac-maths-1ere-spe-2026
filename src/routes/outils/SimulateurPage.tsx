import EmptyState from '@/components/shared/EmptyState';

export default function SimulateurPage() {
  return (
    <EmptyState
      accent="sky"
      title="Simulateur de moyenne"
      lead="Régler ses notes — figées quand elles sont connues, variables sinon — et voir aussitôt la moyenne, la mention et les matières sur lesquelles il reste le plus à gagner."
      planned={[
        { label: 'Notes', description: 'Un curseur par matière, avec verrou pour les notes déjà obtenues.' },
        { label: 'Moyenne et mention', description: 'Recalculées à chaque changement.' },
        { label: 'Répartition', description: 'Le poids de chaque matière, vu de plusieurs façons.' },
        { label: 'Leviers', description: 'Les points les plus rentables à aller chercher.' },
      ]}
      footnote="À reprendre du dépôt notes-bac-visualisateur, qui fait déjà tout cela ; les coefficients y sont sourcés sur les textes officiels."
    />
  );
}
