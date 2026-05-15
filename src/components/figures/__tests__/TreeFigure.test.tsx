import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import TreeFigure from '../TreeFigure';
import type { TreeFigureData } from '@/lib/figure-types';

const twoLevelTree: TreeFigureData = {
  root: {
    label: 'Ω',
    children: [
      { label: 'A', weight: '0,6', children: [{ label: 'D', weight: '$\\frac{1}{4}$' }, { label: '$\\overline{D}$', weight: '$\\frac{3}{4}$' }] },
      { label: 'B', weight: '0,4', children: [{ label: 'D', weight: '0,5' }, { label: '$\\overline{D}$', weight: '0,5' }] },
    ],
  },
};

describe('TreeFigure', () => {
  it('renders an SVG element', () => {
    const { container } = render(<TreeFigure data={twoLevelTree} />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders one rect per node', () => {
    const { container } = render(<TreeFigure data={twoLevelTree} />);
    // root + 2 children + 4 leaves = 7
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(7);
  });

  it('renders edges (lines) between nodes', () => {
    const { container } = render(<TreeFigure data={twoLevelTree} />);
    // 6 edges for 7 nodes
    const lines = container.querySelectorAll('line');
    expect(lines.length).toBe(6);
  });

  it('renders a single-node tree without errors', () => {
    const data: TreeFigureData = { root: { label: 'Ω' } };
    const { container } = render(<TreeFigure data={data} />);
    expect(container.querySelector('svg')).not.toBeNull();
    expect(container.querySelectorAll('rect').length).toBe(1);
    expect(container.querySelectorAll('line').length).toBe(0);
  });

  it('renders caption when provided', () => {
    const data: TreeFigureData = { root: { label: 'R' } };
    const { getByText } = render(<TreeFigure data={data} caption="Légende arbre" />);
    expect(getByText('Légende arbre')).not.toBeNull();
  });

  it('SVG has valid positive dimensions', () => {
    const { container } = render(<TreeFigure data={twoLevelTree} />);
    const svg = container.querySelector('svg')!;
    const w = parseInt(svg.getAttribute('width') ?? '0', 10);
    const h = parseInt(svg.getAttribute('height') ?? '0', 10);
    expect(w).toBeGreaterThan(0);
    expect(h).toBeGreaterThan(0);
  });
});
