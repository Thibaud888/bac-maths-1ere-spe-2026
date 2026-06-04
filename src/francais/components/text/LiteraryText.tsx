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
    // Gras + italique : ***texte***
    if (input.startsWith('***', i)) {
      const end = input.indexOf('***', i + 3);
      if (end !== -1) {
        tokens.push({
          kind: 'bold',
          children: [{ kind: 'italic', children: tokenize(input.slice(i + 3, end)) }],
        });
        i = end + 3;
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
    if (input[i] === '*') {
      const end = input.indexOf('*', i + 1);
      if (end !== -1) {
        tokens.push({ kind: 'italic', children: tokenize(input.slice(i + 1, end)) });
        i = end + 1;
        continue;
      }
      // « * » non apparié : caractère littéral, on avance d'un cran (anti-boucle).
      tokens.push({ kind: 'text', value: '*' });
      i += 1;
      continue;
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

const BULLET_RE = /^\s*- (.*)$/;
const ORDERED_RE = /^\s*\d+\.\s+(.*)$/;

type ListKind = 'ul' | 'ol';

function listKind(line: string): ListKind | null {
  if (BULLET_RE.test(line)) return 'ul';
  if (ORDERED_RE.test(line)) return 'ol';
  return null;
}

function isListLine(line: string): boolean {
  return listKind(line) !== null;
}

function listContent(line: string): string {
  const bullet = BULLET_RE.exec(line);
  if (bullet && bullet[1] !== undefined) return bullet[1];
  const ordered = ORDERED_RE.exec(line);
  if (ordered && ordered[1] !== undefined) return ordered[1];
  return line.trim();
}

type ListItem = { content: string; children: ListItem[]; childKind: ListKind };

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
    const content = listContent(line);
    i++;
    const childLines: string[] = [];
    while (i < lines.length) {
      const next = lines[i];
      if (next === undefined || getIndent(next) <= baseIndent) break;
      childLines.push(next);
      i++;
    }
    let children: ListItem[] = [];
    let childKind: ListKind = 'ul';
    if (childLines.length > 0) {
      const first = childLines[0];
      if (first !== undefined) {
        children = parseListItems(childLines, getIndent(first));
        childKind = listKind(first) ?? 'ul';
      }
    }
    items.push({ content, children, childKind });
  }
  return items;
}

function renderList(items: ListItem[], keyPrefix: string, kind: ListKind): ReactNode {
  const ListTag = kind === 'ol' ? 'ol' : 'ul';
  const listStyle = kind === 'ol' ? 'list-decimal' : 'list-disc';
  return (
    <ListTag key={keyPrefix} className={`my-2 ml-5 ${listStyle} space-y-1 first:mt-0 last:mb-0`}>
      {items.map((item, idx) => (
        <li key={`l${idx}`}>
          {renderTokens(tokenize(item.content), `${keyPrefix}-l${idx}`)}
          {item.children.length > 0 && renderList(item.children, `${keyPrefix}-l${idx}-c`, item.childKind)}
        </li>
      ))}
    </ListTag>
  );
}

// Découpe un bloc en segments successifs : listes (à puces ou numérotées) et
// paragraphes. Permet à une ligne d'introduction suivie d'une liste (sans ligne
// vide intermédiaire) de s'afficher correctement, et non « à la suite ».
function renderMixedBlock(block: string, keyPrefix: string, preserveLineBreaks: boolean): ReactNode[] {
  const lines = block.split('\n').filter((line) => line.length > 0);
  const out: ReactNode[] = [];
  let i = 0;
  let seg = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line === undefined) break;
    if (isListLine(line)) {
      const listLines: string[] = [];
      while (i < lines.length) {
        const l = lines[i];
        if (l === undefined || !isListLine(l)) break;
        listLines.push(l);
        i++;
      }
      const first = listLines[0];
      if (first !== undefined) {
        const baseIndent = getIndent(first);
        const items = parseListItems(listLines, baseIndent);
        out.push(renderList(items, `${keyPrefix}-s${seg}`, listKind(first) ?? 'ul'));
      }
    } else {
      const paraLines: string[] = [];
      while (i < lines.length) {
        const l = lines[i];
        if (l === undefined || isListLine(l)) break;
        paraLines.push(l);
        i++;
      }
      const content = preserveLineBreaks ? paraLines.join('\n') : paraLines.join(' ');
      out.push(
        <div key={`${keyPrefix}-s${seg}`} className="my-2 first:mt-0 last:mb-0">
          {renderTokens(tokenize(content), `${keyPrefix}-s${seg}`)}
        </div>,
      );
    }
    seg++;
  }
  return out;
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
        return (
          <Fragment key={`b${bIdx}`}>
            {renderMixedBlock(block, `b${bIdx}`, preserveLineBreaks ?? false)}
          </Fragment>
        );
      })}
    </div>
  );
}

export const LiteraryText = memo(LiteraryTextImpl);
