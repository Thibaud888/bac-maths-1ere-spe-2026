import type { Figure } from '@/lib/figure-types';
import ImageFigure from './ImageFigure';
import TreeFigure from './TreeFigure';

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
  return (
    <TreeFigure
      data={figure.data}
      {...(figure.caption !== undefined ? { caption: figure.caption } : {})}
    />
  );
}
