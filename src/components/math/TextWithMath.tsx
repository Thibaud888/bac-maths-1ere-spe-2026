import { Fragment, memo, type ReactNode } from 'react';
import { MathBlock } from './MathBlock';
import { MathInline } from './MathInline';

type TextWithMathProps = {
  text: string;
  className?: string;
};

// Unified token type: bold can contain math, math lives inside or outside bold.
type Token =
  | { kind: 'text'; value: string }
  | { kind: 'inline'; value: string }
  | { kind: 'block'; value: string }
  | { kind: 'bold'; children: Token[] };

function nextSpecialPos(input: string, from: number): number {
  const candidates: number[] = [];
  const dd = input.indexOf('$$', from);
  if (dd !== -1) candidates.push(dd);
  const star = input.indexOf('**', from);
  if (star !== -1) candidates.push(star);
  const d = input.indexOf('$', from);
  if (d !== -1) candidates.push(d);
  return candidates.length > 0 ? Math.min(...candidates) : -1;
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    if (input.startsWith('$$', i)) {
      const end = input.indexOf('$$', i + 2);
      if (end !== -1) {
        tokens.push({ kind: 'block', value: input.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (input.startsWith('**', i)) {
      const end = input.indexOf('**', i + 2);
      if (end !== -1) {
        tokens.push({ kind: 'bold', children: tokenize(input.slice(i + 2, end)) });
        i = end + 2;
        continue;
      }
    }
    if (input[i] === '$') {
      const end = input.indexOf('$', i + 1);
      if (end !== -1) {
        tokens.push({ kind: 'inline', value: input.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    const next = nextSpecialPos(input, i);
    if (next === -1) {
      tokens.push({ kind: 'text', value: input.slice(i) });
      break;
    }
    tokens.push({ kind: 'text', value: input.slice(i, next) });
    i = next;
  }
  return tokens;
}

function renderTokens(tokens: Token[], keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  tokens.forEach((token, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (token.kind === 'text') {
      if (token.value) out.push(<Fragment key={key}>{token.value}</Fragment>);
    } else if (token.kind === 'inline') {
      out.push(<MathInline key={key} expr={token.value} />);
    } else if (token.kind === 'block') {
      out.push(<MathBlock key={key} expr={token.value} />);
    } else {
      out.push(<strong key={key}>{renderTokens(token.children, key)}</strong>);
    }
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
  if (lines.length < 3) return false;
  const separator = lines[1];
  if (separator === undefined) return false;
  return (
    lines.every((l) => l.trim().startsWith('|')) &&
    isTableSeparatorRow(separator)
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
  const headerLine = lines[0];
  if (headerLine === undefined) return null;
  const headers = parseTableCells(headerLine);
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
                {renderTokens(tokenize(cell), `${keyPrefix}-h${i}`)}
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
                  {renderTokens(
                    tokenize(cell),
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
    .some((line) => /^\s*- /.test(line) || line.trim().startsWith('|'));
}

type ListItem = {
  content: string;
  children: ListItem[];
};

function getIndent(line: string): number {
  const m = /^(\s*)/.exec(line);
  return m && m[1] !== undefined ? m[1].length : 0;
}

function isListLine(line: string): boolean {
  return /^\s*- /.test(line);
}

function parseListItems(lines: string[], baseIndent: number): ListItem[] {
  const items: ListItem[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line === undefined) break;
    const indent = getIndent(line);
    if (indent < baseIndent || !isListLine(line)) break;
    if (indent !== baseIndent) {
      i++;
      continue;
    }
    const content = line.slice(baseIndent + 2);
    i++;
    const childLines: string[] = [];
    while (i < lines.length) {
      const next = lines[i];
      if (next === undefined || getIndent(next) <= baseIndent) break;
      childLines.push(next);
      i++;
    }
    let children: ListItem[] = [];
    if (childLines.length > 0) {
      const first = childLines[0];
      if (first !== undefined) {
        children = parseListItems(childLines, getIndent(first));
      }
    }
    items.push({ content, children });
  }
  return items;
}

function renderList(items: ListItem[], keyPrefix: string): ReactNode {
  return (
    <ul
      key={keyPrefix}
      className="my-2 ml-5 list-disc space-y-1 first:mt-0 last:mb-0"
    >
      {items.map((item, idx) => (
        <li key={`l${idx}`}>
          {renderTokens(
            tokenize(item.content),
            `${keyPrefix}-l${idx}`
          )}
          {item.children.length > 0 &&
            renderList(item.children, `${keyPrefix}-l${idx}-c`)}
        </li>
      ))}
    </ul>
  );
}

function TextWithMathImpl({ text, className }: TextWithMathProps) {
  if (!hasBlockMarkdown(text)) {
    return (
      <span className={className}>{renderTokens(tokenize(text), 'i')}</span>
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
        const isList = lines.length > 0 && lines.every(isListLine);
        if (isList) {
          const firstLine = lines[0];
          if (firstLine !== undefined) {
            const items = parseListItems(lines, getIndent(firstLine));
            return renderList(items, `b${bIdx}`);
          }
        }
        return (
          <div
            key={`b${bIdx}`}
            className="my-2 first:mt-0 last:mb-0"
          >
            {renderTokens(tokenize(block), `b${bIdx}`)}
          </div>
        );
      })}
    </div>
  );
}

export const TextWithMath = memo(TextWithMathImpl);
