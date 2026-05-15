import { memo, useMemo } from 'react';
import katex from 'katex';

type MathBlockProps = {
  expr: string;
  className?: string;
};

function MathBlockImpl({ expr, className }: MathBlockProps) {
  const html = useMemo(
    () =>
      katex.renderToString(expr, {
        displayMode: true,
        throwOnError: false,
        output: 'html',
        strict: 'ignore',
      }),
    [expr]
  );

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export const MathBlock = memo(MathBlockImpl);
