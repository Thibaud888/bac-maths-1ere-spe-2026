import { useEffect, useId, useMemo, useState } from 'react';
import { TextWithMath } from '@/components/math/TextWithMath';
import CodeSource from '@/components/terminale/CodeSource';
import Unite from '@/components/terminale/Unite';
import {
  choixMultiplesJustes,
  melanger,
  numeriqueJuste,
  ordreJuste,
} from '@/lib/terminale/reponses';
import type { QuestionVerifiable as Question, ReponseNumerique } from '@/lib/terminale/types';

type Props = {
  /** Identifiant de la question : graine du mélange des remises en ordre. */
  graine: string;
  question: Question;
  /** Appelé à chaque validation, et avec `false` quand l'élève affiche la réponse. */
  onRepondre?: (juste: boolean) => void;
  /**
   * Bouton « Voir la réponse » à côté de « Valider » (vrai par défaut). Les exercices le
   * retirent : ils le proposent après le dernier indice, par `demandeReponse`.
   */
  boutonReponse?: boolean;
  /** Chaque nouvelle valeur (> 0) affiche la réponse, comme le bouton. */
  demandeReponse?: number;
};

const CHOIX_BASE =
  'flex w-full items-start gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:cursor-default';
const CHOIX_LIBRE =
  'border-slate-200 bg-white hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-400';
const CHOIX_PRIS = 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:border-blue-400 dark:bg-blue-950/40';
const CHOIX_JUSTE =
  'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 dark:border-emerald-400 dark:bg-emerald-950/40';
const CHOIX_FAUX = 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-950/40';

const BOUTON =
  'rounded-md px-3 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40';
const BOUTON_PLEIN = `${BOUTON} bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300`;
const BOUTON_CLAIR = `${BOUTON} border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700`;

function lettre(index: number): string {
  return String.fromCharCode(65 + index);
}

function ValeurAttendue({ reponse }: { reponse: ReponseNumerique }) {
  const valeur = String(reponse.valeur).replace('.', ',');
  return (
    <span className="whitespace-nowrap font-semibold">
      <TextWithMath text={`$${valeur}$`} />
      {reponse.unite && (
        <>
          {' '}
          <Unite unite={reponse.unite} />
        </>
      )}
    </span>
  );
}

/**
 * Une question à réponse vérifiable (charte § 3.6) : choix unique ou multiple,
 * vrai-faux, valeur numérique, remise en ordre. L'élève répond, valide, lit la
 * correction, et peut réessayer. Sert aux « vérifie » du cours, aux exercices
 * « Comprendre » et aux questions éclair.
 */
export default function QuestionVerifiable({
  graine,
  question,
  onRepondre,
  boutonReponse = true,
  demandeReponse = 0,
}: Props) {
  const { reponse } = question;
  const idSaisie = useId();
  const melange = useMemo(
    () => (reponse.type === 'ordre' ? melanger(reponse.elements, graine) : []),
    [reponse, graine]
  );

  const [choix, setChoix] = useState<number | null>(null);
  const [coches, setCoches] = useState<number[]>([]);
  const [vraiFaux, setVraiFaux] = useState<boolean | null>(null);
  const [saisie, setSaisie] = useState('');
  const [ordre, setOrdre] = useState<string[]>(melange);
  const [verdict, setVerdict] = useState<boolean | null>(null);
  // Réponse affichée sans avoir été trouvée : elle compte comme ratée.
  const [revelee, setRevelee] = useState(false);

  const repondu = verdict !== null || revelee;

  const pret = (() => {
    switch (reponse.type) {
      case 'qcm':
        return choix !== null;
      case 'qcm-multiple':
        return coches.length > 0;
      case 'vrai-faux':
        return vraiFaux !== null;
      case 'numerique':
        return saisie.trim() !== '';
      case 'ordre':
        return true;
    }
  })();

  function valider(): void {
    let juste = false;
    switch (reponse.type) {
      case 'qcm':
        juste = choix === reponse.bonne;
        break;
      case 'qcm-multiple':
        juste = choixMultiplesJustes(reponse.bonnes, coches);
        break;
      case 'vrai-faux':
        juste = vraiFaux === reponse.valeur;
        break;
      case 'numerique':
        juste = numeriqueJuste(reponse, saisie);
        break;
      case 'ordre':
        juste = ordreJuste(reponse.elements, ordre);
        break;
    }
    setVerdict(juste);
    onRepondre?.(juste);
  }

  function voirReponse(): void {
    if (repondu) return;
    setRevelee(true);
    onRepondre?.(false);
  }

  useEffect(() => {
    if (demandeReponse > 0) voirReponse();
    // Seule une nouvelle demande compte, pas le reste de l'état.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demandeReponse]);

  function reessayer(): void {
    setVerdict(null);
    setRevelee(false);
    setChoix(null);
    setCoches([]);
    setVraiFaux(null);
    setSaisie('');
    setOrdre(melange);
  }

  function deplacer(index: number, sens: -1 | 1): void {
    setOrdre((actuel) => {
      const cible = index + sens;
      if (cible < 0 || cible >= actuel.length) return actuel;
      const copie = [...actuel];
      [copie[index], copie[cible]] = [copie[cible] as string, copie[index] as string];
      return copie;
    });
  }

  return (
    <div className="space-y-3">
      <div className="text-[15px] leading-relaxed text-slate-800 dark:text-slate-200">
        <TextWithMath text={question.enonce} />
      </div>
      {question.code && <CodeSource code={question.code} />}

      {reponse.type === 'qcm' && (
        <ul className="space-y-2">
          {reponse.choix.map((texte, index) => {
            const etat = !repondu
              ? choix === index
                ? CHOIX_PRIS
                : CHOIX_LIBRE
              : index === reponse.bonne
                ? CHOIX_JUSTE
                : index === choix && !revelee
                  ? CHOIX_FAUX
                  : CHOIX_LIBRE;
            return (
              <li key={index}>
                <button
                  type="button"
                  disabled={repondu}
                  aria-pressed={choix === index}
                  onClick={() => {
                    setChoix(index);
                  }}
                  className={`${CHOIX_BASE} ${etat}`}
                >
                  <span className="font-semibold text-slate-500 dark:text-slate-400">{lettre(index)}.</span>
                  <span className="min-w-0 flex-1 text-slate-800 dark:text-slate-200">
                    <TextWithMath text={texte} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {reponse.type === 'qcm-multiple' && (
        <>
          <p className="text-xs text-slate-500 dark:text-slate-400">Plusieurs réponses possibles.</p>
          <ul className="space-y-2">
            {reponse.choix.map((texte, index) => {
              const coche = coches.includes(index);
              const bonne = reponse.bonnes.includes(index);
              const etat = !repondu
                ? coche
                  ? CHOIX_PRIS
                  : CHOIX_LIBRE
                : bonne
                  ? CHOIX_JUSTE
                  : coche && !revelee
                    ? CHOIX_FAUX
                    : CHOIX_LIBRE;
              return (
                <li key={index}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={coche}
                    disabled={repondu}
                    onClick={() => {
                      setCoches((c) => (c.includes(index) ? c.filter((i) => i !== index) : [...c, index]));
                    }}
                    className={`${CHOIX_BASE} ${etat}`}
                  >
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                        coche
                          ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-400 dark:bg-blue-400 dark:text-slate-900'
                          : 'border-slate-400 dark:border-slate-500'
                      }`}
                      aria-hidden="true"
                    >
                      {coche ? '✓' : ''}
                    </span>
                    <span className="min-w-0 flex-1 text-slate-800 dark:text-slate-200">
                      <TextWithMath text={texte} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {reponse.type === 'vrai-faux' && (
        <div className="flex gap-2">
          {[true, false].map((valeur) => {
            const pris = vraiFaux === valeur;
            const etat = !repondu
              ? pris
                ? CHOIX_PRIS
                : CHOIX_LIBRE
              : valeur === reponse.valeur
                ? CHOIX_JUSTE
                : pris && !revelee
                  ? CHOIX_FAUX
                  : CHOIX_LIBRE;
            return (
              <button
                key={String(valeur)}
                type="button"
                disabled={repondu}
                aria-pressed={pris}
                onClick={() => {
                  setVraiFaux(valeur);
                }}
                className={`${CHOIX_BASE} w-auto justify-center px-5 font-semibold text-slate-800 dark:text-slate-200 ${etat}`}
              >
                {valeur ? 'Vrai' : 'Faux'}
              </button>
            );
          })}
        </div>
      )}

      {reponse.type === 'numerique' && (
        <div>
          <label htmlFor={idSaisie} className="text-xs text-slate-500 dark:text-slate-400">
            Ta réponse (virgule ou fraction a/b acceptées)
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              id={idSaisie}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={saisie}
              disabled={repondu}
              onChange={(e) => {
                setSaisie(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && pret && !repondu) valider();
              }}
              className="w-40 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-70 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
            {reponse.unite && (
              <span className="text-sm text-slate-600 dark:text-slate-400">
                <Unite unite={reponse.unite} />
              </span>
            )}
          </div>
        </div>
      )}

      {reponse.type === 'ordre' && (
        <ol className="space-y-2">
          {ordre.map((element, index) => (
            <li
              key={element}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            >
              <span className="w-5 shrink-0 text-right font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                {index + 1}.
              </span>
              <span className="min-w-0 flex-1 text-slate-800 dark:text-slate-200">
                <TextWithMath text={element} />
              </span>
              {!repondu && (
                <span className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      deplacer(index, -1);
                    }}
                    disabled={index === 0}
                    aria-label="Monter"
                    className="rounded border border-slate-300 px-1.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deplacer(index, 1);
                    }}
                    disabled={index === ordre.length - 1}
                    aria-label="Descendre"
                    className="rounded border border-slate-300 px-1.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    ↓
                  </button>
                </span>
              )}
            </li>
          ))}
        </ol>
      )}

      {!repondu ? (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={valider} disabled={!pret} className={BOUTON_PLEIN}>
            Valider
          </button>
          {boutonReponse && (
            <button type="button" onClick={voirReponse} className={BOUTON_CLAIR}>
              Voir la réponse
            </button>
          )}
        </div>
      ) : (
        <div
          role="status"
          className={`space-y-2 rounded-lg border p-3 text-sm leading-relaxed ${
            revelee
              ? 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50'
              : verdict
                ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/30'
                : 'border-rose-200 bg-rose-50/60 dark:border-rose-900 dark:bg-rose-950/30'
          }`}
        >
          <p
            className={`font-semibold ${
              revelee
                ? 'text-slate-800 dark:text-slate-200'
                : verdict
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-rose-800 dark:text-rose-300'
            }`}
          >
            {revelee ? 'La réponse' : verdict ? '✓ Juste.' : '✗ Pas tout à fait.'}
          </p>
          {revelee && (reponse.type === 'qcm' || reponse.type === 'qcm-multiple') && (
            <p className="text-slate-700 dark:text-slate-300">
              {reponse.type === 'qcm'
                ? `Bonne réponse : ${lettre(reponse.bonne)}.`
                : `Bonnes réponses : ${reponse.bonnes
                    .slice()
                    .sort((a, b) => a - b)
                    .map(lettre)
                    .join(', ')}.`}
            </p>
          )}
          {!verdict && !revelee && reponse.type === 'qcm' && choix !== null && reponse.pourquoiFaux?.[choix] && (
            <div className="text-slate-700 dark:text-slate-300">
              <TextWithMath text={reponse.pourquoiFaux[choix] ?? ''} />
            </div>
          )}
          {!verdict && reponse.type === 'numerique' && (
            <p className="text-slate-700 dark:text-slate-300">
              Réponse attendue : <ValeurAttendue reponse={reponse} />
            </p>
          )}
          {!verdict && reponse.type === 'ordre' && (
            <div className="text-slate-700 dark:text-slate-300">
              <p>Le bon ordre :</p>
              <ol className="ml-5 mt-1 list-decimal space-y-0.5">
                {reponse.elements.map((element) => (
                  <li key={element}>
                    <TextWithMath text={element} />
                  </li>
                ))}
              </ol>
            </div>
          )}
          {reponse.type === 'vrai-faux' && (
            <div className="text-slate-700 dark:text-slate-300">
              <span className="font-semibold">{reponse.valeur ? 'C’est vrai.' : 'C’est faux.'}</span>{' '}
              <TextWithMath text={reponse.justification} />
            </div>
          )}
          <div className="text-slate-700 dark:text-slate-300">
            <TextWithMath text={question.explication} />
          </div>
          <button type="button" onClick={reessayer} className={BOUTON_CLAIR}>
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}
