import { Fragment, memo, type ReactNode } from 'react';

type LiteraryTextProps = {
  text: string;
  className?: string;
  /** Préserve les sauts de ligne simples comme retours à la ligne (vers). */
  preserveLineBreaks?: boolean;
};

// Tokens inline : gras (**), italique (*), texte.
type Token =
  | { kind: 'text'; value: string }
  | { kind: 'bold'; children: Token[] }
  | { kind: 'italic'; children: Token[] };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    if (input.startsWith('**', i)) {
      const end = input.indexOf('**', i + 2);
      if (end !== -1) {
        tokens.push({ kind: 'bold', children: tokenize(input.slice(i + 2, end)) });
        i = end + 2;
        continue;
      }
    }
    if (input[i] === '*') {
      const end = input.indexOf('*', i + 1);
      if (end !== -1) {
        tokens.push({ kind: 'italic', children: tokenize(input.slice(i + 1, end)) });
        i = end + 1;
        continue;
      }
    }
    const next = input.indexOf('*', i);
    if (next === -1) {
      tokens.push({ kind: 'text', value: input.slice(i) });
      break;
    }
    tokens.push({ kind: 'text', value: input.slice(i, next) });
    i = next;
  }
  return tokens;
}

function renderTextValue(value: string, keyPrefix: string): ReactNode {
  if (!value.includes('\n')) return value;
  const parts = value.split('\n');
  return parts.map((part, idx) => (
    <Fragment key={`${keyPrefix}-ln${idx}`}>
      {idx > 0 && <br />}
      {part}
    </Fragment>
  ));
}

function renderTokens(tokens: Token[], keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  tokens.forEach((token, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (token.kind === 'text') {
      if (token.value) out.push(<Fragment key={key}>{renderTextValue(token.value, key)}</Fragment>);
    } else if (token.kind === 'bold') {
      out.push(<strong key={key}>{renderTokens(token.children, key)}</strong>);
    } else {
      out.push(<em key={key}>{renderTokens(token.children, key)}</em>);
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
  return lines.every((l) => l.trim().startsWith('|')) && isTableSeparatorRow(separator);
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
                className="border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200"
              >
                {renderTokens(tokenize(cell), `${keyPrefix}-h${i}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={rIdx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900'}
            >
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-left text-slate-700 dark:text-slate-300"
                >
                  {renderTokens(tokenize(cell), `${keyPrefix}-r${rIdx}-c${cIdx}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getIndent(line: string): number {
  const m = /^(\s*)/.exec(line);
  return m && m[1] !== undefined ? m[1].length : 0;
}

function isListLine(line: string): boolean {
  return /^\s*- /.test(line);
}

type ListItem = { content: string; children: ListItem[] };

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
      if (first !== undefined) children = parseListItems(childLines, getIndent(first));
    }
    items.push({ content, children });
  }
  return items;
}

function renderList(items: ListItem[], keyPrefix: string): ReactNode {
  return (
    <ul key={keyPrefix} className="my-2 ml-5 list-disc space-y-1 first:mt-0 last:mb-0">
      {items.map((item, idx) => (
        <li key={`l${idx}`}>
          {renderTokens(tokenize(item.content), `${keyPrefix}-l${idx}`)}
          {item.children.length > 0 && renderList(item.children, `${keyPrefix}-l${idx}-c`)}
        </li>
      ))}
    </ul>
  );
}

function isBlockquote(block: string): boolean {
  const lines = block.split('\n').filter((l) => l.trim().length > 0);
  return lines.length > 0 && lines.every((l) => l.trimStart().startsWith('> '));
}

function renderBlockquote(block: string, keyPrefix: string): ReactNode {
  const inner = block
    .split('\n')
    .map((l) => l.replace(/^\s*> ?/, ''))
    .join('\n');
  return (
    <blockquote
      key={keyPrefix}
      className="my-3 border-l-4 border-indigo-300 dark:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 px-4 py-2 italic text-slate-700 dark:text-slate-300 first:mt-0 last:mb-0"
    >
      {renderTokens(tokenize(inner), `${keyPrefix}-bq`)}
    </blockquote>
  );
}

function hasBlockMarkdown(text: string): boolean {
  if (text.includes('\n\n')) return true;
  return text
    .split('\n')
    .some((line) => isListLine(line) || line.trim().startsWith('|') || line.trimStart().startsWith('> '));
}

function LiteraryTextImpl({ text, className, preserveLineBreaks }: LiteraryTextProps) {
  if (!hasBlockMarkdown(text)) {
    return <span className={className}>{renderTokens(tokenize(text), 'i')}</span>;
  }

  const blocks = text.split(/\n\n+/);
  return (
    <div className={className}>
      {blocks.map((block, bIdx) => {
        if (isMarkdownTable(block)) return renderMarkdownTable(block, `b${bIdx}`);
        if (isBlockquote(block)) return renderBlockquote(block, `b${bIdx}`);
        const lines = block.split('\n').filter((line) => line.length > 0);
        const isList = lines.length > 0 && lines.every(isListLine);
        if (isList) {
          const firstLine = lines[0];
          if (firstLine !== undefined) {
            const items = parseListItems(lines, getIndent(firstLine));
            return renderList(items, `b${bIdx}`);
          }
        }
        const content = preserveLineBreaks ? block : block.replace(/\n/g, ' ');
        return (
          <div key={`b${bIdx}`} className="my-2 first:mt-0 last:mb-0">
            {renderTokens(tokenize(content), `b${bIdx}`)}
          </div>
        );
      })}
    </div>
  );
}

export const LiteraryText = memo(LiteraryTextImpl);
