import type { Chapitre, Notion, Priorite } from './types';

/**
 * Progression par notion (charte § 11) : à découvrir → découverte → comprise →
 * maîtrisée. Logique pure : les pages lui passent ce que l'élève a fait (stocké
 * sous `btm-2027-` / `bpc-2027-`), elle en déduit l'état de chaque notion et la
 * maîtrise d'un chapitre, pondérée par la priorité des notions.
 */

/** Auto-évaluation d'un exercice, ou résultat d'un exercice à réponse vérifiable. */
export type Resultat = 'reussi' | 'moitie' | 'rate';

/** Ce que l'élève a fait dans une matière. Les clés sont des identifiants publiés. */
export type Progression = {
  /** Notions dont la page de cours a été ouverte. */
  lus: Record<string, boolean>;
  /** Blocs `verifie` répondus : juste ou non au dernier essai. */
  verifies: Record<string, boolean>;
  /** Exercices (`x-…`) et exercices type bac (`tb-…`) : dernier résultat. */
  resultats: Record<string, Resultat>;
  /** Questions éclair (`fl-…`) : essais et réponses justes. */
  flash: Record<string, { essais: number; justes: number }>;
};

export const PROGRESSION_VIDE: Progression = { lus: {}, verifies: {}, resultats: {}, flash: {} };

export type EtatNotion = 'a-decouvrir' | 'decouverte' | 'comprise' | 'maitrisee';

export const ETATS: readonly EtatNotion[] = ['a-decouvrir', 'decouverte', 'comprise', 'maitrisee'];

export const LIBELLE_ETAT: Record<EtatNotion, string> = {
  'a-decouvrir': 'À découvrir',
  decouverte: 'Découverte',
  comprise: 'Comprise',
  maitrisee: 'Maîtrisée',
};

/** Seuils réglables (charte § 11). */
export type Seuils = {
  /** Part des exercices « Comprendre » réussis pour « comprise ». */
  comprendre: number;
  /** Part des exercices « S'entraîner » réussis pour « maîtrisée ». */
  entrainer: number;
  /** Nombre d'exercices « Approfondir » ou type bac réussis pour « maîtrisée ». */
  approfondir: number;
  /** Part de réponses justes aux questions éclair pour « maîtrisée ». */
  eclair: number;
};

export const SEUILS: Seuils = { comprendre: 0.75, entrainer: 0.5, approfondir: 1, eclair: 0.8 };

type Compte = { total: number; reussis: number };

export type BilanNotion = {
  lu: boolean;
  /** Blocs `verifie` de la section de la notion. */
  verifies: { total: number; repondus: number };
  /** Marche 1 dont la notion est la notion principale. */
  comprendre: Compte;
  /** Marche 2 dont la notion est la notion principale. */
  entrainer: Compte;
  /** Marche 3 et type bac qui citent la notion. */
  approfondir: Compte;
  /** Questions éclair de la notion : combien ont été tentées, taux de réussite. */
  eclair: { total: number; tentees: number; essais: number; justes: number };
};

/** « À moitié » compte pour un demi. */
function valeur(resultat: Resultat | undefined): number {
  if (resultat === 'reussi') return 1;
  if (resultat === 'moitie') return 0.5;
  return 0;
}

function compter(ids: readonly string[], progression: Progression): Compte {
  return {
    total: ids.length,
    reussis: ids.reduce((somme, id) => somme + valeur(progression.resultats[id]), 0),
  };
}

/** Ce que l'élève a fait sur une notion, lu dans le chapitre et sa progression. */
export function bilanNotion(chapitre: Chapitre, notionId: string, progression: Progression): BilanNotion {
  const section = chapitre.cours?.sections.find((s) => s.notion === notionId);
  const verifies = (section?.blocs ?? []).filter((b) => b.type === 'verifie').map((b) => b.id);
  const principale = (niveau: number) =>
    chapitre.exercices.filter((x) => x.niveau === niveau && x.notions[0] === notionId).map((x) => x.id);
  const approfondir = [
    ...chapitre.exercices.filter((x) => x.niveau === 3 && x.notions.includes(notionId)).map((x) => x.id),
    ...chapitre.typeBac.filter((t) => t.notions.includes(notionId)).map((t) => t.id),
  ];
  const eclair = chapitre.flash.filter((f) => f.notion === notionId).map((f) => f.id);
  const stats = eclair.map((id) => progression.flash[id]);

  return {
    lu: progression.lus[notionId] === true,
    verifies: {
      total: verifies.length,
      repondus: verifies.filter((id) => id in progression.verifies).length,
    },
    comprendre: compter(principale(1), progression),
    entrainer: compter(principale(2), progression),
    approfondir: compter(approfondir, progression),
    eclair: {
      total: eclair.length,
      tentees: stats.filter((s) => s !== undefined && s.essais > 0).length,
      essais: stats.reduce((n, s) => n + (s?.essais ?? 0), 0),
      justes: stats.reduce((n, s) => n + (s?.justes ?? 0), 0),
    },
  };
}

/**
 * État d'une notion :
 * - **découverte** : page lue et tous ses « vérifie » répondus ;
 * - **comprise** : en plus, au moins 75 % des exercices « Comprendre » réussis ;
 * - **maîtrisée** : en plus, la moitié des « S'entraîner » réussis, un « Approfondir »
 *   ou type bac réussi, et 80 % de réponses justes aux questions éclair, toutes tentées.
 *   Une exigence sans exercice pour la porter ne bloque pas (sauf « Comprendre »).
 */
export function etatNotion(bilan: BilanNotion, seuils: Seuils = SEUILS): EtatNotion {
  if (!bilan.lu || bilan.verifies.repondus < bilan.verifies.total) return 'a-decouvrir';

  const { comprendre, entrainer, approfondir, eclair } = bilan;
  if (comprendre.total === 0 || comprendre.reussis / comprendre.total < seuils.comprendre) {
    return 'decouverte';
  }

  const entraine = entrainer.total === 0 || entrainer.reussis / entrainer.total >= seuils.entrainer;
  const approfondi =
    approfondir.total === 0 || approfondir.reussis >= Math.min(seuils.approfondir, approfondir.total);
  const eclairOk =
    eclair.total === 0 ||
    (eclair.tentees === eclair.total && eclair.essais > 0 && eclair.justes / eclair.essais >= seuils.eclair);

  return entraine && approfondi && eclairOk ? 'maitrisee' : 'comprise';
}

/** Part d'une notion acquise selon son état. */
const PART: Record<EtatNotion, number> = {
  'a-decouvrir': 0,
  decouverte: 1 / 3,
  comprise: 2 / 3,
  maitrisee: 1,
};

/** État de chaque notion d'un chapitre. */
export function etatsChapitre(
  chapitre: Chapitre,
  progression: Progression,
  seuils: Seuils = SEUILS
): Map<string, EtatNotion> {
  return new Map(
    chapitre.notions.map((n) => [n.id, etatNotion(bilanNotion(chapitre, n.id, progression), seuils)])
  );
}

/**
 * Maîtrise d'un chapitre, entre 0 et 1 : moyenne des parts acquises, chaque notion
 * pesant sa priorité (un chapitre « maîtrisé à 80 % » l'est sur ce qui compte).
 */
export function maitriseChapitre(
  notions: readonly Pick<Notion, 'id' | 'priorite'>[],
  etats: ReadonlyMap<string, EtatNotion>
): number {
  const poids = notions.reduce((s, n) => s + n.priorite, 0);
  if (poids === 0) return 0;
  const acquis = notions.reduce((s, n) => s + n.priorite * PART[etats.get(n.id) ?? 'a-decouvrir'], 0);
  return acquis / poids;
}

/** Le chapitre a-t-il été commencé (au moins une notion ouverte) ? */
export function chapitreCommence(chapitre: Chapitre, progression: Progression): boolean {
  return chapitre.notions.some((n) => progression.lus[n.id] === true);
}

/**
 * « À revoir en priorité » : les notions commencées mais pas maîtrisées, les plus
 * importantes d'abord, dans l'ordre de l'année.
 */
export function aRevoir(
  chapitres: readonly Chapitre[],
  progression: Progression,
  priorites: readonly Priorite[] = [3],
  seuils: Seuils = SEUILS
): { chapitre: Chapitre; notion: Notion; etat: EtatNotion }[] {
  const liste: { chapitre: Chapitre; notion: Notion; etat: EtatNotion }[] = [];
  for (const chapitre of chapitres) {
    const etats = etatsChapitre(chapitre, progression, seuils);
    for (const notion of chapitre.notions) {
      const etat = etats.get(notion.id) ?? 'a-decouvrir';
      if (priorites.includes(notion.priorite) && progression.lus[notion.id] && etat !== 'maitrisee') {
        liste.push({ chapitre, notion, etat });
      }
    }
  }
  return liste.sort((a, b) => b.notion.priorite - a.notion.priorite);
}
