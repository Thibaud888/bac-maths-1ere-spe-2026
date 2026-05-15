import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import QcmRunner from '../QcmRunner';
import { useProgressStore } from '@/stores/progress-store';
import type { Automatism } from '@/lib/types';

const QCM: Automatism = {
  id: 'a-test-qcm',
  chapter: 'suites',
  domain: 'calcul-numerique-algebrique',
  type: 'qcm',
  statement: 'Quelle est la réponse ?',
  choices: ['Mauvaise A', 'Bonne réponse', 'Mauvaise B'],
  answer: 1,
  explanation: 'Explication ici.',
  difficulty: 1,
  timeLimitSeconds: 30,
  tags: [],
};

const NUMERIC: Automatism = {
  id: 'a-test-num',
  chapter: 'suites',
  domain: 'calcul-numerique-algebrique',
  type: 'numeric',
  statement: 'Calculer 2+2.',
  answer: 4,
  tolerance: 0,
  explanation: 'On a 2+2=4.',
  difficulty: 1,
  tags: [],
};

beforeEach(() => {
  act(() => {
    useProgressStore.getState().reset();
  });
});

describe('QcmRunner — type qcm', () => {
  it('renders the statement', () => {
    render(<QcmRunner automatism={QCM} timerSeconds={null} />);
    expect(screen.getByText('Quelle est la réponse ?')).toBeInTheDocument();
  });

  it('renders 3 choice buttons', () => {
    render(<QcmRunner automatism={QCM} timerSeconds={null} />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('clicking correct choice shows explanation and records success', () => {
    render(<QcmRunner automatism={QCM} timerSeconds={null} />);
    fireEvent.click(screen.getByRole('button', { name: 'Bonne réponse' }));
    expect(screen.getByText('✓ Correct.')).toBeInTheDocument();
    expect(screen.getByText('Explication ici.')).toBeInTheDocument();
    expect(useProgressStore.getState().items['a-test-qcm']?.succeeded).toBe(true);
  });

  it('clicking wrong choice shows failure and records failure', () => {
    render(<QcmRunner automatism={QCM} timerSeconds={null} />);
    fireEvent.click(screen.getByRole('button', { name: 'Mauvaise A' }));
    expect(screen.getByText('✗ Pas tout à fait.')).toBeInTheDocument();
    expect(useProgressStore.getState().items['a-test-qcm']?.succeeded).toBe(false);
  });

  it('all choice buttons are disabled after answering', () => {
    render(<QcmRunner automatism={QCM} timerSeconds={null} />);
    fireEvent.click(screen.getByRole('button', { name: 'Mauvaise A' }));
    screen.getAllByRole('button').forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('calls onNext when "Question suivante" is clicked', () => {
    const onNext = vi.fn();
    render(<QcmRunner automatism={QCM} timerSeconds={null} onNext={onNext} />);
    fireEvent.click(screen.getByRole('button', { name: 'Bonne réponse' }));
    fireEvent.click(screen.getByRole('button', { name: 'Question suivante →' }));
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('once succeeded stays succeeded on re-render with same id', () => {
    const { rerender } = render(<QcmRunner automatism={QCM} timerSeconds={null} />);
    fireEvent.click(screen.getByRole('button', { name: 'Bonne réponse' }));
    rerender(<QcmRunner automatism={QCM} timerSeconds={null} />);
    expect(useProgressStore.getState().items['a-test-qcm']?.succeeded).toBe(true);
  });
});

describe('QcmRunner — type numeric', () => {
  it('renders a text input and Valider button', () => {
    render(<QcmRunner automatism={NUMERIC} timerSeconds={null} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Valider' })).toBeInTheDocument();
  });

  it('correct numeric input records success', () => {
    render(<QcmRunner automatism={NUMERIC} timerSeconds={null} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '4' } });
    fireEvent.click(screen.getByRole('button', { name: 'Valider' }));
    expect(screen.getByText('✓ Correct.')).toBeInTheDocument();
    expect(useProgressStore.getState().items['a-test-num']?.succeeded).toBe(true);
  });

  it('wrong numeric input records failure and shows expected answer', () => {
    render(<QcmRunner automatism={NUMERIC} timerSeconds={null} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Valider' }));
    expect(screen.getByText('✗ Pas tout à fait.')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(useProgressStore.getState().items['a-test-num']?.succeeded).toBe(false);
  });

  it('accepts fraction notation (ex. 1/2)', () => {
    const half: Automatism = { ...NUMERIC, id: 'a-test-half', answer: 0.5, tolerance: 0.01 };
    render(<QcmRunner automatism={half} timerSeconds={null} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '1/2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Valider' }));
    expect(useProgressStore.getState().items['a-test-half']?.succeeded).toBe(true);
  });

  it('Valider is disabled when input is empty', () => {
    render(<QcmRunner automatism={NUMERIC} timerSeconds={null} />);
    expect(screen.getByRole('button', { name: 'Valider' })).toBeDisabled();
  });
});
