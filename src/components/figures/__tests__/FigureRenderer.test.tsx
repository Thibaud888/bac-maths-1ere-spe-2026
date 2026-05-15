import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import FigureRenderer from '../FigureRenderer';
import type { Figure } from '@/lib/figure-types';

describe('FigureRenderer', () => {
  it('renders an <img> for image type', () => {
    const fig: Figure = {
      type: 'image',
      data: { src: 'probas-cond/arbre.svg', alt: 'Arbre pondéré test' },
    };
    const { container } = render(<FigureRenderer figure={fig} />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('alt')).toBe('Arbre pondéré test');
  });

  it('renders an <svg> for tree type', () => {
    const fig: Figure = {
      type: 'tree',
      data: {
        root: {
          label: 'Ω',
          children: [
            { label: 'A', weight: '0,6' },
            { label: 'B', weight: '0,4' },
          ],
        },
      },
    };
    const { container } = render(<FigureRenderer figure={fig} />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders caption when provided', () => {
    const fig: Figure = {
      type: 'tree',
      data: { root: { label: 'R' } },
      caption: 'Légende de test',
    };
    const { getByText } = render(<FigureRenderer figure={fig} />);
    expect(getByText('Légende de test')).not.toBeNull();
  });
});
