import type { ReponseNumerique } from './types';

/**
 * Contrôle des réponses vérifiables de la terminale (charte § 3.6) : « vérifie » du
 * cours, marche 1, questions éclair. Logique pure, testée.
 */

/**
 * Lit un nombre saisi par l'élève : virgule ou point, espaces ignorés, fraction
 * « a/b » acceptée. `null` si la saisie n'est pas un nombre.
 */
export function lireNombre(saisie: string): number | null {
  const propre = saisie.replace(/[\s  ]/g, '').replace(/,/g, '.').replace(/−/g, '-');
  if (propre === '') return null;
  const fraction = /^([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)$/.exec(propre);
  if (fraction) {
    const numerateur = Number(fraction[1]);
    const denominateur = Number(fraction[2]);
    if (denominateur === 0) return null;
    return numerateur / denominateur;
  }
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i.test(propre)) return null;
  const valeur = Number(propre);
  return Number.isFinite(valeur) ? valeur : null;
}

/** Valeur attendue d'une réponse numérique (nombre ou fraction « a/b »). */
export function valeurAttendue(reponse: Pick<ReponseNumerique, 'valeur'>): number | null {
  return typeof reponse.valeur === 'number' ? reponse.valeur : lireNombre(reponse.valeur);
}

/** La saisie est-elle juste, à la tolérance (absolue ou relative) près ? */
export function numeriqueJuste(
  reponse: Pick<ReponseNumerique, 'valeur' | 'tolerance' | 'toleranceRelative'>,
  saisie: string
): boolean {
  const lu = lireNombre(saisie);
  const attendu = valeurAttendue(reponse);
  if (lu === null || attendu === null) return false;
  const ecart = Math.abs(lu - attendu);
  const marge =
    reponse.toleranceRelative !== undefined
      ? Math.abs(attendu) * reponse.toleranceRelative
      : (reponse.tolerance ?? 0);
  return ecart <= marge + 1e-9;
}

/** Choix multiples : juste si l'élève a coché exactement les bonnes réponses. */
export function choixMultiplesJustes(bonnes: readonly number[], coches: readonly number[]): boolean {
  const attendues = new Set(bonnes);
  const donnees = new Set(coches);
  return attendues.size === donnees.size && [...attendues].every((i) => donnees.has(i));
}

/** Remise en ordre : juste si la suite proposée est celle du contenu. */
export function ordreJuste(elements: readonly string[], propose: readonly string[]): boolean {
  return elements.length === propose.length && elements.every((e, i) => propose[i] === e);
}

/** Petit générateur pseudo-aléatoire déterministe (même graine, même tirage). */
function generateur(graine: string): () => number {
  let etat = 2166136261;
  for (let i = 0; i < graine.length; i++) {
    etat ^= graine.charCodeAt(i);
    etat = Math.imul(etat, 16777619);
  }
  return () => {
    etat = Math.imul(etat ^ (etat >>> 15), 2246822507);
    etat = Math.imul(etat ^ (etat >>> 13), 3266489909);
    etat ^= etat >>> 16;
    return (etat >>> 0) / 4294967296;
  };
}

/**
 * Mélange les éléments d'une remise en ordre, de façon stable pour une même graine
 * (identifiant de la question), et jamais dans l'ordre juste quand c'est possible.
 */
export function melanger<T>(elements: readonly T[], graine: string): T[] {
  const tirage = generateur(graine);
  const copie = [...elements];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(tirage() * (i + 1));
    [copie[i], copie[j]] = [copie[j] as T, copie[i] as T];
  }
  const inchange = copie.every((e, i) => e === elements[i]);
  if (inchange && copie.length > 1) {
    const premier = copie.shift() as T;
    copie.push(premier);
  }
  return copie;
}
