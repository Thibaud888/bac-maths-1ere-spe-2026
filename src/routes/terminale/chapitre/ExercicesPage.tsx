import { useMemo, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { TextWithMath } from '@/components/math/TextWithMath';
import ExerciceRunner from '@/components/terminale/ExerciceRunner';
import { NotionsTravaillees, Reperes } from '@/components/terminale/FicheExercice';
import SerieEclair from '@/components/terminale/SerieEclair';
import { prioriteDe } from '@/lib/terminale/content';
import {
  MARCHES,
  filtrerExercices,
  nomMarche,
  segmentExercice,
  serieEclair,
  trierExercices,
} from '@/lib/terminale/entrainement';
import { cheminChapitre } from '@/lib/terminale/matieres';
import type { Resultat } from '@/lib/terminale/progression';
import type { Chapitre, Exercice, Niveau, QuestionEclair } from '@/lib/terminale/types';
import { eclairReussie, questionsDe, storeProgression } from '@/stores/terminale-progression-store';
import { useChapitre } from './ChapitreLayout';

const ETAT: Record<Resultat | 'encours' | 'aucun', { libelle: string; style: string }> = {
  encours: { libelle: '… En cours', style: 'text-sky-700 dark:text-sky-300' },
  reussi: { libelle: '✓ Réussi', style: 'text-emerald-700 dark:text-emerald-300' },
  moitie: { libelle: '½ À moitié', style: 'text-amber-700 dark:text-amber-300' },
  rate: { libelle: '✗ À reprendre', style: 'text-rose-700 dark:text-rose-300' },
  aucun: { libelle: 'Pas fait', style: 'text-slate-500 dark:text-slate-400' },
};

/** Où en est un exercice : son résultat, sinon « En cours » s'il a des questions notées. */
export function EtatExercice({ resultat, enCours = false }: { resultat: Resultat | undefined; enCours?: boolean }) {
  const etat = ETAT[resultat ?? (enCours ? 'encours' : 'aucun')];
  return <span className={`whitespace-nowrap text-xs font-semibold ${etat.style}`}>{etat.libelle}</span>;
}

function lireNiveau(valeur: string | null): Niveau | undefined {
  return valeur === '1' || valeur === '2' || valeur === '3' ? (Number(valeur) as Niveau) : undefined;
}

/** Filtre lu dans l'adresse (`?niveau=1|2|3&notion=<id>`), notion vérifiée. */
function useFiltre(chapitre: Chapitre) {
  const [params] = useSearchParams();
  const niveau = lireNiveau(params.get('niveau'));
  const brute = params.get('notion') ?? undefined;
  const notion = brute && chapitre.notions.some((n) => n.id === brute) ? brute : undefined;
  return { niveau, notion, recherche: params.toString() };
}

/** Les exercices affichés, dans l'ordre de la charte : marche, puis priorité. */
function exercicesOrdonnes(chapitre: Chapitre, filtre: { niveau?: Niveau | undefined; notion?: string | undefined }) {
  const liste = filtrerExercices(chapitre.exercices, filtre);
  return MARCHES.flatMap((m) =>
    trierExercices(
      liste.filter((x) => x.niveau === m.niveau),
      (n) => prioriteDe(n)
    )
  );
}

function adresse(base: string, recherche: string): string {
  return recherche ? `${base}?${recherche}` : base;
}

/** Les questions éclair de la série, restreintes à la notion choisie s'il y en a une. */
function questionsEclair(chapitre: Chapitre, notion: string | undefined): QuestionEclair[] {
  const liste = notion ? chapitre.flash.filter((q) => q.notion === notion) : chapitre.flash;
  return serieEclair(liste, (n) => prioriteDe(n));
}

const PASTILLE =
  'rounded-full border px-3 py-1 text-sm font-medium transition-colors';
const PASTILLE_ACTIVE = {
  blue: 'border-blue-600 bg-blue-600 text-white dark:border-blue-400 dark:bg-blue-400 dark:text-slate-950',
  violet: 'border-violet-600 bg-violet-600 text-white dark:border-violet-400 dark:bg-violet-400 dark:text-slate-950',
} as const;
const PASTILLE_LIBRE =
  'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700';

/** Onglet « Exercices » : les trois marches, filtrables par marche et par notion. */
export default function ExercicesPage() {
  const { chapitre, matiere } = useChapitre();
  const [params, setParams] = useSearchParams();
  const { niveau, notion, recherche } = useFiltre(chapitre);
  const store = storeProgression(matiere.id);
  const resultats = store((s) => s.resultats);
  const questions = store((s) => s.questions);
  const flash = store((s) => s.flash);
  const base = `${cheminChapitre(chapitre.meta)}/exercices`;

  if (chapitre.exercices.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
          Les exercices de ce chapitre ne sont pas encore écrits.
        </p>
      </div>
    );
  }

  const choisir = (cle: 'niveau' | 'notion', valeur: string | undefined) => {
    const suivants = new URLSearchParams(params);
    if (valeur) suivants.set(cle, valeur);
    else suivants.delete(cle);
    setParams(suivants, { replace: true });
  };

  const marches = MARCHES.filter((m) => niveau === undefined || m.niveau === niveau);
  const liste = filtrerExercices(chapitre.exercices, { niveau, notion });
  const eclair = niveau === undefined ? questionsEclair(chapitre, notion) : [];
  const eclairAFaire = eclair.filter((q) => !eclairReussie(flash, q.id)).length;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-8 sm:py-8">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Marche">
          {[{ niveau: undefined, nom: 'Toutes les marches' }, ...MARCHES].map((m) => (
            <button
              key={m.nom}
              type="button"
              aria-pressed={niveau === m.niveau}
              onClick={() => {
                choisir('niveau', m.niveau ? String(m.niveau) : undefined);
              }}
              className={`${PASTILLE} ${niveau === m.niveau ? PASTILLE_ACTIVE[matiere.accent] : PASTILLE_LIBRE}`}
            >
              {m.nom}
            </button>
          ))}
        </div>
        <label className="flex flex-wrap items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          Notion :
          <select
            value={notion ?? ''}
            onChange={(e) => {
              choisir('notion', e.target.value || undefined);
            }}
            className="max-w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Toutes les notions</option>
            {chapitre.notions.map((n) => (
              <option key={n.id} value={n.id}>
                {n.titre.replace(/\$/g, '')}
              </option>
            ))}
          </select>
        </label>
      </div>

      {eclair.length > 0 && (
        <Link
          to={adresse(`${base}/eclair`, recherche)}
          className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <span className="block font-semibold text-slate-900 dark:text-slate-100">Questions éclair : teste-toi</span>
            <span className="block text-sm text-slate-600 dark:text-slate-400">
              {eclairAFaire === eclair.length
                ? `${eclair.length} questions, moins d’une minute chacune, les plus importantes d’abord.`
                : eclairAFaire === 0
                  ? `Les ${eclair.length} questions sont réussies : tu peux refaire la série pour t’entretenir.`
                  : `${eclairAFaire} questions à faire sur ${eclair.length} : celles déjà réussies ne reviennent pas.`}
            </span>
          </span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Commencer →</span>
        </Link>
      )}

      {liste.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400">Aucun exercice pour ce choix.</p>
      )}

      {marches.map((marche) => {
        const exercices = trierExercices(
          liste.filter((x) => x.niveau === marche.niveau),
          (n) => prioriteDe(n)
        );
        if (exercices.length === 0) return null;
        return (
          <section key={marche.niveau} aria-labelledby={`marche-${marche.niveau}`} className="space-y-3">
            <div>
              <h2 id={`marche-${marche.niveau}`} className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {marche.niveau}. {marche.nom}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{marche.but}</p>
            </div>
            <ul className="grid gap-3 md:grid-cols-2">
              {exercices.map((x) => (
                <li key={x.id}>
                  <Link
                    to={adresse(`${base}/${segmentExercice(x.id, chapitre.meta.slug)}`, recherche)}
                    className="flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-semibold leading-snug text-slate-900 dark:text-slate-100">
                        <TextWithMath text={x.titre} />
                      </span>
                      <EtatExercice
                        resultat={resultats[x.id]}
                        enCours={Object.keys(questionsDe(questions, x.id)).length > 0}
                      />
                    </span>
                    <Reperes duree={x.duree} calculatrice={x.calculatrice} />
                    <NotionsTravaillees notions={x.notions} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function Voisin({ vers, sens, exercice }: { vers: string; sens: 'precedent' | 'suivant'; exercice: Exercice }) {
  return (
    <Link
      to={vers}
      className={`flex min-w-0 flex-1 flex-col rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm transition-colors hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500 ${
        sens === 'suivant' ? 'sm:items-end sm:text-right' : ''
      }`}
    >
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {sens === 'suivant' ? 'Exercice suivant →' : '← Exercice précédent'} · {nomMarche(exercice.niveau)}
      </span>
      <span className="mt-0.5 font-semibold text-slate-900 dark:text-slate-100">
        <TextWithMath text={exercice.titre} />
      </span>
    </Link>
  );
}

/** Un exercice seul (`/exercices/<num>`), avec le filtre de la liste gardé dans l'adresse. */
export function ExercicePage() {
  const { chapitre, matiere } = useChapitre();
  const { exercice: segment = '' } = useParams<{ exercice: string }>();
  const filtre = useFiltre(chapitre);
  const store = storeProgression(matiere.id);
  const noterResultat = store((s) => s.noterResultat);
  const noterQuestion = store((s) => s.noterQuestion);
  const questions = store((s) => s.questions);
  const base = `${cheminChapitre(chapitre.meta)}/exercices`;

  const ordre = exercicesOrdonnes(chapitre, filtre);
  const exercice = chapitre.exercices.find((x) => segmentExercice(x.id, chapitre.meta.slug) === segment);
  if (!exercice) return <Navigate to={adresse(base, filtre.recherche)} replace />;

  const rang = ordre.findIndex((x) => x.id === exercice.id);
  const precedent = rang > 0 ? ordre[rang - 1] : undefined;
  const suivant = rang >= 0 ? ordre[rang + 1] : undefined;
  const lien = (x: Exercice) => adresse(`${base}/${segmentExercice(x.id, chapitre.meta.slug)}`, filtre.recherche);

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:px-8 sm:py-8">
      <Link
        to={adresse(base, filtre.recherche)}
        className="inline-block text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        ← Tous les exercices
      </Link>
      <ExerciceRunner
        key={exercice.id}
        exercice={exercice}
        matiere={matiere.id}
        dejaNotees={questionsDe(questions, exercice.id)}
        onQuestion={(questionId, r) => {
          noterQuestion(exercice.id, questionId, r);
        }}
        onTermine={(r) => {
          noterResultat(exercice.id, r);
        }}
      />
      {(precedent || suivant) && (
        <nav aria-label="Exercices voisins" className="flex flex-col gap-3 sm:flex-row">
          {precedent ? <Voisin vers={lien(precedent)} sens="precedent" exercice={precedent} /> : <span className="hidden flex-1 sm:block" />}
          {suivant ? <Voisin vers={lien(suivant)} sens="suivant" exercice={suivant} /> : <span className="hidden flex-1 sm:block" />}
        </nav>
      )}
    </div>
  );
}

/** Les questions éclair du chapitre (`/exercices/eclair`), une par une (charte § 8). */
export function EclairPage() {
  const { chapitre, matiere } = useChapitre();
  const filtre = useFiltre(chapitre);
  const store = storeProgression(matiere.id);
  const noterEclair = store((s) => s.noterEclair);
  const base = `${cheminChapitre(chapitre.meta)}/exercices`;
  const questions = questionsEclair(chapitre, filtre.notion);

  // Série figée à son début : une question réussie en cours de route ne doit pas
  // disparaître sous les yeux de l'élève. Les questions déjà réussies sont écartées ;
  // si toutes le sont, la série entière revient (« Tout refaire »).
  const [tour, setTour] = useState(0);
  const [toutRefaire, setToutRefaire] = useState(false);
  const serie = useMemo(() => {
    const flash = store.getState().flash;
    const aFaire = questions.filter((q) => !eclairReussie(flash, q.id));
    return { liste: toutRefaire ? questions : aFaire, toutesReussies: aFaire.length === 0 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour, toutRefaire, chapitre, filtre.notion, store]);

  if (questions.length === 0) return <Navigate to={adresse(base, filtre.recherche)} replace />;

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-8 sm:py-8">
      <Link
        to={adresse(base, filtre.recherche)}
        className="inline-block text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        ← Tous les exercices
      </Link>
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Questions éclair</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Moins d’une minute chacune, les plus importantes d’abord. Seul le premier essai compte ; une
          question réussie ne revient plus.
        </p>
      </div>
      {serie.liste.length === 0 ? (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Toutes les questions sont réussies
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Bravo. Tu peux refaire toute la série pour vérifier que tout est encore là.
          </p>
          <button
            type="button"
            onClick={() => {
              setToutRefaire(true);
              setTour((t) => t + 1);
            }}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
          >
            Tout refaire
          </button>
        </div>
      ) : (
        <SerieEclair
          key={tour}
          questions={serie.liste}
          onRepondre={noterEclair}
          onRecommencer={() => {
            setToutRefaire(false);
            setTour((t) => t + 1);
          }}
        />
      )}
    </div>
  );
}
