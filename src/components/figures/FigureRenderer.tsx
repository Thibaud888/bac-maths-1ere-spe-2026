import type { Figure } from '@/lib/figure-types';
import ImageFigure from './ImageFigure';

type Props = {
  figure: Figure;
};

export default function FigureRenderer({ figure }: Props) {
  if (figure.type === 'image') {
    return (
      <ImageFigure
        data={figure.data}
        {...(figure.caption !== undefined ? { caption: figure.caption } : {})}
      />
    );
  }
  // tree: rendered in Sprint 2
  return null;
}
