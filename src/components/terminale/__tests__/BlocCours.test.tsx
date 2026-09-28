import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import coursMaths from '../../../../tests/fixtures/terminale/maths/chapitres/temoin-maths/cours.json';
import coursPc from '../../../../tests/fixtures/terminale/physique-chimie/chapitres/temoin-physique-chimie/cours.json';
import type { Bloc, Cours } from '@/lib/terminale/types';
import BlocCours from '../BlocCours';

const blocs: Bloc[] = [...(coursMaths as Cours).sections, ...(coursPc as Cours).sections].flatMap(
  (s) => s.blocs
);

function afficher(bloc: Bloc, onVerifie = vi.fn()) {
  return render(
    <MemoryRouter>
      <BlocCours bloc={bloc} accent="blue" cheminCourant="/essai" onVerifie={onVerifie} />
    </MemoryRouter>
  );
}

function bloc(id: string): Bloc {
  const trouve = blocs.find((b) => b.id === id);
  if (!trouve) throw new Error(`bloc ${id} absent du témoin`);
  return trouve;
}

describe('BlocCours', () => {
  it('affiche chacun des seize types de bloc du chapitre-témoin', () => {
    const types = new Set(blocs.map((b) => b.type));
    expect(types.size).toBe(16);
    for (const b of blocs) {
      const { container, unmount } = afficher(b);
      expect(container.querySelector(`#${b.id}`)).not.toBeNull();
      unmount();
    }
  });

  it('garde le code en chasse fixe, sans l’interpréter', () => {
    const { container } = afficher(bloc('l-temoin-maths-017'));
    const code = container.querySelector('pre code');
    expect(code?.textContent).toContain('u = 2 * u + 1  # un ** Python reste du code');
    expect(container.querySelector('pre strong')).toBeNull();
  });

  it('dévoile un exemple étape par étape, ou d’un coup', () => {
    const { container } = afficher(bloc('l-temoin-maths-004'));
    expect(container.querySelectorAll('ol > li')).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Voir la première étape' }));
    expect(container.querySelectorAll('ol > li')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Tout afficher' }));
    expect(container.querySelectorAll('ol > li')).toHaveLength(3);
    expect(screen.queryByRole('button', { name: 'Tout afficher' })).toBeNull();
  });

  it('corrige un « vérifie » et le signale', () => {
    const onVerifie = vi.fn();
    afficher(bloc('l-temoin-maths-005'), onVerifie);
    fireEvent.click(screen.getByRole('button', { name: /^A\./ }));
    fireEvent.click(screen.getByRole('button', { name: 'Valider' }));
    expect(screen.getByRole('status')).toHaveTextContent('Pas tout à fait');
    expect(screen.getByRole('status')).toHaveTextContent('Message d\'essai : c\'est');
    expect(onVerifie).toHaveBeenLastCalledWith('l-temoin-maths-005', false);
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer' }));
    fireEvent.click(screen.getByRole('button', { name: /^B\./ }));
    fireEvent.click(screen.getByRole('button', { name: 'Valider' }));
    expect(screen.getByRole('status')).toHaveTextContent('Juste');
    expect(onVerifie).toHaveBeenLastCalledWith('l-temoin-maths-005', true);
  });

  it('accepte une réponse numérique en fraction', () => {
    const onVerifie = vi.fn();
    afficher(bloc('l-temoin-maths-009'), onVerifie);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '10/2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Valider' }));
    expect(onVerifie).toHaveBeenLastCalledWith('l-temoin-maths-009', true);
  });

  it('replie la démonstration non exigible, titre visible', () => {
    const nonExigible = blocs.find((b) => b.type === 'demonstration' && !b.exigible);
    if (!nonExigible) return;
    const { container } = afficher(nonExigible);
    expect(container.querySelector('details')).not.toBeNull();
  });

  it('affiche un message de repli pour une figure animée inconnue', () => {
    afficher(bloc('l-temoin-maths-025'));
    expect(screen.getByText('Cette figure animée n’est pas encore disponible.')).toBeInTheDocument();
  });
});
