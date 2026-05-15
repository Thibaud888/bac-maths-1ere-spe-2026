import type { ImageFigure as ImageFigureType } from '@/lib/figure-types';

type Props = {
  data: ImageFigureType['data'];
  caption?: string;
};

export default function ImageFigure({ data, caption }: Props) {
  const src = import.meta.env.BASE_URL + 'figures/' + data.src;
  return (
    <figure className="my-3 flex flex-col items-center gap-2">
      <img
        src={src}
        alt={data.alt}
        width={data.width}
        height={data.height}
        className="max-w-full rounded border border-slate-200"
      />
      {caption && (
        <figcaption className="text-center text-xs text-slate-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
