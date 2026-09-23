import { useId, useRef, useState, type PointerEvent } from 'react';
import { ACCENT_PAR_DEFAUT, MENTION_HEX } from '@/lib/bac-accents';
import {
  DOMAINE_ORDER,
  contribution,
  couleurLigne,
  fmt,
  mentionPour,
  nomLigne,
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
 *
 * Survoler une part affiche aussitôt sa note et son poids : une bulle dessinée
 * ici, et non l'infobulle du navigateur, qui n'apparaît qu'après un délai.
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

/** Une note figée garde sa couleur et ses hachures, mais s'efface. */
const OPACITE_FIGEE = 0.4;

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

/** Les parts du disque et l'angle où elles s'arrêtent. */
function decouper({ lignes, notes, figees, mesure, cible }: Props) {
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
  return { parts, somme, tour, fin: angle };
}

type CamembertProps = Props & {
  /** Version réduite, sans texte au centre ni bulle au survol (bandeau collant). */
  mini?: boolean;
  className?: string;
};

type Survol = { part: Part; x: number; y: number };

/** Demi-largeur maximale de la bulle (`max-w-[16rem]`), pour qu'elle ne déborde pas. */
const DEMI_BULLE_PX = 128;

/** Bulle affichée au survol d'une part : la note, son poids, ce qu'elle rapporte. */
function Bulle({ survol, note }: { survol: Survol; note: number }) {
  const { ligne, figee } = survol.part;
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-10 w-max max-w-[16rem] -translate-x-1/2 -translate-y-full rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-lg dark:bg-slate-100 dark:text-slate-900"
      style={{ left: survol.x, top: survol.y - 10 }}
    >
      <p className="font-semibold">{nomLigne(ligne)}</p>
      <p className="tabular-nums opacity-80">
        note {fmt(note)}/20 · coef {ligne.coefficient} · apporte{' '}
        {fmt(contribution(ligne, note))}
        {figee ? ' · figée' : ''}
      </p>
    </div>
  );
}

/** Le disque seul : réutilisé en grand dans le panneau, en petit dans le bandeau. */
export function Camembert(props: CamembertProps) {
  const { notes, mesure, cible, moyenne, mini = false, className } = props;
  const hachures = useId();
  const cadre = useRef<HTMLDivElement>(null);
  const [survol, setSurvol] = useState<Survol | null>(null);
  const total = totalSimulateur();
  const { parts, somme, tour, fin } = decouper(props);

  const mention = mentionPour(moyenne);
  const couleurMention = MENTION_HEX[mention?.accent ?? ACCENT_PAR_DEFAUT];
  const partDeLaCible = tour === 0 ? 0 : Math.min(100, (somme / tour) * 100);

  const suivre = (part: Part) => (e: PointerEvent<SVGPathElement>) => {
    const rect = cadre.current?.getBoundingClientRect();
    if (!rect) return;
    // La bulle suit le pointeur mais reste dans le cadre du disque.
    const x =
      rect.width > 2 * DEMI_BULLE_PX
        ? Math.min(rect.width - DEMI_BULLE_PX, Math.max(DEMI_BULLE_PX, e.clientX - rect.left))
        : rect.width / 2;
    setSurvol({ part, x, y: e.clientY - rect.top });
  };

  const disque = (
    <svg
      viewBox="0 0 280 280"
      className={mini ? className : 'block w-full'}
      role="img"
      aria-label={`Répartition des coefficients — moyenne ${fmt(moyenne)} sur 20`}
      onPointerLeave={mini ? undefined : () => setSurvol(null)}
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

      {fin < 360 && (
        <path d={arc(fin, 360)} className="fill-slate-200 dark:fill-slate-700" />
      )}

      {parts.map((part) => (
        <g key={part.ligne.id} opacity={part.figee ? OPACITE_FIGEE : 1}>
          <path
            d={arc(part.a0, Math.max(part.a0, part.a1 - 0.5))}
            fill={part.couleur}
            stroke={survol?.part.ligne.id === part.ligne.id ? 'currentColor' : 'none'}
            strokeWidth={2}
            onPointerEnter={mini ? undefined : suivre(part)}
            onPointerMove={mini ? undefined : suivre(part)}
          />
          {part.figee && (
            <path
              d={arc(part.a0, Math.max(part.a0, part.a1 - 0.5))}
              fill={`url(#${hachures})`}
              pointerEvents="none"
            />
          )}
        </g>
      ))}

      {!mini && (
        <>
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
        </>
      )}
    </svg>
  );

  if (mini) return disque;
  return (
    <div ref={cadre} className={`relative text-slate-900 dark:text-white ${className ?? ''}`}>
      {disque}
      {survol && <Bulle survol={survol} note={noteDe(notes, survol.part.ligne.id)} />}
    </div>
  );
}

export default function Repartition(props: Props) {
  const { mesure } = props;
  const total = totalSimulateur();

  return (
    <div className="space-y-3">
      <Camembert
        {...props}
        className="mx-auto w-full max-w-[260px] xl:max-w-[320px]"
      />
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        {mesure === 'coefficient'
          ? `Chaque part vaut le coefficient de la matière, sur ${total} au total.`
          : 'Chaque part vaut ce que la note apporte à la moyenne. Les parts pâles et hachurées sont les notes figées.'}{' '}
        Survole une part pour voir le détail.
      </p>
    </div>
  );
}
