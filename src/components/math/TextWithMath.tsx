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

function isTableSeparatorRow(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) return false;
  const inner = trimmed.replace(/^\|/, '').replace(/\|$/, '');
  return inner.split('|').every((cell) => /^[\s\-:]+$/.test(cell));
}

function isMarkdownTable(block: string): boolean {
  const lines = block.split('\n').filter((l) => l.trim().length > 0);
  return (
    lines.length >= 3 &&
    lines.every((l) => l.trim().startsWith('|')) &&
    isTableSeparatorRow(lines[1])
  );
}

function parseTableCells(line: string): string[] {
  const trimmed = line.trim();
  const inner = trimmed.startsWith('|') ? trimmed.slice(1) : trimmed;
  const withoutTrailing = inner.endsWith('|') ? inner.slice(0, -1) : inner;
  return withoutTrailing.split('|').map((c) => c.trim());
}

function renderMarkdownTable(block: string, keyPrefix: string): ReactNode {
  const lines = block.split('\n').filter((l) => l.trim().length > 0);
  const headers = parseTableCells(lines[0]);
  const rows = lines.slice(2).map(parseTableCells);
  return (
    <div key={keyPrefix} className="my-3 overflow-x-auto first:mt-0 last:mb-0">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((cell, i) => (
              <th
                key={i}
                className="border border-slate-300 bg-slate-100 px-3 py-2 text-center font-semibold text-slate-700"
              >
                {renderInlineSegments(parseSegments(cell), `${keyPrefix}-h${i}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className="border border-slate-300 px-3 py-2 text-center text-slate-700"
                >
                  {renderInlineSegments(
                    parseSegments(cell),
                    `${keyPrefix}-r${rIdx}-c${cIdx}`
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function hasBlockMarkdown(text: string): boolean {
  if (text.includes('\n\n')) return true;
  return text
    .split('\n')
    .some((line) => /^- /.test(line) || line.trim().startsWith('|'));
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
        if (isMarkdownTable(block)) {
          return renderMarkdownTable(block, `b${bIdx}`);
        }
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
