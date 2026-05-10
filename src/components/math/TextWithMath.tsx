import { Fragment, memo } from 'react';
import { MathBlock } from './MathBlock';
import { MathInline } from './MathInline';

type TextWithMathProps = {
  text: string;
  className?: string;
};

type Segment =
  | { kind: 'text'; value: string }
  | { kind: 'inline'; value: string }
  | { kind: 'block'; value: string };

function parseSegments(input: string): Segment[] {
  const segments: Segment[] = [];
  let i = 0;
  while (i < input.length) {
    if (input.startsWith('$$', i)) {
      const end = input.indexOf('$$', i + 2);
      if (end === -1) {
        segments.push({ kind: 'text', value: input.slice(i) });
        break;
      }
      segments.push({ kind: 'block', value: input.slice(i + 2, end) });
      i = end + 2;
      continue;
    }
    if (input[i] === '$') {
      const end = input.indexOf('$', i + 1);
      if (end === -1) {
        segments.push({ kind: 'text', value: input.slice(i) });
        break;
      }
      segments.push({ kind: 'inline', value: input.slice(i + 1, end) });
      i = end + 1;
      continue;
    }
    const nextDollar = input.indexOf('$', i);
    if (nextDollar === -1) {
      segments.push({ kind: 'text', value: input.slice(i) });
      break;
    }
    segments.push({ kind: 'text', value: input.slice(i, nextDollar) });
    i = nextDollar;
  }
  return segments;
}

function TextWithMathImpl({ text, className }: TextWithMathProps) {
  const segments = parseSegments(text);
  return (
    <span className={className}>
      {segments.map((segment, idx) => {
        if (segment.kind === 'text') {
          return <Fragment key={idx}>{segment.value}</Fragment>;
        }
        if (segment.kind === 'inline') {
          return <MathInline key={idx} expr={segment.value} />;
        }
        return <MathBlock key={idx} expr={segment.value} />;
      })}
    </span>
  );
}

export const TextWithMath = memo(TextWithMathImpl);
