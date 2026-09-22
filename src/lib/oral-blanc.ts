/**
 * Minuteur de l'oral blanc du grand oral : logique pure, sans horloge ni React.
 *
 * Le temps est compté à partir d'horodatages (`now`, en millisecondes) et non
 * en additionnant des tics : un onglet mis en arrière-plan ou un téléphone
 * verrouillé ralentit les `setInterval`, pas l'horloge. Les durées de chaque
 * phase ne sont pas ici : elles viennent de `content/terminale/grand-oral/deroule.json`.
 */

/** Un chronomètre qu'on peut suspendre et reprendre. */
export type Chrono = {
  /** Temps écoulé avant le dernier démarrage, en millisecondes. */
  cumulMs: number;
  /** Horodatage du dernier démarrage ; `null` quand le chrono est suspendu. */
  depuis: number | null;
};

export const CHRONO_ARRETE: Chrono = { cumulMs: 0, depuis: null };

export function enMarche(chrono: Chrono): boolean {
  return chrono.depuis !== null;
}

export function demarrer(chrono: Chrono, now: number): Chrono {
  if (chrono.depuis !== null) return chrono;
  return { cumulMs: chrono.cumulMs, depuis: now };
}

export function suspendre(chrono: Chrono, now: number): Chrono {
  if (chrono.depuis === null) return chrono;
  return { cumulMs: ecouleMs(chrono, now), depuis: null };
}

export function ecouleMs(chrono: Chrono, now: number): number {
  const enCours = chrono.depuis === null ? 0 : Math.max(0, now - chrono.depuis);
  return chrono.cumulMs + enCours;
}

/** Secondes entières écoulées. */
export function ecouleSecondes(chrono: Chrono, now: number): number {
  return Math.floor(ecouleMs(chrono, now) / 1000);
}

/**
 * Secondes restantes sur une phase de `dureeSecondes`. Négatif une fois le
 * temps dépassé : le minuteur continue de compter pour montrer le dépassement.
 */
export function restantSecondes(dureeSecondes: number, chrono: Chrono, now: number): number {
  return dureeSecondes - ecouleSecondes(chrono, now);
}

function deuxChiffres(n: number): string {
  return n.toString().padStart(2, '0');
}

/** « 09:59 » ; un dépassement s'affiche « +00:35 ». */
export function formatHorloge(secondes: number): string {
  const abs = Math.abs(secondes);
  const texte = `${deuxChiffres(Math.floor(abs / 60))}:${deuxChiffres(abs % 60)}`;
  return secondes < 0 ? `+${texte}` : texte;
}

/** « 9 min 12 s », « 10 min », « 45 s ». */
export function formatDuree(secondes: number): string {
  const s = Math.max(0, Math.round(secondes));
  const min = Math.floor(s / 60);
  const reste = s % 60;
  if (min === 0) return `${reste} s`;
  if (reste === 0) return `${min} min`;
  return `${min} min ${deuxChiffres(reste)} s`;
}

/** Une séance d'oral blanc : la phase en cours et le temps réellement passé sur les précédentes. */
export type Seance = {
  /** Index de la phase en cours ; égal au nombre de phases une fois la séance finie. */
  index: number;
  chrono: Chrono;
  /** Secondes passées sur chaque phase terminée, dans l'ordre. */
  realise: number[];
};

/** Démarre la première phase. */
export function nouvelleSeance(now: number): Seance {
  return { index: 0, chrono: demarrer(CHRONO_ARRETE, now), realise: [] };
}

/**
 * Clôt la phase en cours (son temps est gardé) et lance la suivante ; après la
 * dernière, le chrono s'arrête et la séance est finie.
 */
export function phaseSuivante(seance: Seance, nbPhases: number, now: number): Seance {
  if (seance.index >= nbPhases) return seance;
  const realise = [...seance.realise, ecouleSecondes(seance.chrono, now)];
  const index = seance.index + 1;
  const chrono = index < nbPhases ? demarrer(CHRONO_ARRETE, now) : CHRONO_ARRETE;
  return { index, chrono, realise };
}

export function seanceFinie(seance: Seance, nbPhases: number): boolean {
  return seance.index >= nbPhases;
}

export function basculerPause(seance: Seance, now: number): Seance {
  const chrono = enMarche(seance.chrono)
    ? suspendre(seance.chrono, now)
    : demarrer(seance.chrono, now);
  return { ...seance, chrono };
}
