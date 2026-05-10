import { Fragment, memo, type ReactNode } from 'react';
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

const BOLD_RE = /\*\*([^*]+?)\*\*/g;

function renderTextWithBold(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let counter = 0;
  BOLD_RE.lastIndex = 0;
  while ((match = BOLD_RE.exec(text)) !== null) {
    if (match.index > last) {
      out.push(
        <Fragment key={`${keyPrefix}-t${counter++}`}>
          {text.slice(last, match.index)}
        </Fragment>
      );
    }
    out.push(<strong key={`${keyPrefix}-b${counter++}`}>{match[1]}</strong>);
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    out.push(
      <Fragment key={`${keyPrefix}-t${counter++}`}>{text.slice(last)}</Fragment>
    );
  }
  return out;
}

function renderInlineSegments(
  segments: Segment[],
  keyPrefix: string
): ReactNode[] {
  const out: ReactNode[] = [];
  segments.forEach((segment, idx) => {
    if (segment.kind === 'text') {
      out.push(...renderTextWithBold(segment.value, `${keyPrefix}-${idx}`));
      return;
    }
    if (segment.kind === 'inline') {
      out.push(<MathInline key={`${keyPrefix}-${idx}`} expr={segment.value} />);
      return;
    }
    out.push(<MathBlock key={`${keyPrefix}-${idx}`} expr={segment.value} />);
  });
  return out;
}

function hasBlockMarkdown(text: string): boolean {
  if (text.includes('\n\n')) return true;
  return text.split('\n').some((line) => /^- /.test(line));
}

function TextWithMathImpl({ text, className }: TextWithMathProps) {
  if (!hasBlockMarkdown(text)) {
    const segments = parseSegments(text);
    return (
      <span className={className}>{renderInlineSegments(segments, 'i')}</span>
    );
  }

  const blocks = text.split(/\n\n+/);
  return (
    <div className={className}>
      {blocks.map((block, bIdx) => {
        const lines = block.split('\n').filter((line) => line.length > 0);
        const isList =
          lines.length > 0 && lines.every((line) => line.startsWith('- '));
        if (isList) {
          return (
            <ul
              key={`b${bIdx}`}
              className="my-2 ml-5 list-disc space-y-1 first:mt-0 last:mb-0"
            >
              {lines.map((line, lIdx) => (
                <li key={`b${bIdx}-l${lIdx}`}>
                  {renderInlineSegments(
                    parseSegments(line.slice(2)),
                    `b${bIdx}-l${lIdx}`
                  )}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <div
            key={`b${bIdx}`}
            className="my-2 first:mt-0 last:mb-0"
          >
            {renderInlineSegments(parseSegments(block), `b${bIdx}`)}
          </div>
        );
      })}
    </div>
  );
}

export const TextWithMath = memo(TextWithMathImpl);
