import katex from 'katex';
import type { TreeFigureData, TreeNode } from '@/lib/figure-types';

const DX = 150;
const DY = 52;
const NODE_W = 88;
const NODE_H = 30;
const PAD = 20;

type PlacedNode = {
  node: TreeNode;
  col: number;
  row: number;
  children: PlacedNode[];
};

function placeTree(
  node: TreeNode,
  col: number,
  counter: { v: number }
): PlacedNode {
  if (!node.children || node.children.length === 0) {
    const placed: PlacedNode = { node, col, row: counter.v, children: [] };
    counter.v += 1;
    return placed;
  }
  const children = node.children.map((c) => placeTree(c, col + 1, counter));
  const rowFirst = children[0]!.row;
  const rowLast = children[children.length - 1]!.row;
  return { node, col, row: (rowFirst + rowLast) / 2, children };
}

function collectNodes(placed: PlacedNode, out: PlacedNode[]): void {
  out.push(placed);
  placed.children.forEach((c) => collectNodes(c, out));
}

function renderLabel(text: string): string {
  const trimmed = text.trim();
  const expr = trimmed.startsWith('$') && trimmed.endsWith('$')
    ? trimmed.slice(1, -1)
    : trimmed;
  try {
    return katex.renderToString(expr, {
      displayMode: false,
      throwOnError: false,
      output: 'html',
      strict: 'ignore',
    });
  } catch {
    return trimmed;
  }
}

type NodeBoxProps = {
  px: number;
  py: number;
  label: string;
};

function NodeBox({ px, py, label }: NodeBoxProps) {
  const x = px - NODE_W / 2;
  const y = py - NODE_H / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={NODE_W}
        height={NODE_H}
        rx={4}
        className="fill-white stroke-slate-600"
        strokeWidth={1.5}
      />
      <foreignObject x={x + 2} y={y + 2} width={NODE_W - 4} height={NODE_H - 4}>
        <div
          className="flex h-full items-center justify-center text-[11px] leading-none text-slate-800"
          // @ts-expect-error xmlns required for foreignObject
          xmlns="http://www.w3.org/1999/xhtml"
          dangerouslySetInnerHTML={{ __html: renderLabel(label) }}
        />
      </foreignObject>
    </g>
  );
}

type EdgeProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  weight?: string;
};

function Edge({ x1, y1, x2, y2, weight }: EdgeProps) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-slate-500" strokeWidth={1.5} />
      {weight !== undefined && (
        <foreignObject
          x={mx - 28}
          y={my - 11}
          width={56}
          height={22}
        >
          <div
            className="flex h-full items-center justify-center text-[10px] leading-none text-slate-600"
            // @ts-expect-error xmlns required for foreignObject
            xmlns="http://www.w3.org/1999/xhtml"
            dangerouslySetInnerHTML={{ __html: renderLabel(weight) }}
          />
        </foreignObject>
      )}
    </g>
  );
}

type Props = {
  data: TreeFigureData;
  caption?: string;
};

export default function TreeFigure({ data, caption }: Props) {
  const counter = { v: 0 };
  const root = placeTree(data.root, 0, counter);
  const totalLeaves = counter.v;

  const allNodes: PlacedNode[] = [];
  collectNodes(root, allNodes);

  const maxCol = Math.max(...allNodes.map((n) => n.col));
  const svgW = (maxCol + 1) * DX + NODE_W + 2 * PAD;
  const svgH = Math.max(totalLeaves, 1) * DY + 2 * PAD;

  function px(col: number) {
    return PAD + NODE_W / 2 + col * DX;
  }
  function py(row: number) {
    return PAD + NODE_H / 2 + row * DY;
  }

  const edges: { parent: PlacedNode; child: PlacedNode }[] = [];
  function collectEdges(node: PlacedNode) {
    node.children.forEach((c) => {
      edges.push({ parent: node, child: c });
      collectEdges(c);
    });
  }
  collectEdges(root);

  return (
    <figure className="my-3 flex flex-col items-center gap-2">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        width={svgW}
        height={svgH}
        style={{ maxWidth: '100%' }}
        aria-label={caption ?? 'Arbre pondéré'}
        role="img"
      >
        {edges.map(({ parent, child }, i) => (
          <Edge
            key={i}
            x1={px(parent.col) + NODE_W / 2}
            y1={py(parent.row)}
            x2={px(child.col) - NODE_W / 2}
            y2={py(child.row)}
            {...(child.node.weight !== undefined ? { weight: child.node.weight } : {})}
          />
        ))}
        {allNodes.map((n, i) => (
          <NodeBox key={i} px={px(n.col)} py={py(n.row)} label={n.node.label} />
        ))}
      </svg>
      {caption && (
        <figcaption className="text-center text-xs text-slate-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
