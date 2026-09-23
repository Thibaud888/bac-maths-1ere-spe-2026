import type { ReactNode } from 'react';
import Sommaire from '@/components/shared/Sommaire';
import { ListeSources, Refs, SourcesNumerotees } from '@/components/shared/Sources';
import { ACCENT_PAR_DEFAUT, MENTION_CARD } from '@/lib/bac-accents';
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
  BacCoefficient,
  BacEpreuve,
  BacForme,
  BacJalon,
  BacMention,
} from '@/lib/bac-types';

const FORME_LABEL: Record<BacForme, string> = {
  ecrit: 'Écrit',
  oral: 'Oral',
  pratique: 'Pratique',
  'ecrit-et-pratique': 'Écrit et pratique',
};

const SOMMAIRE = [
  { id: 'epreuves', label: 'Les épreuves' },
  { id: 'continu', label: 'Le contrôle continu' },
  { id: 'coefficients', label: 'Les coefficients' },
  { id: 'calendrier', label: 'Le calendrier' },
  { id: 'options', label: 'Les options' },
  { id: 'mentions', label: 'Mentions et rattrapage' },
  { id: 'sources', label: 'Les sources' },
] as const;

/** Toutes les sources du registre, numérotées dans l'ordre du fichier. */
const SOURCE_IDS = listBacSources().map((s) => s.id);

function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        {lead && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{lead}</p>
        )}
      </div>
      {children}
    </section>
  );
}

/** Pastille « selon le profil » sur les lignes qui dépendent des choix de l'élève. */
function ProfilBadge() {
  return (
    <span className="ml-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
      selon le profil
    </span>
  );
}

/** « 3 en première + 3 en terminale », quand le coefficient est partagé. */
function repartitionLabel(coefficient: BacCoefficient): string | null {
  const parts = coefficient.repartition;
  if (!parts || parts.length < 2) return null;
  return parts
    .map((p) => `${p.part} en ${p.annee === 'premiere' ? 'première' : 'terminale'}`)
    .join(' + ');
}

function EpreuveCard({ epreuve }: { epreuve: BacEpreuve }) {
  const coefficient = getBacCoefficient(epreuve.coefficientId);
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          {epreuve.titre}
          {coefficient?.portee === 'profil' && <ProfilBadge />}
        </h3>
        {coefficient && (
          <span className="rounded bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
            coefficient {coefficient.coefficient}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {FORME_LABEL[epreuve.forme]}
        {epreuve.duree && ` · ${epreuve.duree}`}
        {epreuve.quand && ` · ${epreuve.quand}`}
      </p>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{epreuve.resume}</p>
      {epreuve.detail && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {epreuve.detail}
        </p>
      )}
      <p className="mt-2">
        <Refs ids={epreuve.sources} />
      </p>
    </article>
  );
}

function JalonRow({ jalon }: { jalon: BacJalon }) {
  return (
    <li className="border-l-2 border-sky-200 py-2 pl-4 dark:border-sky-800">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{jalon.titre}</p>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
          {PRECISION_LABEL[jalon.precision]}
        </span>
      </div>
      <p className="text-sm font-medium text-sky-700 dark:text-sky-400">{jalon.quand}</p>
      {jalon.detail && (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{jalon.detail}</p>
      )}
      <p className="mt-1">
        <Refs ids={jalon.sources} />
      </p>
    </li>
  );
}

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

/**
 * Les paliers en une seule échelle, de la note la plus basse à la plus haute.
 * Un palier marqué non réglementaire n'y figure pas : il est cité à part.
 */
function EchelleMentions({ paliers }: { paliers: readonly BacMention[] }) {
  return (
    <ol className="flex flex-wrap gap-1.5">
      {paliers.map((m) => (
        <li
          key={m.id}
          className={`min-w-0 flex-1 basis-[30%] rounded-md border px-2 py-1.5 text-center sm:basis-0 ${MENTION_CARD[m.accent ?? ACCENT_PAR_DEFAUT]}`}
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
  );
}

function CoefficientTable({ coefficients }: { coefficients: BacCoefficient[] }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <th className="py-2 pr-2 font-semibold">Matière</th>
          <th className="hidden py-2 pr-2 font-semibold sm:table-cell">Quand</th>
          <th className="py-2 pr-2 text-right font-semibold">Coef.</th>
          <th className="py-2 text-right font-semibold">Source</th>
        </tr>
      </thead>
      <tbody>
        {coefficients.map((c) => {
          const parts = repartitionLabel(c);
          return (
            <tr
              key={c.id}
              className="border-b border-slate-100 align-top dark:border-slate-700/60"
            >
              <td className="py-2 pr-2">
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {c.label}
                </span>
                {c.portee === 'profil' && <ProfilBadge />}
                {c.profilNote && (
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    {c.profilNote}
                  </span>
                )}
                {/* Sur téléphone, la colonne « Quand » se replie sous la matière. */}
                <span className="block text-xs text-slate-500 dark:text-slate-400 sm:hidden">
                  {c.quand}
                  {parts && ` — ${parts}`}
                </span>
              </td>
              <td className="hidden py-2 pr-2 text-slate-600 dark:text-slate-400 sm:table-cell">
                {c.quand}
                {parts && (
                  <span className="block text-xs text-slate-500 dark:text-slate-500">
                    {parts}
                  </span>
                )}
              </td>
              <td className="py-2 pr-2 text-right font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {c.coefficient}
              </td>
              <td className="py-2 text-right">
                <Refs ids={c.sources} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function LeBacPage() {
  const total = totalCoefficients();
  const epreuves = listBacEpreuves();
  const passees = epreuves.filter((e) => e.statut === 'passee');
  const aVenir = epreuves.filter((e) => e.statut !== 'passee');
  const jalons = listBacJalons();
  const mentions = listBacMentions();
  const paliers = mentions.filter((m) => m.reglementaire !== false);
  const horsEchelle = mentions.filter((m) => m.reglementaire === false);
  const continu = coefficientsOfBloc('continu');
  const options = coefficientsOfBloc('option');

  return (
    <SourcesNumerotees ids={SOURCE_IDS} accent="sky">
      <div className="mx-auto max-w-4xl space-y-12 p-8">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Le bac, mode d’emploi
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Chaque chiffre de cette page renvoie au texte officiel qui le fixe.
          </p>
        </header>

        <Sommaire entries={SOMMAIRE} accent="sky" />

        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-slate-300">
          <span className="font-semibold">Ce qui dépend des choix de l’élève.</span> Les
          lignes marquées <ProfilBadge /> changent d’un élève à l’autre. Le barème de cette
          page suit un profil pris en exemple : spécialités maths et physique-chimie, SVT
          arrêtée en fin de première, options maths expertes et musique, anglais en langue
          A et italien en langue B. Tout le reste vaut pour n’importe quel élève de la voie
          générale.
        </p>

        <Section
          id="epreuves"
          title="Les épreuves"
          lead={`${epreuves.length} épreuves : ${passees.length} en fin de première, ${aVenir.length} en terminale. Ensemble, elles font ${totalEpreuves()} coefficients sur ${total}.`}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            En fin de première
          </h3>
          <div className="grid gap-3">
            {passees.map((e) => (
              <EpreuveCard key={e.id} epreuve={e} />
            ))}
          </div>
          <h3 className="pt-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            En terminale
          </h3>
          <div className="grid gap-3">
            {aVenir.map((e) => (
              <EpreuveCard key={e.id} epreuve={e} />
            ))}
          </div>
        </Section>

        <Section
          id="continu"
          title="Le contrôle continu"
          lead={`${totalOfBloc('continu')} coefficients ne se jouent sur aucune épreuve : ce sont les moyennes annuelles, celles des bulletins.`}
        >
          <CoefficientTable coefficients={continu} />
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Deux années, deux moitiés.
              </span>{' '}
              L’histoire-géographie, les deux langues, l’enseignement scientifique et l’EMC
              comptent moitié sur la moyenne de première, moitié sur celle de terminale.
              La moitié de première est connue dès la fin de l’année.
            </li>
            <li>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                La spécialité arrêtée pèse lourd.
              </span>{' '}
              8 coefficients, entièrement décidés par la moyenne de première de la
              spécialité abandonnée : cette note est connue dès la fin de première.
            </li>
            <li>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                L’EPS, c’est trois épreuves au lycée.
              </span>{' '}
              Pas une moyenne de bulletin, mais trois évaluations notées par les
              professeurs dans l’année de terminale.
            </li>
          </ul>
        </Section>

        <Section
          id="coefficients"
          title="Les coefficients"
          lead="Le barème complet, bloc par bloc."
        >
          {BLOC_ORDER.map((bloc) => (
            <div key={bloc} className="space-y-2">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {BLOC_LABEL[bloc]}
                </h3>
                <span className="text-sm font-semibold tabular-nums text-sky-700 dark:text-sky-400">
                  {totalOfBloc(bloc)} coef.
                </span>
              </div>
              <CoefficientTable coefficients={coefficientsOfBloc(bloc)} />
            </div>
          ))}
          <p className="rounded-lg bg-slate-100 p-3 text-sm font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            Total : {total} coefficients.
          </p>
        </Section>

        <Section
          id="calendrier"
          title="Le calendrier"
          lead="Les dates publiées au Bulletin officiel. Quand une date n’est pas encore fixée, la période est indiquée telle quelle — rien n’est inventé."
        >
          <ul className="space-y-1">
            {jalons.map((j) => (
              <JalonRow key={j.id} jalon={j} />
            ))}
          </ul>
        </Section>

        <Section
          id="options"
          title="Les options"
          lead="Une option rapporte 2 coefficients par année où elle est suivie, et ces coefficients s’ajoutent aux 100 de base."
        >
          <CoefficientTable coefficients={options} />
          <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span className="font-semibold">Attention, ce n’est plus un bonus.</span>{' '}
            Avant la réforme, seuls les points au-dessus de 10 comptaient : une option ne
            pouvait que faire monter la moyenne. Aujourd’hui l’option entre dans la moyenne
            comme les autres matières — une note en dessous de 10 la fait donc baisser,
            faiblement puisque le coefficient est petit.
            <Refs ids={['s-calcul-note']} />
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Dans l’exemple, les deux options ne sont suivies qu’en terminale : 2
            coefficients chacune, d’où un total de {total} au lieu de 100. Une option
            suivie dès la première en vaut 4.
            <Refs ids={['s-calcul-note', 's-controle-continu']} />
          </p>
        </Section>

        <Section id="mentions" title="Mentions et rattrapage">
          <EchelleMentions paliers={paliers} />
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Entre 8 et 10 :
              </span>{' '}
              deux oraux de rattrapage, dans des matières passées à l’écrit ; la meilleure
              des deux notes est gardée.
              <Refs ids={['s-mentions']} />
            </li>
            <li>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Mention :
              </span>{' '}
              seulement au premier tour.
              <Refs ids={['s-mentions']} />
            </li>
            {horsEchelle.map((m) => (
              <li key={m.id}>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {m.label} :
                </span>{' '}
                {m.resume}
                <Refs ids={m.sources} />
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="sources"
          title="Les sources"
          lead="Chaque chiffre de cette page vient d’un de ces textes. Les numéros renvoient aux appels [1], [2]… ci-dessus."
        >
          <ListeSources />
          <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Pages consultées le 22 septembre 2026. En cas de doute, c’est le texte officiel
            qui fait foi, jamais cette page.
          </p>
        </Section>
      </div>
    </SourcesNumerotees>
  );
}
