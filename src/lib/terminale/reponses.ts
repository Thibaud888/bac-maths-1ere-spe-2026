import type { ReponseNumerique } from './types';

/**
 * Contrôle des réponses vérifiables de la terminale (charte § 3.6) : « vérifie » du
 * cours, marche 1, questions éclair. Logique pure, testée.
 */

const EXPOSANTS: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+',
};

/**
 * Lit un nombre saisi par l'élève : virgule ou point, espaces ignorés, fraction
 * « a/b », écriture scientifique (« 2,0×10^-3 », « 4x10^3 », « 10^4 », « 1e4 »)
 * acceptées. `null` si la saisie n'est pas un nombre.
 */
export function lireNombre(saisie: string): number | null {
  const propre = saisie
    .replace(/[\s  ]/g, '')
    .replace(/,/g, '.')
    .replace(/−/g, '-')
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g, (exp) => '^' + [...exp].map((c) => EXPOSANTS[c]).join(''));
  if (propre === '') return null;
  // Puissance de dix : « 2.0×10^-3 » (signe de multiplication obligatoire après la
  // mantisse), ou « 10^4 » / « -10^4 » seul.
  const puissance =
    /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))[×x*·]10\^\(?([+-]?\d+)\)?$/i.exec(propre) ??
    /^([+-]?)10\^\(?([+-]?\d+)\)?$/.exec(propre);
  if (puissance) {
    const [, mantisse = '', exposant = '0'] = puissance;
    const facteur = mantisse === '' || mantisse === '+' ? 1 : mantisse === '-' ? -1 : Number(mantisse);
    const valeur = facteur * 10 ** Number(exposant);
    return Number.isFinite(valeur) ? valeur : null;
  }
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

/**
 * Écriture LaTeX de la valeur attendue, telle que « Voir la réponse » l'affiche : avec ses
 * `decimales` (un pH : 3,40) ou ses `chiffresSignificatifs` (2,0 ; 1,2 × 10⁴), sinon telle
 * que le contenu l'écrit. Virgule décimale `{,}` (charte § 10) ; fraction « a/b » gardée.
 */
export function ecritureValeurAttendue(
  reponse: Pick<ReponseNumerique, 'valeur' | 'decimales' | 'chiffresSignificatifs'>
): string {
  const { valeur } = reponse;
  if (typeof valeur === 'string') return valeur;
  let texte: string;
  if (reponse.decimales !== undefined) texte = valeur.toFixed(reponse.decimales);
  else if (reponse.chiffresSignificatifs !== undefined) texte = valeur.toPrecision(reponse.chiffresSignificatifs);
  else texte = String(valeur);
  const [mantisse = texte, exposant] = texte.split('e');
  const decimal = mantisse.replace('.', '{,}');
  return exposant === undefined ? decimal : `${decimal} \\times 10^{${Number(exposant)}}`;
}

/** La saisie est-elle juste, à la tolérance (absolue ou relative) près ? */
export function numeriqueJuste(
  reponse: Pick<ReponseNumerique, 'valeur' | 'tolerance' | 'toleranceRelative' | 'unite'>,
  saisie: string
): boolean {
  const lu = lireNombre(saisie);
  const attendu = valeurAttendue(reponse);
  if (lu === null || attendu === null) return false;
  const marge =
    reponse.toleranceRelative !== undefined
      ? Math.abs(attendu) * reponse.toleranceRelative
      : (reponse.tolerance ?? 0);
  if (Math.abs(lu - attendu) <= marge + 1e-9) return true;
  // Unité « × 10^{n} … » : l'élève complète le nombre devant la puissance de dix, mais
  // peut aussi écrire la valeur entière (« 2,5×10^-7 » pour « … × 10^{-7} »).
  const n = puissanceDeLUnite(reponse.unite);
  if (n === null) return false;
  return Math.abs(lu / 10 ** n - attendu) <= marge + 1e-9;
}

/** Exposant d'une unité qui commence par « \\times 10^{n} » (saisie de la mantisse), sinon null. */
export function puissanceDeLUnite(unite: string | undefined): number | null {
  const m = /^\s*\\times\s*10\^\{?\s*([+-]?\d+)\s*\}?/.exec(unite ?? '');
  return m ? Number(m[1]) : null;
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
