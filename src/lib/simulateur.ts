import { listBacCoefficients, listBacMentions, totalCoefficients } from '@/lib/bac-content';
import type {
  BacAnnee,
  BacBloc,
  BacCoefficient,
  BacDomaine,
  BacMention,
  BacPortee,
} from '@/lib/bac-types';

/**
 * Moteur du simulateur de moyenne.
 *
 * Les coefficients viennent de `content/bac/coefficients.json` et de nulle part
 * ailleurs : ce module se contente de les découper en lignes réglables (une par
 * note que l'élève peut saisir) puis d'en tirer moyenne, mention et leviers.
 *
 * Découpage : une épreuve donne une ligne ; une matière de contrôle continu
 * évaluée sur les deux ans en donne deux, une par année, selon `repartition`.
 */

/** Une note réglable : ce que l'élève voit sur une ligne du simulateur. */
export type SimulateurLigne = {
  /** Identifiant de la note. Suffixé par l'année quand le coefficient est partagé. */
  id: string;
  /** Ligne du barème dont elle vient. */
  coefficientId: string;
  label: string;
  bloc: BacBloc;
  domaine: BacDomaine;
  annee: BacAnnee;
  /** Poids de cette seule note (la part de l'année, si le coefficient est partagé). */
  coefficient: number;
  /** Vrai quand la matière compte aussi sur l'autre année. */
  partagee: boolean;
  quand: string;
  portee: BacPortee;
  profilNote?: string;
};

export const ANNEE_LABEL: Record<BacAnnee, string> = {
  premiere: 'Première',
  terminale: 'Terminale',
};

/**
 * Nom affiché d'une note. Quand la matière compte sur les deux années, chaque
 * ligne dit de quelle moyenne annuelle il s'agit : « Histoire-géographie —
 * moyenne de première ».
 */
export function nomLigne(ligne: SimulateurLigne): string {
  if (!ligne.partagee) return ligne.label;
  return `${ligne.label} — moyenne de ${ANNEE_LABEL[ligne.annee].toLowerCase()}`;
}

export const DOMAINE_LABEL: Record<BacDomaine, string> = {
  sciences: 'Sciences',
  langues: 'Langues',
  lettres: 'Lettres et philosophie',
  humanites: 'Humanités',
  'eps-arts': 'EPS et arts',
  'grand-oral': 'Grand oral',
};

export const DOMAINE_ORDER: readonly BacDomaine[] = [
  'sciences',
  'lettres',
  'langues',
  'humanites',
  'eps-arts',
  'grand-oral',
] as const;

/**
 * Une teinte par domaine, déclinée en nuances pour distinguer les lignes d'un
 * même domaine sans avoir à donner une couleur à chaque matière.
 */
const DOMAINE_NUANCES: Record<BacDomaine, readonly string[]> = {
  sciences: ['#4338ca', '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc'],
  lettres: ['#0369a1', '#0ea5e9', '#38bdf8', '#7dd3fc'],
  langues: ['#0f766e', '#14b8a6', '#2dd4bf', '#5eead4'],
  humanites: ['#b45309', '#f59e0b', '#fbbf24', '#fcd34d'],
  'eps-arts': ['#be123c', '#f43f5e', '#fb7185', '#fda4af'],
  'grand-oral': ['#a21caf', '#d946ef', '#e879f9'],
};

const anneeDuBloc = (bloc: BacBloc): BacAnnee =>
  bloc === 'anticipee' ? 'premiere' : 'terminale';

function lignesDuCoefficient(c: BacCoefficient): SimulateurLigne[] {
  // Sans `repartition`, le coefficient se joue d'un bloc : une seule note.
  const parts = c.repartition ?? [{ annee: anneeDuBloc(c.bloc), part: c.coefficient }];
  const partagee = parts.length > 1;
  return parts.map((p) => ({
    id: partagee ? `${c.id}--${p.annee}` : c.id,
    coefficientId: c.id,
    label: c.label,
    bloc: c.bloc,
    domaine: c.domaine,
    annee: p.annee,
    coefficient: p.part,
    partagee,
    quand: c.quand,
    portee: c.portee,
    ...(c.profilNote === undefined ? {} : { profilNote: c.profilNote }),
  }));
}

const lignes: SimulateurLigne[] = listBacCoefficients().flatMap(lignesDuCoefficient);

/** Couleur de la ligne : la teinte de son domaine, nuancée par son rang. */
const couleurParLigne = new Map<string, string>(
  DOMAINE_ORDER.flatMap((domaine) => {
    const nuances = DOMAINE_NUANCES[domaine];
    return lignes
      .filter((l) => l.domaine === domaine)
      .map((l, index): [string, string] => [
        l.id,
        nuances[index % nuances.length] ?? nuances[0] ?? '#64748b',
      ]);
  })
);

export function listSimulateurLignes(): SimulateurLigne[] {
  return lignes;
}

export function couleurLigne(id: string): string {
  return couleurParLigne.get(id) ?? '#64748b';
}

/** Le dénominateur de la moyenne : 104, repris du barème. */
export function totalSimulateur(): number {
  return totalCoefficients();
}

/** Bornée à [0 ; 20] et arrêtée au quart de point, comme un bulletin. */
export function clampNote(note: number): number {
  if (!Number.isFinite(note)) return 10;
  return Math.round(Math.min(20, Math.max(0, note)) * 4) / 4;
}

/** La note d'une ligne, 10 par défaut tant que rien n'a été saisi. */
export function noteDe(notes: Readonly<Record<string, number>>, id: string): number {
  const v = notes[id];
  return typeof v === 'number' && Number.isFinite(v) ? clampNote(v) : 10;
}

/** Moyenne pondérée : Σ(note × coefficient) ÷ total des coefficients. */
export function moyenne(notes: Readonly<Record<string, number>>): number {
  let points = 0;
  let total = 0;
  for (const ligne of lignes) {
    points += noteDe(notes, ligne.id) * ligne.coefficient;
    total += ligne.coefficient;
  }
  return total === 0 ? 0 : points / total;
}

/** Ce que cette note apporte à la moyenne finale. */
export function contribution(ligne: SimulateurLigne, note: number): number {
  return (note * ligne.coefficient) / totalSimulateur();
}

/** Ce qu'un point de plus sur cette ligne ajoute à la moyenne finale. */
export function gainParPoint(ligne: SimulateurLigne): number {
  return ligne.coefficient / totalSimulateur();
}

/** Paliers du plus bas au plus haut : `mentions.json` trié par seuil. */
const paliers = [...listBacMentions()].sort((a, b) => a.seuil - b.seuil);

/** Le palier atteint : le plus haut dont le seuil est franchi. */
export function mentionPour(m: number): BacMention | undefined {
  let atteint: BacMention | undefined;
  for (const palier of paliers) {
    if (m >= palier.seuil) atteint = palier;
  }
  return atteint;
}

/** Le palier suivant, ou `undefined` quand le plus haut est déjà atteint. */
export function prochainPalier(m: number): BacMention | undefined {
  return paliers.find((palier) => m < palier.seuil);
}

/** Ce que la ligne peut encore rapporter si la note montait jusqu'à 20. */
export function potentiel(ligne: SimulateurLigne, note: number): number {
  return ((20 - note) * ligne.coefficient) / totalSimulateur();
}

/**
 * Les leviers : parmi les notes non figées, celles qui peuvent encore rapporter
 * le plus — le coefficient compte, mais une note déjà proche de 20 ne rapporte
 * plus grand-chose.
 */
export function leviers(
  notes: Readonly<Record<string, number>>,
  figees: Readonly<Record<string, boolean>>,
  combien = 3
): SimulateurLigne[] {
  return lignes
    .filter((l) => !figees[l.id] && potentiel(l, noteDe(notes, l.id)) > 0)
    .sort(
      (a, b) =>
        potentiel(b, noteDe(notes, b.id)) - potentiel(a, noteDe(notes, a.id)) ||
        b.coefficient - a.coefficient ||
        a.label.localeCompare(b.label, 'fr')
    )
    .slice(0, combien);
}

/** Notes affichées avec la virgule française. */
export function fmt(x: number, decimales = 2): string {
  return x.toFixed(decimales).replace('.', ',');
}
