import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { THEMES } from '@/lib/themes';
import { useAppStore } from '@/stores/app-store';
import ThemePicker from '../ThemePicker';

afterEach(() => {
  useAppStore.setState({ theme: 'light' });
});

function ouvrir() {
  render(<ThemePicker />);
  fireEvent.click(screen.getByRole('button', { name: /Changer de thème/ }));
}

describe('ThemePicker', () => {
  it('propose tous les thèmes, l’actuel coché', () => {
    useAppStore.setState({ theme: 'papier' });
    ouvrir();
    const options = screen.getAllByRole('radio');
    expect(options).toHaveLength(THEMES.length);
    expect(screen.getByRole('radio', { name: /Papier/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /Clair/ })).toHaveAttribute('aria-checked', 'false');
  });

  it('enregistre le thème choisi et laisse la liste ouverte pour comparer', () => {
    ouvrir();
    fireEvent.click(screen.getByRole('radio', { name: /Tableau/ }));
    expect(useAppStore.getState().theme).toBe('tableau');
    expect(screen.getByRole('radiogroup', { name: /Thème/ })).toBeInTheDocument();
  });

  it('se ferme avec Échap', () => {
    ouvrir();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('radiogroup', { name: /Thème/ })).not.toBeInTheDocument();
  });
});
