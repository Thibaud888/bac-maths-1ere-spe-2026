import { useId } from 'react';
import { ACCENT_PAR_DEFAUT, MENTION_HEX } from '@/lib/bac-accents';
import {
  ANNEE_LABEL,
  DOMAINE_LABEL,
  DOMAINE_ORDER,
  couleurLigne,
  fmt,
  mentionPour,
  noteDe,
  totalSimulateur,
  type SimulateurLigne,
} from '@/lib/simulateur';
import type { MesureRepartition } from '@/stores/simulateur-store';

/**
 * Répartition des coefficients, en camembert.
 *
 * SVG dessiné à la main, sans bibliothèque de graphiques — principe repris du
 * dépôt `notes-bac-visualisateur` d'où vient le simulateur.
 *
 * Deux mesures : la part de moyenne que chaque note apporte réellement
 * (`contribution`), ou le poids brut de la matière (`coefficient`). En mesure
 * « contribution », le disque est gradué sur la mention visée : le vide qui
 * reste, ce sont les points encore à prendre pour l'atteindre.
 */

type Part = {
  ligne: SimulateurLigne;
  valeur: number;
  couleur: string;
  figee: boolean;
  a0: number;
  a1: number;
};

const CX = 140;
const CY = 140;
const RAYON_EXT = 130;
const RAYON_INT = 78;

function polaire(rayon: number, degres: number): { x: number; y: number } {
  const a = ((degres - 90) * Math.PI) / 180;
  return { x: CX + rayon * Math.cos(a), y: CY + rayon * Math.sin(a) };
}

/** Chemin d'un secteur d'anneau, de l'angle `a0` à l'angle `a1` (en degrés). */
function arc(a0: number, a1: number): string {
  const grand = a1 - a0 > 180 ? 1 : 0;
  const e0 = polaire(RAYON_EXT, a0);
  const e1 = polaire(RAYON_EXT, a1);
  const i1 = polaire(RAYON_INT, a1);
  const i0 = polaire(RAYON_INT, a0);
  return (
    `M ${e0.x.toFixed(2)} ${e0.y.toFixed(2)} ` +
    `A ${RAYON_EXT} ${RAYON_EXT} 0 ${grand} 1 ${e1.x.toFixed(2)} ${e1.y.toFixed(2)} ` +
    `L ${i1.x.toFixed(2)} ${i1.y.toFixed(2)} ` +
    `A ${RAYON_INT} ${RAYON_INT} 0 ${grand} 0 ${i0.x.toFixed(2)} ${i0.y.toFixed(2)} Z`
  );
}

/** Les lignes rangées par domaine, puis dans l'ordre du barème. */
function ordonner(lignes: readonly SimulateurLigne[]): SimulateurLigne[] {
  return [...lignes].sort(
    (a, b) => DOMAINE_ORDER.indexOf(a.domaine) - DOMAINE_ORDER.indexOf(b.domaine)
  );
}

type Props = {
  lignes: readonly SimulateurLigne[];
  notes: Readonly<Record<string, number>>;
  figees: Readonly<Record<string, boolean>>;
  mesure: MesureRepartition;
  cible: number;
  moyenne: number;
};

export default function Repartition({
  lignes,
  notes,
  figees,
  mesure,
  cible,
  moyenne,
}: Props) {
  const hachures = useId();
  const total = totalSimulateur();
  const parts: Part[] = ordonner(lignes)
    .map((ligne) => ({
      ligne,
      valeur:
        mesure === 'coefficient'
          ? ligne.coefficient
          : noteDe(notes, ligne.id) * ligne.coefficient,
      couleur: couleurLigne(ligne.id),
      figee: Boolean(figees[ligne.id]),
      a0: 0,
      a1: 0,
    }))
    .filter((p) => p.valeur > 0);

  const somme = parts.reduce((s, p) => s + p.valeur, 0);
  // En mesure « contribution », le tour complet vaut la cible : le vide restant
  // montre ce qu'il reste à aller chercher pour l'atteindre.
  const tour =
    mesure === 'contribution' ? Math.max(somme, cible * total) : Math.max(somme, 1);

  let angle = 0;
  for (const part of parts) {
    part.a0 = angle;
    part.a1 = angle + (part.valeur / tour) * 360;
    angle = part.a1;
  }

  const mention = mentionPour(moyenne);
  const couleurMention = MENTION_HEX[mention?.accent ?? ACCENT_PAR_DEFAUT];
  const partDeLaCible = tour === 0 ? 0 : Math.min(100, (somme / tour) * 100);

  const parDomaine = DOMAINE_ORDER.map((domaine) => {
    const dedans = parts.filter((p) => p.ligne.domaine === domaine);
    return {
      domaine,
      valeur: dedans.reduce((s, p) => s + p.valeur, 0),
      coefficient: dedans.reduce((s, p) => s + p.ligne.coefficient, 0),
      couleur: dedans[0]?.couleur ?? '#64748b',
    };
  }).filter((d) => d.valeur > 0);

  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)] sm:items-center">
      <svg
        viewBox="0 0 280 280"
        className="mx-auto w-full max-w-[260px]"
        role="img"
        aria-label={`Répartition des coefficients — moyenne ${fmt(moyenne)} sur 20`}
      >
        <defs>
          <pattern
            id={hachures}
            patternUnits="userSpaceOnUse"
            width="7"
            height="7"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="7"
              stroke="rgba(255,255,255,.65)"
              strokeWidth="2.6"
            />
          </pattern>
        </defs>

        {angle < 360 && (
          <path d={arc(angle, 360)} className="fill-slate-200 dark:fill-slate-700" />
        )}

        {parts.map((part) => (
          <g key={part.ligne.id}>
            <path d={arc(part.a0, Math.max(part.a0, part.a1 - 0.5))} fill={part.couleur}>
              <title>
                {part.ligne.label}
                {part.ligne.partagee ? ` (${ANNEE_LABEL[part.ligne.annee]})` : ''} —
                coefficient {part.ligne.coefficient}, note{' '}
                {fmt(noteDe(notes, part.ligne.id))}/20
              </title>
            </path>
            {part.figee && (
              <path
                d={arc(part.a0, Math.max(part.a0, part.a1 - 0.5))}
                fill={`url(#${hachures})`}
                pointerEvents="none"
              />
            )}
          </g>
        ))}

        <text
          x={CX}
          y={CY - 4}
          textAnchor="middle"
          fontSize="38"
          fontWeight="800"
          fill={couleurMention}
        >
          {fmt(moyenne)}
        </text>
        <text
          x={CX}
          y={CY + 18}
          textAnchor="middle"
          fontSize="12"
          className="fill-slate-500 dark:fill-slate-400"
        >
          {mesure === 'coefficient' ? `poids sur ${total}` : 'moyenne sur 20'}
        </text>
        {mesure === 'contribution' && (
          <text
            x={CX}
            y={CY + 35}
            textAnchor="middle"
            fontSize="10.5"
            className="fill-slate-500 dark:fill-slate-400"
          >
            {fmt(partDeLaCible, 1)} % de la cible {cible}/20
          </text>
        )}
      </svg>

      <ul className="space-y-1.5 text-sm">
        {parDomaine.map((d) => (
          <li key={d.domaine} className="flex items-baseline gap-2">
            <span
              className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: d.couleur }}
              aria-hidden
            />
            <span className="grow text-slate-700 dark:text-slate-300">
              {DOMAINE_LABEL[d.domaine]}
            </span>
            <span className="shrink-0 tabular-nums text-slate-500 dark:text-slate-400">
              {mesure === 'coefficient'
                ? `coef ${d.coefficient}`
                : `${fmt(d.valeur / total)} pts`}
            </span>
          </li>
        ))}
        <li className="pt-2 text-xs text-slate-500 dark:text-slate-400">
          {mesure === 'coefficient'
            ? `Chaque part vaut le coefficient de la matière, sur ${total} au total.`
            : `Chaque part vaut ce que la note apporte à la moyenne. Les parts hachurées sont les notes figées.`}
        </li>
      </ul>
    </div>
  );
}
