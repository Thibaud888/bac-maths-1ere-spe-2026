import { useEffect, useMemo } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { TextWithMath } from '@/components/math/TextWithMath';
import PageLongue from '@/components/shared/PageLongue';
import type { SommaireEntree } from '@/components/shared/Sommaire';
import BlocCours, { NOM_BLOC } from '@/components/terminale/BlocCours';
import EtiquettePriorite from '@/components/terminale/EtiquettePriorite';
import PastilleEtat from '@/components/terminale/PastilleEtat';
import { notionParSegment, segmentNotion } from '@/lib/terminale/content';
import { cheminChapitre, cheminNotion } from '@/lib/terminale/matieres';
import { etatsChapitre, type EtatNotion } from '@/lib/terminale/progression';
import type { Bloc, Chapitre, Notion } from '@/lib/terminale/types';
import { storeProgression, useProgression } from '@/stores/terminale-progression-store';
import { useChapitre } from './ChapitreLayout';

/** `/cours` seul : la dernière notion lue du chapitre, sinon la première. */
export function CoursIndex() {
  const { chapitre, matiere } = useChapitre();
  const derniere = storeProgression(matiere.id)((s) => s.derniereNotion[chapitre.meta.slug]);
  const cible =
    (derniere ? notionParSegment(chapitre, derniere) : undefined) ?? chapitre.notions[0];
  if (!cible) return <Navigate to={cheminChapitre(chapitre.meta)} replace />;
  return <Navigate to={cheminNotion(chapitre, cible)} replace />;
}

/** Blocs repris dans le sommaire de la page : ceux qu'on cherche en relisant. */
const DANS_LE_SOMMAIRE: ReadonlySet<Bloc['type']> = new Set([
  'idee',
  'definition',
  'propriete',
  'demonstration',
  'exemple',
  'methode',
  'code',
  'piege',
  'figure',
  'anime',
  'experience',
  'complement',
  'retenir',
]);

function entreeSommaire(bloc: Bloc): SommaireEntree | null {
  if (!DANS_LE_SOMMAIRE.has(bloc.type)) return null;
  const titre = bloc.titre;
  const avecNom = bloc.type === 'exemple' || bloc.type === 'methode' || bloc.type === 'code';
  if (!titre || bloc.type === 'idee' || bloc.type === 'retenir' || bloc.type === 'piege') {
    return { id: bloc.id, label: NOM_BLOC[bloc.type] };
  }
  return {
    id: bloc.id,
    label: avecNom ? (
      <>
        {NOM_BLOC[bloc.type]} : <TextWithMath text={titre} />
      </>
    ) : (
      <TextWithMath text={titre} />
    ),
  };
}

const COURANTE = {
  blue: 'border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-200',
  violet:
    'border-violet-600 bg-violet-50 text-violet-900 dark:border-violet-400 dark:bg-violet-950/40 dark:text-violet-200',
} as const;

/** Les notions du chapitre, dans l'ordre du cours, celle qu'on lit surlignée. */
function NotionsDuChapitre({
  chapitre,
  courante,
  etats,
  accent,
}: {
  chapitre: Chapitre;
  courante: string;
  etats: ReadonlyMap<string, EtatNotion>;
  accent: keyof typeof COURANTE;
}) {
  return (
    <nav aria-label="Notions du chapitre" className="text-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        Notions du chapitre
      </p>
      <ol className="mt-3 space-y-1">
        {chapitre.notions.map((notion, index) => {
          const actif = notion.id === courante;
          return (
            <li key={notion.id}>
              <Link
                to={cheminNotion(chapitre, notion)}
                aria-current={actif ? 'page' : undefined}
                className={`block rounded-md border-l-2 px-2 py-1.5 leading-snug transition-colors ${
                  actif
                    ? `font-semibold ${COURANTE[accent]}`
                    : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span className="flex items-start gap-2">
                  <span className="w-4 shrink-0 text-right tabular-nums">{index + 1}.</span>
                  <span className="min-w-0 flex-1">
                    <TextWithMath text={notion.titre} />
                  </span>
                </span>
                <span className="ml-6 mt-1 flex flex-wrap items-center gap-2">
                  <EtiquettePriorite priorite={notion.priorite} estimee={notion.priorisation === 'estimation'} forme="courte" />
                  {etats.get(notion.id) !== 'a-decouvrir' && (
                    <PastilleEtat etat={etats.get(notion.id) ?? 'a-decouvrir'} />
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const CARTE_VOISINE =
  'flex min-w-0 flex-1 flex-col rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm transition-colors hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500';

/** Notion précédente / suivante. */
function Voisines({
  chapitre,
  precedente,
  suivante,
}: {
  chapitre: Chapitre;
  precedente: Notion | undefined;
  suivante: Notion | undefined;
}) {
  if (!precedente && !suivante) return null;
  return (
    <nav aria-label="Notions voisines" className="flex flex-col gap-3 sm:flex-row">
      {precedente ? (
        <Link to={cheminNotion(chapitre, precedente)} className={CARTE_VOISINE}>
          <span className="text-xs text-slate-500 dark:text-slate-400">← Notion précédente</span>
          <span className="mt-0.5 font-semibold text-slate-900 dark:text-slate-100">
            <TextWithMath text={precedente.titre} />
          </span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
      {suivante ? (
        <Link to={cheminNotion(chapitre, suivante)} className={`${CARTE_VOISINE} sm:items-end sm:text-right`}>
          <span className="text-xs text-slate-500 dark:text-slate-400">Notion suivante →</span>
          <span className="mt-0.5 font-semibold text-slate-900 dark:text-slate-100">
            <TextWithMath text={suivante.titre} />
          </span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
    </nav>
  );
}

/** Une notion du cours sur sa propre page (charte § 11). */
export function CoursNotionPage() {
  const { chapitre, matiere } = useChapitre();
  const { notion: segment = '' } = useParams<{ notion: string }>();
  const { pathname } = useLocation();
  const store = storeProgression(matiere.id);
  const marquerLu = store((s) => s.marquerLu);
  const lireNotion = store((s) => s.lireNotion);
  const repondreVerifie = store((s) => s.repondreVerifie);
  const progression = useProgression(matiere.id);
  const etats = useMemo(() => etatsChapitre(chapitre, progression), [chapitre, progression]);

  const notion = notionParSegment(chapitre, segment);

  useEffect(() => {
    if (!notion) return;
    marquerLu(notion.id);
    lireNotion(chapitre.meta.slug, segmentNotion(notion));
  }, [notion, chapitre, marquerLu, lireNotion]);

  if (!notion) return <Navigate to={`${cheminChapitre(chapitre.meta)}/cours`} replace />;

  const rang = chapitre.notions.findIndex((n) => n.id === notion.id);
  const precedente = chapitre.notions[rang - 1];
  const suivante = chapitre.notions[rang + 1];
  const section = chapitre.cours?.sections.find((s) => s.notion === notion.id);
  const blocs = section?.blocs ?? [];
  const sommaire = blocs.map(entreeSommaire).filter((e): e is SommaireEntree => e !== null);

  const entete = (
    <header className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Notion {rang + 1} sur {chapitre.notions.length}
        </span>
        <EtiquettePriorite priorite={notion.priorite} estimee={notion.priorisation === 'estimation'} />
        <PastilleEtat etat={etats.get(notion.id) ?? 'a-decouvrir'} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        <TextWithMath text={notion.titre} />
      </h2>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        <span className="font-semibold">Pourquoi c’est important : </span>
        <TextWithMath text={notion.pourquoi} />
      </p>
      <div className="xl:hidden">
        <Voisines chapitre={chapitre} precedente={precedente} suivante={suivante} />
      </div>
    </header>
  );

  return (
    <PageLongue
      accent={matiere.accent}
      sommaire={sommaire}
      entete={entete}
      cote={
        <NotionsDuChapitre chapitre={chapitre} courante={notion.id} etats={etats} accent={matiere.accent} />
      }
    >
      {blocs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
          Le cours de cette notion n’est pas encore écrit.
        </p>
      ) : (
        <div className="space-y-5">
          {blocs.map((bloc) => (
            <BlocCours
              key={bloc.id}
              bloc={bloc}
              accent={matiere.accent}
              cheminCourant={pathname}
              dejaRepondu={bloc.type === 'verifie' ? progression.verifies[bloc.id] : undefined}
              onVerifie={repondreVerifie}
            />
          ))}
        </div>
      )}
      <Voisines chapitre={chapitre} precedente={precedente} suivante={suivante} />
    </PageLongue>
  );
}
