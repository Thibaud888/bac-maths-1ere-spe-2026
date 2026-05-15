import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HintSystem from '../HintSystem';

const HINTS = ['Premier indice.', 'Deuxième indice.'];
const SOLUTION = 'Voici la solution complète.';

describe('HintSystem — état initial', () => {
  it('ne montre pas les indices avant le clic', () => {
    render(<HintSystem hints={HINTS} solution={SOLUTION} />);
    expect(screen.queryByText('Premier indice.')).not.toBeInTheDocument();
    expect(screen.queryByText('Deuxième indice.')).not.toBeInTheDocument();
  });

  it('montre le bouton du premier indice', () => {
    render(<HintSystem hints={HINTS} solution={SOLUTION} />);
    expect(screen.getByRole('button', { name: 'Indice 1' })).toBeInTheDocument();
  });

  it('montre le bouton "Voir la solution"', () => {
    render(<HintSystem hints={HINTS} solution={SOLUTION} />);
    expect(screen.getByRole('button', { name: 'Voir la solution' })).toBeInTheDocument();
  });

  it('ne montre pas la solution avant le clic', () => {
    render(<HintSystem hints={HINTS} solution={SOLUTION} />);
    expect(screen.queryByText('Voici la solution complète.')).not.toBeInTheDocument();
  });
});

describe('HintSystem — révélation des indices', () => {
  it('révèle le premier indice au clic', () => {
    render(<HintSystem hints={HINTS} solution={SOLUTION} />);
    fireEvent.click(screen.getByRole('button', { name: 'Indice 1' }));
    expect(screen.getByText('Premier indice.')).toBeInTheDocument();
  });

  it('passe au bouton "Indice 2" après avoir révélé le premier', () => {
    render(<HintSystem hints={HINTS} solution={SOLUTION} />);
    fireEvent.click(screen.getByRole('button', { name: 'Indice 1' }));
    expect(screen.getByRole('button', { name: 'Indice 2' })).toBeInTheDocument();
  });

  it('révèle le deuxième indice au deuxième clic', () => {
    render(<HintSystem hints={HINTS} solution={SOLUTION} />);
    fireEvent.click(screen.getByRole('button', { name: 'Indice 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Indice 2' }));
    expect(screen.getByText('Deuxième indice.')).toBeInTheDocument();
  });

  it('masque le bouton d\'indice quand tous les indices sont révélés', () => {
    render(<HintSystem hints={HINTS} solution={SOLUTION} />);
    fireEvent.click(screen.getByRole('button', { name: 'Indice 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Indice 2' }));
    expect(screen.queryByRole('button', { name: /Indice \d/ })).not.toBeInTheDocument();
  });
});

describe('HintSystem — révélation de la solution', () => {
  it('révèle la solution au clic', () => {
    render(<HintSystem hints={HINTS} solution={SOLUTION} />);
    fireEvent.click(screen.getByRole('button', { name: 'Voir la solution' }));
    expect(screen.getByText('Voici la solution complète.')).toBeInTheDocument();
  });

  it('masque les boutons d\'indice et solution après révélation', () => {
    render(<HintSystem hints={HINTS} solution={SOLUTION} />);
    fireEvent.click(screen.getByRole('button', { name: 'Voir la solution' }));
    expect(screen.queryByRole('button', { name: /Indice \d/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Voir la solution' })).not.toBeInTheDocument();
  });

  it('affiche la réponse attendue si fournie', () => {
    render(
      <HintSystem hints={[]} solution={SOLUTION} expectedAnswer="$x = 3$" />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Voir la solution' }));
    expect(screen.getByText('Réponse attendue')).toBeInTheDocument();
  });
});

describe('HintSystem — auto-évaluation', () => {
  it('montre les boutons d\'auto-évaluation après révélation si onSelfAssess fourni', () => {
    render(<HintSystem hints={HINTS} solution={SOLUTION} onSelfAssess={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Voir la solution' }));
    expect(screen.getByRole('button', { name: '✓ Je l\'ai réussi' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '✗ À retravailler' })).toBeInTheDocument();
  });

  it('ne montre pas les boutons d\'auto-évaluation sans onSelfAssess', () => {
    render(<HintSystem hints={HINTS} solution={SOLUTION} />);
    fireEvent.click(screen.getByRole('button', { name: 'Voir la solution' }));
    expect(screen.queryByRole('button', { name: /réussi/ })).not.toBeInTheDocument();
  });

  it('appelle onSelfAssess(true) au clic succès', () => {
    const onSelfAssess = vi.fn();
    render(<HintSystem hints={HINTS} solution={SOLUTION} onSelfAssess={onSelfAssess} />);
    fireEvent.click(screen.getByRole('button', { name: 'Voir la solution' }));
    fireEvent.click(screen.getByRole('button', { name: '✓ Je l\'ai réussi' }));
    expect(onSelfAssess).toHaveBeenCalledWith(true);
  });

  it('appelle onSelfAssess(false) au clic échec', () => {
    const onSelfAssess = vi.fn();
    render(<HintSystem hints={HINTS} solution={SOLUTION} onSelfAssess={onSelfAssess} />);
    fireEvent.click(screen.getByRole('button', { name: 'Voir la solution' }));
    fireEvent.click(screen.getByRole('button', { name: '✗ À retravailler' }));
    expect(onSelfAssess).toHaveBeenCalledWith(false);
  });

  it('masque les boutons d\'auto-évaluation après un choix', () => {
    render(<HintSystem hints={HINTS} solution={SOLUTION} onSelfAssess={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Voir la solution' }));
    fireEvent.click(screen.getByRole('button', { name: '✓ Je l\'ai réussi' }));
    expect(screen.queryByRole('button', { name: '✓ Je l\'ai réussi' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '✗ À retravailler' })).not.toBeInTheDocument();
  });

  it('réinitialise l\'état quand resetKey change', () => {
    const { rerender } = render(
      <HintSystem hints={HINTS} solution={SOLUTION} onSelfAssess={() => {}} resetKey="q1" />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Voir la solution' }));
    expect(screen.getByText('Voici la solution complète.')).toBeInTheDocument();

    rerender(
      <HintSystem hints={HINTS} solution={SOLUTION} onSelfAssess={() => {}} resetKey="q2" />
    );
    expect(screen.queryByText('Voici la solution complète.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Voir la solution' })).toBeInTheDocument();
  });
});
