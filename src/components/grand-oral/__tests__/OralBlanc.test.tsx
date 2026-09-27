import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { tempsMinutes } from '@/lib/grand-oral-content';
import { formatHorloge } from '@/lib/oral-blanc';
import { typographie } from '@/lib/typographie';
import { NB_QUESTIONS, questionVide, useGrandOralStore } from '@/stores/grand-oral-store';
import OralBlanc, { NB_RELANCES } from '../OralBlanc';

const [PREPARATION, EXPOSE, ECHANGE] = tempsMinutes();

function avancer(secondes: number) {
  act(() => {
    vi.advanceTimersByTime(secondes * 1000);
  });
}

function horloge(): string {
  return screen.getByTestId('horloge').textContent ?? '';
}

function afficher() {
  render(
    <MemoryRouter>
      <OralBlanc />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  act(() => {
    useGrandOralStore.setState({
      questions: Array.from({ length: NB_QUESTIONS }, questionVide),
      historique: [],
    });
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('oral blanc du grand oral', () => {
  it('lit trois temps minutés dans le déroulé officiel', () => {
    expect(PREPARATION && EXPOSE && ECHANGE).toBeTruthy();
  });

  it('enchaîne les temps officiels, compte la pause à part et montre le dépassement', () => {
    if (!PREPARATION || !EXPOSE || !ECHANGE) throw new Error('déroulé incomplet');
    afficher();

    const demarrer = screen.getByRole('button', { name: 'Démarrer la préparation' });
    expect(demarrer).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/écris une question/i), {
      target: { value: 'Peut-on dater un objet ?' },
    });
    fireEvent.click(demarrer);

    // Préparation : le minuteur part de la durée officielle.
    expect(horloge()).toBe(formatHorloge(PREPARATION.minutes * 60));
    avancer(60);
    expect(horloge()).toBe(formatHorloge(PREPARATION.minutes * 60 - 60));

    // Une pause de cinq minutes ne consomme pas de temps.
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    avancer(300);
    expect(horloge()).toBe(formatHorloge(PREPARATION.minutes * 60 - 60));
    fireEvent.click(screen.getByRole('button', { name: 'Reprendre' }));

    // Exposé : dépassement de 35 secondes, affiché en « +00:35 ».
    fireEvent.click(screen.getByRole('button', { name: typographie(`Passer à : ${EXPOSE.titre}`) }));
    expect(horloge()).toBe(formatHorloge(EXPOSE.minutes * 60));
    avancer(EXPOSE.minutes * 60 + 35);
    expect(horloge()).toBe('+00:35');
    expect(screen.getByText('Temps écoulé')).toBeInTheDocument();

    // Échange : des relances de jury sont proposées.
    fireEvent.click(screen.getByRole('button', { name: typographie(`Passer à : ${ECHANGE.titre}`) }));
    expect(screen.getByText('Relances du jury')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Pistes de réponse' })).toHaveLength(
      NB_RELANCES
    );
    avancer(120);
    fireEvent.click(screen.getByRole('button', { name: 'Terminer l’oral' }));

    // Bilan : le dépassement de l'exposé est chiffré, puis enregistré.
    expect(screen.getByText('dépassé de 35 s')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'Solide' })[0] as HTMLElement);
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer le bilan' }));

    const [enregistre] = useGrandOralStore.getState().historique;
    expect(enregistre?.question).toBe('Peut-on dater un objet ?');
    expect(enregistre?.questionIndex).toBeNull();
    expect(enregistre?.durees[PREPARATION.id]).toBe(60);
    expect(enregistre?.durees[EXPOSE.id]).toBe(EXPOSE.minutes * 60 + 35);
    expect(enregistre?.durees[ECHANGE.id]).toBe(120);
    expect(Object.values(enregistre?.auto ?? {})).toEqual(['solide']);
  });

  it('tire au sort une des deux questions quand elles sont écrites', () => {
    act(() => {
      useGrandOralStore.getState().modifierQuestion(0, { formulation: 'Question maths' });
      useGrandOralStore.getState().modifierQuestion(1, { formulation: 'Question physique' });
    });
    afficher();
    fireEvent.click(screen.getByRole('button', { name: 'Tirer au sort' }));
    const tiree = screen.queryByText('Question maths') ?? screen.queryByText('Question physique');
    expect(tiree).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Démarrer la préparation' })).toBeEnabled();
  });

  it('renvoie vers « Mes 2 questions » tant qu’aucune n’est écrite', () => {
    afficher();
    expect(screen.getByRole('link', { name: 'Remplis « Mes 2 questions »' })).toHaveAttribute(
      'href',
      '/terminale/grand-oral/questions'
    );
  });
});
