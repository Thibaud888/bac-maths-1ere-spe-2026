import { MathInline } from '@/components/math/MathInline';
import { TextWithMath } from '@/components/math/TextWithMath';

/** Une unité écrite « en LaTeX ou en texte » (schéma) : `\mathrm{m\,s^{-1}}` ou `cm`. */
export default function Unite({ unite }: { unite: string }) {
  if (unite.includes('$')) return <TextWithMath text={unite} />;
  if (/[\\^_{}]/.test(unite)) return <MathInline expr={unite} />;
  return <>{unite}</>;
}
