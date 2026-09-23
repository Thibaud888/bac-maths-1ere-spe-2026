import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { TEMPS_ID, fichesOfSection, listGrandOralTemps } from '@/lib/grand-oral-content';
import { typographie } from '@/lib/typographie';
import ExposePage from '../ExposePage';

function afficher() {
  render(
    <MemoryRouter>
      <ExposePage />
    </MemoryRouter>
  );
}

describe('page « Exposé » du grand oral', () => {
  it('affiche la durée de l’exposé lue dans le déroulé officiel, sans la recopier', () => {
    afficher();
    const expose = listGrandOralTemps().find((t) => t.id === TEMPS_ID.expose);
    expect(expose?.minutes).toBeDefined();
    // « 10 min », avec une espace insécable entre le nombre et l’unité.
    expect(screen.getByText(new RegExp(`^${expose?.minutes}\\s+min$`))).toBeInTheDocument();
    expect(screen.getByText(typographie(expose?.resume ?? ''))).toBeInTheDocument();
  });

  it('affiche chaque fiche de la section, règles officielles comprises', () => {
    afficher();
    const fiches = fichesOfSection('expose');
    expect(fiches.some((f) => f.nature === 'reglementaire')).toBe(true);
    for (const fiche of fiches) {
      expect(screen.getByRole('heading', { name: new RegExp(typographie(fiche.title)) })).toBeInTheDocument();
    }
  });

  it('renvoie aux fiches de préparation plutôt que de les répéter', () => {
    afficher();
    const lien = screen.getByRole('link', { name: /La voix et le corps/ });
    expect(lien).toHaveAttribute('href', '/terminale/grand-oral/preparation#go-prep-voix');
  });
});
