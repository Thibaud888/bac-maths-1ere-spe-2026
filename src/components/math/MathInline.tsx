import { memo, useMemo } from 'react';
import katex from 'katex';

type MathInlineProps = {
  expr: string;
  className?: string;
};

function MathInlineImpl({ expr, className }: MathInlineProps) {
  const html = useMemo(
    () =>
      katex.renderToString(expr, {
        displayMode: false,
        throwOnError: false,
        output: 'html',
        strict: 'ignore',
      }),
    [expr]
  );

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export const MathInline = memo(MathInlineImpl);
