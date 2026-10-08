import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import exercices from '../../../../tests/fixtures/terminale/maths/chapitres/temoin-maths/exercices.json';
import typeBac from '../../../../tests/fixtures/terminale/maths/chapitres/temoin-maths/type-bac.json';
import type { Exercice, ExerciceTypeBac } from '@/lib/terminale/types';
import ExerciceRunner from '../ExerciceRunner';
import QuestionVerifiable from '../QuestionVerifiable';
import TypeBacRunner from '../TypeBacRunner';

const liste = exercices as Exercice[];

function exercice(id: string): Exercice {
  const x = liste.find((e) => e.id === id);
  if (!x) throw new Error(id);
  return x;
}

describe('ExerciceRunner', () => {
  it('donne les indices un par un, puis la solution et l’auto-évaluation', () => {
    const onTermine = vi.fn();
    const x = exercice('x-temoin-maths-009');
    render(
      <MemoryRouter>
        <ExerciceRunner exercice={x} matiere="maths" onTermine={onTermine} />
      </MemoryRouter>
    );
    const premiere = x.questions[0];
    if (!premiere?.indices) throw new Error('indices attendus');
    fireEvent.click(screen.getAllByRole('button', { name: 'Indice 1 sur 3' })[0] as HTMLElement);
    expect(screen.getByText(premiere.indices[0] as string)).toBeInTheDocument();
    expect(screen.queryByText(premiere.indices[1] as string)).toBeNull();

    for (const bouton of screen.getAllByRole('button', { name: 'Voir la solution' })) fireEvent.click(bouton);
    const reussis = screen.getAllByRole('button', { name: '✓ Réussi' });
    expect(reussis).toHaveLength(x.questions.length);
    fireEvent.click(reussis[0] as HTMLElement);
    expect(onTermine).not.toHaveBeenCalled();
    fireEvent.click(screen.getAllByRole('button', { name: '✗ Raté' })[1] as HTMLElement);
    expect(onTermine).toHaveBeenLastCalledWith('moitie');
  });

  it('corrige tout de suite une question « Comprendre »', () => {
    const onTermine = vi.fn();
    render(
      <MemoryRouter>
        <ExerciceRunner exercice={exercice('x-temoin-maths-001')} matiere="maths" onTermine={onTermine} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /^B\./ }));
    fireEvent.click(screen.getByRole('button', { name: 'Valider' }));
    expect(onTermine).toHaveBeenLastCalledWith('reussi');
  });
});

describe('Mémoire d’un exercice laissé en cours', () => {
  it('note chaque question dès qu’elle est faite, avant la fin de l’exercice', () => {
    const onQuestion = vi.fn();
    const onTermine = vi.fn();
    const x = exercice('x-temoin-maths-009');
    render(
      <MemoryRouter>
        <ExerciceRunner exercice={x} matiere="maths" onQuestion={onQuestion} onTermine={onTermine} />
      </MemoryRouter>
    );
    for (const bouton of screen.getAllByRole('button', { name: 'Voir la solution' })) fireEvent.click(bouton);
    fireEvent.click(screen.getAllByRole('button', { name: '✓ Réussi' })[0] as HTMLElement);
    expect(onQuestion).toHaveBeenCalledWith(x.questions[0]?.id, 'reussi');
    expect(onTermine).not.toHaveBeenCalled();
  });

  it('reprend les questions déjà notées : l’exercice se termine sans les refaire', () => {
    const onTermine = vi.fn();
    const x = exercice('x-temoin-maths-009');
    const [premiere, ...autres] = x.questions;
    if (!premiere || autres.length === 0) throw new Error('plusieurs questions attendues');
    render(
      <MemoryRouter>
        <ExerciceRunner
          exercice={x}
          matiere="maths"
          dejaNotees={{ [premiere.id]: 'reussi' }}
          onTermine={onTermine}
        />
      </MemoryRouter>
    );
    for (const bouton of screen.getAllByRole('button', { name: 'Voir la solution' })) fireEvent.click(bouton);
    const reussis = screen.getAllByRole('button', { name: '✓ Réussi' });
    expect(reussis[0]).toHaveAttribute('aria-pressed', 'true');
    for (const bouton of reussis.slice(1)) fireEvent.click(bouton);
    expect(onTermine).toHaveBeenLastCalledWith('reussi');
  });

  it('signale une question vérifiée lors d’une visite précédente', () => {
    render(
      <MemoryRouter>
        <ExerciceRunner
          exercice={exercice('x-temoin-maths-001')}
          matiere="maths"
          dejaNotees={{ [exercice('x-temoin-maths-001').questions[0]?.id ?? '']: 'reussi' }}
          onTermine={vi.fn()}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('Déjà réussie')).toBeInTheDocument();
  });
});

describe('Voir la réponse', () => {
  it('ne vient qu’après le dernier indice, et compte la question comme ratée', () => {
    const onTermine = vi.fn();
    const x = exercice('x-temoin-maths-002');
    render(
      <MemoryRouter>
        <ExerciceRunner exercice={x} matiere="maths" onTermine={onTermine} />
      </MemoryRouter>
    );
    expect(screen.queryByRole('button', { name: 'Voir la réponse' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Indice 1 sur 2' }));
    expect(screen.queryByRole('button', { name: 'Voir la réponse' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Indice 2 sur 2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Voir la réponse' }));
    expect(screen.getByText('La réponse')).toBeInTheDocument();
    expect(screen.getByText(/Réponse attendue/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Voir la réponse' })).toBeNull();
    expect(onTermine).toHaveBeenLastCalledWith('rate');
  });

  it('est proposée tout de suite dans une question sans indice, puis on peut réessayer', () => {
    const onRepondre = vi.fn();
    render(
      <QuestionVerifiable
        graine="essai"
        question={{
          enonce: 'Combien vaut $2 + 2$ ?',
          reponse: { type: 'qcm', choix: ['$3$', '$4$'], bonne: 1 },
          explication: 'On ajoute.',
        }}
        onRepondre={onRepondre}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Voir la réponse' }));
    expect(screen.getByText('Bonne réponse : B.')).toBeInTheDocument();
    expect(onRepondre).toHaveBeenCalledWith(false);
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer' }));
    fireEvent.click(screen.getByRole('button', { name: /^B\./ }));
    fireEvent.click(screen.getByRole('button', { name: 'Valider' }));
    expect(onRepondre).toHaveBeenLastCalledWith(true);
  });
});

describe('TypeBacRunner', () => {
  it('estime les points à partir de l’auto-évaluation', () => {
    const onTermine = vi.fn();
    const x = (typeBac as ExerciceTypeBac[]).find((t) => t.id === 'tb-temoin-maths-003');
    if (!x) throw new Error('tb-temoin-maths-003');
    render(
      <MemoryRouter>
        <TypeBacRunner exercice={x} matiere="maths" onTermine={onTermine} />
      </MemoryRouter>
    );
    for (const bouton of screen.getAllByRole('button', { name: 'Voir la correction' })) fireEvent.click(bouton);
    expect(screen.getAllByText('Ce qu’attend le correcteur').length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole('button', { name: '✓ Réussi' })[0] as HTMLElement);
    fireEvent.click(screen.getAllByRole('button', { name: '½ À moitié' })[1] as HTMLElement);
    expect(screen.getByRole('status')).toHaveTextContent('Tu estimes avoir 3 sur 4 points');
    expect(onTermine).toHaveBeenLastCalledWith('moitie');
  });

  it('propose un chronomètre facultatif', () => {
    const x = (typeBac as ExerciceTypeBac[])[0];
    if (!x) throw new Error('type bac attendu');
    render(
      <MemoryRouter>
        <TypeBacRunner exercice={x} matiere="maths" onTermine={vi.fn()} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /Lancer le chronomètre/ }));
    expect(screen.getByText(`${String(x.duree).padStart(2, '0')}:00`)).toBeInTheDocument();
  });
});

describe('CarteMemo', () => {
  it('affiche l’image mentale comme un texte, jamais comme un fichier', async () => {
    const { default: CarteMemo } = await import('../CarteMemo');
    const memo = (await import('../../../../tests/fixtures/terminale/maths/chapitres/temoin-maths/memo.json')).default;
    const carte = memo.find((c: { simplifie: { image?: string } }) => c.simplifie.image);
    if (!carte) throw new Error('carte avec image attendue');
    const { container } = render(<CarteMemo carte={carte as never} notion={undefined} mode="simplifie" />);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText(carte.simplifie.image as string)).toBeInTheDocument();
  });
});
