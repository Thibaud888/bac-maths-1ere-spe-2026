import type { ReactNode } from 'react';
import Essentiel, { Chiffre, Chiffres } from '@/components/shared/Essentiel';
import PageLongue, { SectionPage } from '@/components/shared/PageLongue';
import { ListeSources, Refs, SourcesNumerotees } from '@/components/shared/Sources';
import { ACCENT_PAR_DEFAUT, MENTION_BARRE, MENTION_CARD } from '@/lib/bac-accents';
import {
  BLOC_LABEL,
  BLOC_ORDER,
  coefficientsOfBloc,
  getBacCoefficient,
  listBacEpreuves,
  listBacJalons,
  listBacMentions,
  listBacSources,
  PRECISION_LABEL,
  totalCoefficients,
  totalEpreuves,
  totalOfBloc,
} from '@/lib/bac-content';
import type {
  BacAnnee,
  BacBloc,
  BacCoefficient,
  BacEpreuve,
  BacForme,
  BacJalon,
  BacMention,
} from '@/lib/bac-types';
import { typographie as t } from '@/lib/typographie';

const FORME_LABEL: Record<BacForme, string> = {
  ecrit: 'Écrit',
  oral: 'Oral',
  pratique: 'Pratique',
  'ecrit-et-pratique': 'Écrit et pratique',
};

const SOMMAIRE = [
  { id: 'epreuves', label: 'Les épreuves' },
  { id: 'continu', label: 'Le contrôle continu' },
  { id: 'options', label: 'Les options' },
  { id: 'calendrier', label: 'Le calendrier' },
  { id: 'mentions', label: 'Mentions et rattrapage' },
  { id: 'sources', label: 'Les sources' },
] as const;

/** Numéro d'une section, tel qu'affiché dans le sommaire. */
function numero(id: (typeof SOMMAIRE)[number]['id']): number {
  return SOMMAIRE.findIndex((e) => e.id === id) + 1;
}

/** Toutes les sources du registre, numérotées dans l'ordre du fichier. */
const SOURCE_IDS = listBacSources().map((s) => s.id);

/** Où mène chaque bloc du barème, depuis la barre de « L'essentiel ». */
const BLOC_SECTION: Record<BacBloc, string> = {
  anticipee: 'epreuves',
  terminale: 'epreuves',
  continu: 'continu',
  option: 'options',
};

/** Couleur de chaque bloc dans la barre des coefficients. */
const BLOC_COULEUR: Record<BacBloc, string> = {
  anticipee: 'bg-sky-200 text-sky-900 dark:bg-sky-800 dark:text-sky-50',
  terminale: 'bg-sky-600 text-white dark:bg-sky-500 dark:text-sky-950',
  continu: 'bg-teal-500 text-white dark:bg-teal-600 dark:text-teal-50',
  option: 'bg-amber-400 text-amber-950 dark:bg-amber-500 dark:text-amber-950',
};

const PHASE_LABEL: Record<NonNullable<BacJalon['phase']>, string> = {
  premiere: 'En première',
  terminale: 'En terminale',
  apres: 'Après les épreuves',
};

/** Pastille « selon le profil » sur les lignes qui dépendent des choix de l'élève. */
function ProfilBadge() {
  return (
    <span className="ml-2 inline-block whitespace-nowrap rounded-full bg-amber-100 px-2 py-0.5 align-middle text-[0.65rem] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
      selon le profil
    </span>
  );
}

// ---------------------------------------------------------------------------
// L'essentiel
// ---------------------------------------------------------------------------

/**
 * Les coefficients du bac en une barre : un bloc par partie du barème, une case
 * par matière, chaque case proportionnelle à son coefficient.
 */
function BarreCoefficients({ total }: { total: number }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
        Où se jouent les {total} coefficients
      </p>
      <div
        className="flex h-10 gap-1"
        role="img"
        aria-label={BLOC_ORDER.map((b) => `${BLOC_LABEL[b]} : ${totalOfBloc(b)}`).join(
          ' ; '
        )}
      >
        {BLOC_ORDER.map((bloc) => (
          <div
            key={bloc}
            className="flex gap-px overflow-hidden rounded-md"
            style={{ flexGrow: totalOfBloc(bloc), flexBasis: 0 }}
          >
            {coefficientsOfBloc(bloc).map((c) => (
              <span
                key={c.id}
                title={t(`${c.label} — coefficient ${c.coefficient}`)}
                className={`flex min-w-0 items-center justify-center text-[0.7rem] font-semibold tabular-nums ${BLOC_COULEUR[bloc]}`}
                style={{ flexGrow: c.coefficient, flexBasis: 0 }}
              >
                {c.coefficient >= 5 ? c.coefficient : ''}
              </span>
            ))}
          </div>
        ))}
      </div>
      <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {BLOC_ORDER.map((bloc) => (
          <li key={bloc}>
            <a
              href={`#${BLOC_SECTION[bloc]}`}
              className="group flex items-start gap-2 rounded-md p-1 -m-1 hover:bg-slate-50 dark:hover:bg-slate-700/40"
            >
              <span
                className={`mt-1 h-3 w-3 shrink-0 rounded-sm ${BLOC_COULEUR[bloc]}`}
                aria-hidden="true"
              />
              <span className="leading-snug">
                <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  {totalOfBloc(bloc)}
                </span>{' '}
                <span className="text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200">
                  {t(BLOC_LABEL[bloc])}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EssentielBac() {
  const total = totalCoefficients();
  const specialites = coefficientsOfBloc('terminale')
    .filter((c) => c.portee === 'profil')
    .reduce((sum, c) => sum + c.coefficient, 0);
  const mentions = listBacMentions();
  const admis = mentions.find((m) => m.id === 'me-admis');
  const rattrapage = mentions.find((m) => m.id === 'me-rattrapage');
  const premiereMention = mentions.find(
    (m) => m.label.startsWith('Mention') && m.reglementaire !== false
  );

  return (
    <Essentiel accent="sky">
      <Chiffres>
        <Chiffre accent="sky" valeur={total}>
          coefficients en tout&nbsp;: {totalEpreuves()} sur les épreuves, {totalOfBloc('continu')}{' '}
          sur les moyennes des bulletins (le contrôle continu), {totalOfBloc('option')} pour les
          options.
        </Chiffre>
        <Chiffre accent="sky" valeur={specialites}>
          pour les deux spécialités de terminale, dans l’exemple&nbsp;: le plus gros bloc du bac.
        </Chiffre>
        {admis && (
          <Chiffre accent="sky" valeur={`${admis.seuil}/20`}>
            de moyenne pour avoir le bac
            {premiereMention && <>, mention dès {premiereMention.seuil}</>}
            {rattrapage && rattrapage.plafond !== undefined && (
              <>
                &nbsp;; entre {rattrapage.seuil} et {rattrapage.plafond}, rattrapage
              </>
            )}
            .
          </Chiffre>
        )}
      </Chiffres>
      <BarreCoefficients total={total} />
      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Un coefficient, c’est le poids d’une note dans la moyenne&nbsp;: une épreuve de
        coefficient 16 compte deux fois plus qu’une épreuve de coefficient 8.
        <span className="hidden sm:inline"> Survole une case pour voir la matière.</span>
      </p>
    </Essentiel>
  );
}

/** Le profil pris en exemple, en quatre lignes plutôt qu'en un paragraphe. */
function ProfilExemple() {
  const lignes: [string, string][] = [
    ['Spécialités', 'maths et physique-chimie'],
    ['Arrêtée en fin de première', 'SVT'],
    ['Options', 'maths expertes et musique'],
    [
      'Langues',
      'anglais en langue A (la première langue), italien en langue B (la deuxième)',
    ],
  ];
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/30">
      <p className="text-slate-700 dark:text-slate-300">
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          Un profil pris en exemple.
        </span>{' '}
        Les lignes marquées <ProfilBadge /> changent d’un élève à l’autre. Tout le reste vaut
        pour n’importe quel élève de la voie générale (le bac général).
      </p>
      <dl className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
        {lignes.map(([terme, valeur]) => (
          <div key={terme} className="flex gap-2">
            <dt className="shrink-0 text-slate-500 dark:text-slate-400">{terme}&nbsp;:</dt>
            <dd className="font-medium text-slate-800 dark:text-slate-200">{valeur}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Les épreuves
// ---------------------------------------------------------------------------

function EpreuveCard({ epreuve }: { epreuve: BacEpreuve }) {
  const coefficient = getBacCoefficient(epreuve.coefficientId);
  const profil = coefficient?.portee === 'profil';
  return (
    <article className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-semibold leading-snug text-slate-900 dark:text-slate-100">
            {t(epreuve.titre)}
            {profil && <ProfilBadge />}
          </h4>
          {profil && coefficient?.profilNote && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {t(coefficient.profilNote)}
            </p>
          )}
        </div>
        {coefficient && (
          <div className="shrink-0 rounded-md bg-sky-50 px-2.5 py-1 text-center dark:bg-sky-950/60">
            <p className="text-lg font-bold leading-none tabular-nums text-sky-800 dark:text-sky-300">
              {coefficient.coefficient}
            </p>
            <p className="mt-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-sky-700 dark:text-sky-400">
              coef.
            </p>
          </div>
        )}
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
          {FORME_LABEL[epreuve.forme]}
        </span>
        {epreuve.duree && <span>{t(epreuve.duree)}</span>}
        {epreuve.duree && epreuve.quand && <span aria-hidden="true">·</span>}
        {epreuve.quand && <span>{t(epreuve.quand)}</span>}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {t(epreuve.resume)}
      </p>
      {epreuve.detail && (
        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {t(epreuve.detail)}
        </p>
      )}
      <p className="mt-auto pt-2">
        <Refs ids={epreuve.sources} />
      </p>
    </article>
  );
}

function GroupeEpreuves({
  titre,
  bloc,
  epreuves,
}: {
  titre: string;
  bloc: BacBloc;
  epreuves: BacEpreuve[];
}) {
  return (
    <div className="space-y-3">
      <h3 className="flex items-baseline justify-between gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span>{titre}</span>
        <span className="normal-case tracking-normal text-sky-700 dark:text-sky-400">
          {totalOfBloc(bloc)} coefficients
        </span>
      </h3>
      <div className="grid gap-3 md:grid-cols-2">
        {epreuves.map((e) => (
          <EpreuveCard key={e.id} epreuve={e} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contrôle continu et options
// ---------------------------------------------------------------------------

function partDe(coefficient: BacCoefficient, annee: BacAnnee): number | undefined {
  return coefficient.repartition?.find((p) => p.annee === annee)?.part;
}

/** Le barème d'un bloc, avec la part jouée en première et en terminale. */
function TableAnnees({ coefficients, bloc }: { coefficients: BacCoefficient[]; bloc: BacBloc }) {
  const cellule = 'py-2.5 px-2 text-center tabular-nums';
  const vide = <span className="text-slate-300 dark:text-slate-600">—</span>;
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
            <th className="py-2 pl-4 pr-2 font-semibold">Matière</th>
            <th className="px-2 py-2 text-center font-semibold">
              <abbr title="Moyenne de première" className="no-underline">1re</abbr>
            </th>
            <th className="px-2 py-2 text-center font-semibold">
              <abbr title="Moyenne de terminale" className="no-underline">Tle</abbr>
            </th>
            <th className="px-2 py-2 text-center font-semibold">Coef.</th>
            <th className="py-2 pl-2 pr-4 text-right font-semibold">
              <span className="sr-only">Sources</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {coefficients.map((c) => {
            const premiere = partDe(c, 'premiere');
            const terminale = partDe(c, 'terminale');
            return (
              <tr
                key={c.id}
                className="border-t border-slate-100 align-top dark:border-slate-700/60"
              >
                <td className="py-2.5 pl-4 pr-2">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {t(c.label)}
                  </span>
                  {c.portee === 'profil' && <ProfilBadge />}
                  {c.profilNote && (
                    <span className="mt-0.5 block text-xs leading-snug text-slate-500 dark:text-slate-400">
                      {t(c.profilNote)}
                    </span>
                  )}
                </td>
                <td className={`${cellule} text-slate-600 dark:text-slate-400`}>
                  {premiere ?? vide}
                </td>
                <td className={`${cellule} text-slate-600 dark:text-slate-400`}>
                  {terminale ?? vide}
                </td>
                <td className={`${cellule} font-bold text-slate-900 dark:text-slate-100`}>
                  {c.coefficient}
                </td>
                <td className="py-2.5 pl-2 pr-4 text-right">
                  <Refs ids={c.sources} />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
            <td className="py-2 pl-4 pr-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Total
            </td>
            <td />
            <td />
            <td className={`${cellule} font-bold text-sky-700 dark:text-sky-400`}>
              {totalOfBloc(bloc)}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/** Un point à retenir, à côté d'un tableau. */
function ARetenir({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
      <p className="font-semibold text-slate-900 dark:text-slate-100">{titre}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Calendrier
// ---------------------------------------------------------------------------

function JalonRow({ jalon }: { jalon: BacJalon }) {
  return (
    <li className="relative pb-6 pl-8 last:pb-0 md:grid md:grid-cols-[13rem_minmax(0,1fr)] md:gap-6">
      <span
        className="absolute left-[-6px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-sky-500 bg-white dark:bg-slate-900"
        aria-hidden="true"
      />
      <div>
        <p className="text-sm font-semibold leading-snug text-sky-800 dark:text-sky-300">
          {t(jalon.quand)}
        </p>
        <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {PRECISION_LABEL[jalon.precision]}
        </p>
      </div>
      <div className="mt-1 md:mt-0">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{t(jalon.titre)}</p>
        {jalon.detail && (
          <p className="mt-0.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {t(jalon.detail)} <Refs ids={jalon.sources} />
          </p>
        )}
        {!jalon.detail && <Refs ids={jalon.sources} />}
      </div>
    </li>
  );
}

function Calendrier({ jalons }: { jalons: BacJalon[] }) {
  const phases = (['premiere', 'terminale', 'apres'] as const).filter((p) =>
    jalons.some((j) => j.phase === p)
  );
  const sansPhase = jalons.filter((j) => !j.phase);
  return (
    <div className="space-y-8">
      {phases.map((phase) => (
        <div key={phase}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {PHASE_LABEL[phase]}
          </h3>
          <ol className="ml-1 border-l-2 border-sky-200 dark:border-sky-900">
            {jalons
              .filter((j) => j.phase === phase)
              .map((j) => (
                <JalonRow key={j.id} jalon={j} />
              ))}
          </ol>
        </div>
      ))}
      {sansPhase.length > 0 && (
        <ol className="ml-1 border-l-2 border-sky-200 dark:border-sky-900">
          {sansPhase.map((j) => (
            <JalonRow key={j.id} jalon={j} />
          ))}
        </ol>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mentions
// ---------------------------------------------------------------------------

/** « 12 – 14 », « 16 et + », « < 8 ». */
function palierLabel(mention: BacMention): string {
  if (mention.plafond === undefined) return `${mention.seuil} et +`;
  if (mention.seuil === 0) return `< ${mention.plafond}`;
  return `${mention.seuil} – ${mention.plafond}`;
}

/** « Mention assez bien » → « Assez bien » : l'échelle dit déjà de quoi il s'agit. */
function palierNom(mention: BacMention): string {
  const nom = mention.label.replace(/^Mention /, '');
  return nom.charAt(0).toUpperCase() + nom.slice(1);
}

/** La note maximale : l'échelle va de 0 à 20. */
const NOTE_MAX = 20;

/**
 * Les paliers sur une règle de 0 à 20, chaque segment proportionnel à sa
 * largeur de notes. Sur téléphone, les segments étroits deviennent des cases.
 * Un palier marqué non réglementaire n'y figure pas : il est cité à part.
 */
function EchelleMentions({ paliers }: { paliers: readonly BacMention[] }) {
  const bornes = [...new Set(paliers.flatMap((m) => [m.seuil, m.plafond ?? NOTE_MAX]))].sort(
    (a, b) => a - b
  );
  return (
    <>
      <div className="hidden sm:block">
        <ol className="flex h-14 gap-0.5 overflow-hidden rounded-lg">
          {paliers.map((m) => (
            <li
              key={m.id}
              className={`flex min-w-0 flex-col items-center justify-center px-1 text-center ${MENTION_BARRE[m.accent ?? ACCENT_PAR_DEFAUT]}`}
              style={{ flexGrow: (m.plafond ?? NOTE_MAX) - m.seuil, flexBasis: 0 }}
            >
              <span className="w-full truncate text-xs font-semibold">{palierNom(m)}</span>
              <span className="text-[0.7rem] tabular-nums opacity-80">{palierLabel(m)}</span>
            </li>
          ))}
        </ol>
        <div className="relative mt-1 h-4 text-[0.7rem] tabular-nums text-slate-500 dark:text-slate-400">
          {bornes.map((b) => (
            <span
              key={b}
              className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
              style={{ left: `${(b / NOTE_MAX) * 100}%` }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
      <ol className="flex flex-wrap gap-1.5 sm:hidden">
        {paliers.map((m) => (
          <li
            key={m.id}
            className={`min-w-0 flex-1 basis-[30%] rounded-md border px-2 py-1.5 text-center ${MENTION_CARD[m.accent ?? ACCENT_PAR_DEFAUT]}`}
          >
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              {palierNom(m)}
            </p>
            <p className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
              {palierLabel(m)}
            </p>
          </li>
        ))}
      </ol>
    </>
  );
}

// ---------------------------------------------------------------------------
// La page
// ---------------------------------------------------------------------------

export default function LeBacPage() {
  const total = totalCoefficients();
  const epreuves = listBacEpreuves();
  const passees = epreuves.filter((e) => e.statut === 'passee');
  const aVenir = epreuves.filter((e) => e.statut !== 'passee');
  const jalons = listBacJalons();
  const mentions = listBacMentions();
  const paliers = mentions.filter((m) => m.reglementaire !== false);
  const horsEchelle = mentions.filter((m) => m.reglementaire === false);

  const entete = (
    <>
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Le bac, mode d’emploi
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Chaque chiffre de cette page renvoie au texte officiel qui le fixe.
        </p>
      </header>
      <EssentielBac />
      <ProfilExemple />
    </>
  );

  return (
    <SourcesNumerotees ids={SOURCE_IDS} accent="sky">
      <PageLongue accent="sky" sommaire={SOMMAIRE} entete={entete}>
        <SectionPage
          id="epreuves"
          numero={numero('epreuves')}
          accent="sky"
          titre="Les épreuves"
          chapeau={t(
            `${epreuves.length} épreuves : ${passees.length} en fin de première, ` +
              `${aVenir.length} en terminale. Ensemble, elles font ${totalEpreuves()} ` +
              `coefficients sur ${total}.`
          )}
        >
          <div className="space-y-8">
            <GroupeEpreuves titre="En fin de première" bloc="anticipee" epreuves={passees} />
            <GroupeEpreuves titre="En terminale" bloc="terminale" epreuves={aVenir} />
          </div>
        </SectionPage>

        <SectionPage
          id="continu"
          numero={numero('continu')}
          accent="sky"
          titre="Le contrôle continu"
          chapeau={t(
            `${totalOfBloc('continu')} coefficients ne se jouent sur aucune épreuve : ` +
              'ce sont les moyennes annuelles, celles des bulletins.'
          )}
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
            <TableAnnees coefficients={coefficientsOfBloc('continu')} bloc="continu" />
            <div className="space-y-3">
              <ARetenir titre="Deux années, deux moitiés">
                L’histoire-géographie, les deux langues, l’enseignement scientifique et
                l’enseignement moral et civique (EMC) comptent moitié sur la moyenne de
                première, moitié sur celle de terminale. La moitié de première est connue dès
                la fin de l’année.
              </ARetenir>
              <ARetenir titre="La spécialité arrêtée pèse lourd">
                8 coefficients, entièrement décidés par la moyenne de première de la
                spécialité abandonnée&nbsp;: cette note est connue dès la fin de première.
              </ARetenir>
              <ARetenir titre="L’EPS, c’est trois épreuves au lycée">
                Pas une moyenne de bulletin, mais trois évaluations notées par les professeurs
                dans l’année de terminale.
              </ARetenir>
            </div>
          </div>
        </SectionPage>

        <SectionPage
          id="options"
          numero={numero('options')}
          accent="sky"
          titre="Les options"
          chapeau={t(
            'Une option rapporte 2 coefficients par année où elle est suivie, ' +
              'et ces coefficients s’ajoutent aux 100 de base.'
          )}
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
            <div className="space-y-3">
              <TableAnnees coefficients={coefficientsOfBloc('option')} bloc="option" />
              <p className="px-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Dans l’exemple, les deux options ne sont suivies qu’en terminale&nbsp;: 2
                coefficients chacune, d’où un total de {total} au lieu de 100. Une option
                suivie dès la première en vaut 4.
                <Refs ids={['s-calcul-note', 's-controle-continu']} />
              </p>
            </div>
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-slate-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-slate-300">
              <p className="font-semibold text-amber-900 dark:text-amber-200">
                Attention, ce n’est plus un bonus.
              </p>
              <p className="mt-1">
                Avant la réforme, seuls les points au-dessus de 10 comptaient&nbsp;: une option
                ne pouvait que faire monter la moyenne. Aujourd’hui l’option entre dans la
                moyenne comme les autres matières — une note en dessous de 10 la fait donc
                baisser, faiblement puisque le coefficient est petit.
                <Refs ids={['s-calcul-note']} />
              </p>
            </div>
          </div>
        </SectionPage>

        <SectionPage
          id="calendrier"
          numero={numero('calendrier')}
          accent="sky"
          titre="Le calendrier"
          chapeau={t(
            'Les dates publiées au Bulletin officiel (le journal officiel de l’Éducation ' +
              'nationale). Quand une date n’est pas encore fixée, la période est indiquée ' +
              'telle quelle — rien n’est inventé.'
          )}
        >
          <Calendrier jalons={jalons} />
        </SectionPage>

        <SectionPage
          id="mentions"
          numero={numero('mentions')}
          accent="sky"
          titre="Mentions et rattrapage"
          chapeau={t('La moyenne finale, sur 20, décide du résultat.')}
        >
          <div className="space-y-4">
            <EchelleMentions paliers={paliers} />
            <div className="grid gap-3 md:grid-cols-3">
              <ARetenir titre="Entre 8 et 10">
                Deux oraux de rattrapage, dans des matières passées à l’écrit&nbsp;; la
                meilleure des deux notes est gardée.
                <Refs ids={['s-mentions']} />
              </ARetenir>
              <ARetenir titre="La mention">
                Seulement au premier tour, c’est-à-dire sans passer par le rattrapage.
                <Refs ids={['s-mentions']} />
              </ARetenir>
              {horsEchelle.map((m) => (
                <ARetenir key={m.id} titre={t(m.label)}>
                  {t(m.resume)}
                  <Refs ids={m.sources} />
                </ARetenir>
              ))}
            </div>
          </div>
        </SectionPage>

        <SectionPage
          id="sources"
          numero={numero('sources')}
          accent="sky"
          titre="Les sources"
          chapeau={t(
            'Chaque chiffre de cette page vient d’un de ces textes. ' +
              'Les numéros renvoient aux appels [1], [2]… ci-dessus.'
          )}
        >
          <ListeSources />
          <p className="mt-4 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Pages consultées le 22 septembre 2026. En cas de doute, c’est le texte officiel qui
            fait foi, jamais cette page.
          </p>
        </SectionPage>
      </PageLongue>
    </SourcesNumerotees>
  );
}
