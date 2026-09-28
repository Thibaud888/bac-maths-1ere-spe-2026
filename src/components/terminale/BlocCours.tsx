import { createContext, useContext, useState, type ReactNode } from 'react';
import { TextWithMath } from '@/components/math/TextWithMath';
import FigureRenderer from '@/components/figures/FigureRenderer';
import CodeSource from '@/components/terminale/CodeSource';
import LienRenvoi from '@/components/terminale/LienRenvoi';
import QuestionVerifiable from '@/components/terminale/QuestionVerifiable';
import { FIGURES_ANIMEES } from '@/components/terminale/figures-animees';
import { getBloc } from '@/lib/terminale/content';
import { ET_EN } from '@/lib/terminale/matieres';
import type {
  Bloc,
  BlocDemonstration,
  BlocExemple,
  Etape,
} from '@/lib/terminale/types';

/** Nom affiché de chaque type de bloc (étiquette au-dessus du titre). */
export const NOM_BLOC: Record<Bloc['type'], string> = {
  idee: 'L’idée',
  rappel: 'Rappel',
  definition: 'Définition',
  propriete: 'Propriété',
  demonstration: 'Démonstration',
  exemple: 'Exemple',
  methode: 'Méthode',
  code: 'Programme',
  piege: 'Piège',
  retenir: 'À retenir',
  verifie: 'Vérifie que tu as compris',
  figure: 'Figure',
  anime: 'Figure animée',
  experience: 'Expérience',
  complement: 'Pour aller plus loin',
  'lien-matiere': 'Lien',
};

/** Classes des formules centrées : une formule trop large défile dans son cadre. */
const TEXTE =
  'text-[15px] leading-relaxed text-slate-800 dark:text-slate-200 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:py-1';

type Cadre = 'accent' | 'formel' | 'neutre' | 'attention' | 'retenir' | 'discret';

type Accent = 'blue' | 'violet';

/** Couleur de la matière (maths en bleu, physique-chimie en violet). */
const AccentBloc = createContext<Accent>('blue');

const CADRE_ACCENT: Record<Accent, { accent: string; formel: string; etiquette: string }> = {
  blue: {
    accent: 'border-blue-200 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/30',
    formel:
      'border-slate-200 border-l-4 border-l-blue-500 bg-white dark:border-slate-700 dark:border-l-blue-400 dark:bg-slate-800',
    etiquette: 'text-blue-700 dark:text-blue-300',
  },
  violet: {
    accent: 'border-violet-200 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/30',
    formel:
      'border-slate-200 border-l-4 border-l-violet-500 bg-white dark:border-slate-700 dark:border-l-violet-400 dark:bg-slate-800',
    etiquette: 'text-violet-700 dark:text-violet-300',
  },
};

const CADRE: Record<Exclude<Cadre, 'accent' | 'formel'>, string> = {
  neutre: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800',
  attention: 'border-rose-200 bg-rose-50/60 dark:border-rose-900 dark:bg-rose-950/30',
  retenir: 'border-emerald-300 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-950/30',
  discret: 'border-dashed border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900/40',
};

const ETIQUETTE: Record<Exclude<Cadre, 'accent' | 'formel'>, string> = {
  neutre: 'text-slate-500 dark:text-slate-400',
  attention: 'text-rose-700 dark:text-rose-300',
  retenir: 'text-emerald-700 dark:text-emerald-300',
  discret: 'text-slate-500 dark:text-slate-400',
};

function CadreBloc({
  id,
  cadre,
  etiquette,
  titre,
  badge,
  children,
}: {
  id: string;
  cadre: Cadre;
  etiquette: string;
  titre?: string | undefined;
  badge?: ReactNode;
  children: ReactNode;
}) {
  const accent = CADRE_ACCENT[useContext(AccentBloc)];
  const fond = cadre === 'accent' || cadre === 'formel' ? accent[cadre] : CADRE[cadre];
  const couleur = cadre === 'accent' || cadre === 'formel' ? accent.etiquette : ETIQUETTE[cadre];
  return (
    <section id={id} className={`scroll-mt-20 rounded-xl border p-4 sm:p-5 ${fond}`}>
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${couleur}`}>{etiquette}</p>
        {badge}
      </div>
      {titre && (
        <h3 className="mb-2 text-base font-bold leading-snug text-slate-900 dark:text-slate-100">
          <TextWithMath text={titre} />
        </h3>
      )}
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Badge({ children, ton = 'neutre' }: { children: ReactNode; ton?: 'neutre' | 'fort' | 'ok' }) {
  const style = {
    neutre: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    fort: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300',
    ok: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
  }[ton];
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${style}`}>{children}</span>;
}

function Texte({ texte }: { texte: string }) {
  return (
    <div className={TEXTE}>
      <TextWithMath text={texte} />
    </div>
  );
}

function ListeEtapes({ etapes, jusqua }: { etapes: readonly Etape[]; jusqua: number }) {
  return (
    <ol className="space-y-3">
      {etapes.slice(0, jusqua).map((etape, index) => (
        <li key={index} className="flex gap-3">
          <span
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold tabular-nums text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <Texte texte={etape.texte} />
            {etape.pourquoi && (
              <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                <span className="font-semibold">Pourquoi : </span>
                <TextWithMath text={etape.pourquoi} />
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

const PETIT_BOUTON =
  'rounded-md border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700';

/** Exemple dévoilé étape par étape (charte § 11), ou d'un coup. */
function Exemple({ bloc }: { bloc: BlocExemple }) {
  const [vues, setVues] = useState(0);
  const total = bloc.etapes.length;
  return (
    <CadreBloc id={bloc.id} cadre="neutre" etiquette={NOM_BLOC.exemple} titre={bloc.titre}>
      <Texte texte={bloc.enonce} />
      {bloc.code && <CodeSource code={bloc.code} />}
      {vues > 0 && (
        <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
          <ListeEtapes etapes={bloc.etapes} jusqua={vues} />
        </div>
      )}
      {vues < total && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setVues((v) => v + 1);
            }}
            className={PETIT_BOUTON}
          >
            {vues === 0 ? 'Voir la première étape' : `Étape suivante (${vues + 1} sur ${total})`}
          </button>
          <button
            type="button"
            onClick={() => {
              setVues(total);
            }}
            className={PETIT_BOUTON}
          >
            Tout afficher
          </button>
        </div>
      )}
    </CadreBloc>
  );
}

function Demonstration({ bloc, cheminCourant }: { bloc: BlocDemonstration; cheminCourant: string }) {
  const propriete = getBloc(bloc.de)?.bloc;
  const de = propriete?.titre ? (
    <p className="text-sm text-slate-600 dark:text-slate-400">
      Démonstration de :{' '}
      <LienRenvoi lien={bloc.de} cheminCourant={cheminCourant}>
        <TextWithMath text={propriete.titre} />
      </LienRenvoi>
    </p>
  ) : null;
  const contenu = (
    <>
      {de}
      <ListeEtapes etapes={bloc.etapes} jusqua={bloc.etapes.length} />
    </>
  );

  if (bloc.exigible) {
    return (
      <CadreBloc
        id={bloc.id}
        cadre="neutre"
        etiquette={NOM_BLOC.demonstration}
        titre={bloc.titre}
        badge={<Badge ton="fort">À savoir refaire</Badge>}
      >
        {contenu}
      </CadreBloc>
    );
  }

  // Démonstration non exigible : titre visible, contenu déplié à la demande.
  return (
    <details id={bloc.id} className={`group scroll-mt-20 rounded-xl border p-4 sm:p-5 ${CADRE.neutre}`}>
      <summary className="cursor-pointer list-none">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          {NOM_BLOC.demonstration} · pour comprendre
        </span>
        <span className="mt-1 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
          <span aria-hidden="true" className="text-slate-400 transition-transform group-open:rotate-90">
            ▸
          </span>
          {bloc.titre ? <TextWithMath text={bloc.titre} /> : 'Voir la démonstration'}
        </span>
      </summary>
      <div className="mt-3 space-y-3">{contenu}</div>
    </details>
  );
}

type Props = {
  bloc: Bloc;
  /** Couleur de la matière. */
  accent: Accent;
  /** Adresse de la page ouverte (les renvois vers elle deviennent des ancres). */
  cheminCourant: string;
  /** Pour un bloc `verifie` : a-t-il déjà été répondu, et juste ? */
  dejaRepondu?: boolean | undefined;
  onVerifie?: (blocId: string, juste: boolean) => void;
};

/** Un bloc du cours de terminale, selon son type (charte § 4.2). */
export default function BlocCours({ accent, ...props }: Props) {
  return (
    <AccentBloc.Provider value={accent}>
      <ContenuBloc {...props} />
    </AccentBloc.Provider>
  );
}

function ContenuBloc({ bloc, cheminCourant, dejaRepondu, onVerifie }: Omit<Props, 'accent'>) {
  switch (bloc.type) {
    case 'idee':
      return (
        <CadreBloc id={bloc.id} cadre="accent" etiquette={NOM_BLOC.idee} titre={bloc.titre}>
          <Texte texte={bloc.texte} />
        </CadreBloc>
      );

    case 'rappel':
      return (
        <CadreBloc id={bloc.id} cadre="discret" etiquette={NOM_BLOC.rappel} titre={bloc.titre}>
          <Texte texte={bloc.texte} />
          {bloc.lien && (
            <p className="text-sm">
              <span className="text-slate-600 dark:text-slate-400">Revoir : </span>
              <LienRenvoi lien={bloc.lien} cheminCourant={cheminCourant} />
            </p>
          )}
        </CadreBloc>
      );

    case 'definition':
      return (
        <CadreBloc id={bloc.id} cadre="formel" etiquette={NOM_BLOC.definition} titre={bloc.titre}>
          <Texte texte={bloc.texte} />
        </CadreBloc>
      );

    case 'propriete':
      return (
        <CadreBloc
          id={bloc.id}
          cadre="formel"
          etiquette={NOM_BLOC.propriete}
          titre={bloc.titre}
          badge={bloc.admise ? <Badge>Admise</Badge> : null}
        >
          {bloc.conditions.length > 0 && (
            <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900/50">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                Hypothèses
              </p>
              <ul className={`mt-1 list-disc space-y-0.5 pl-5 ${TEXTE}`}>
                {bloc.conditions.map((condition, index) => (
                  <li key={index}>
                    <TextWithMath text={condition} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Texte texte={bloc.texte} />
        </CadreBloc>
      );

    case 'demonstration':
      return <Demonstration bloc={bloc} cheminCourant={cheminCourant} />;

    case 'exemple':
      return <Exemple bloc={bloc} />;

    case 'methode':
      return (
        <CadreBloc id={bloc.id} cadre="neutre" etiquette={NOM_BLOC.methode} titre={bloc.titre}>
          <ol className={`list-decimal space-y-1.5 pl-5 ${TEXTE}`}>
            {bloc.etapes.map((etape, index) => (
              <li key={index}>
                <TextWithMath text={etape} />
              </li>
            ))}
          </ol>
          {bloc.code && <CodeSource code={bloc.code} />}
          {bloc.exemple && (
            <p className="text-sm">
              <LienRenvoi lien={bloc.exemple} cheminCourant={cheminCourant}>
                Voir la méthode appliquée dans l’exemple
              </LienRenvoi>
            </p>
          )}
        </CadreBloc>
      );

    case 'code':
      return (
        <CadreBloc id={bloc.id} cadre="neutre" etiquette={NOM_BLOC.code} titre={bloc.titre}>
          <CodeSource code={bloc.code} />
          <Texte texte={bloc.texte} />
        </CadreBloc>
      );

    case 'piege':
      return (
        <CadreBloc id={bloc.id} cadre="attention" etiquette={NOM_BLOC.piege} titre={bloc.titre}>
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="font-bold text-rose-700 dark:text-rose-300" aria-label="Faux">
                ✗
              </span>
              <div className={`${TEXTE} line-through decoration-rose-400/70`}>
                <TextWithMath text={bloc.faux} />
              </div>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-emerald-700 dark:text-emerald-300" aria-label="Juste">
                ✓
              </span>
              <Texte texte={bloc.juste} />
            </div>
          </div>
          <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <TextWithMath text={bloc.explication} />
          </div>
        </CadreBloc>
      );

    case 'retenir':
      return (
        <CadreBloc id={bloc.id} cadre="retenir" etiquette={NOM_BLOC.retenir} titre={bloc.titre}>
          <div className={`${TEXTE} font-medium`}>
            <TextWithMath text={bloc.texte} />
          </div>
        </CadreBloc>
      );

    case 'verifie':
      return (
        <CadreBloc
          id={bloc.id}
          cadre="neutre"
          etiquette={NOM_BLOC.verifie}
          titre={bloc.titre}
          badge={
            dejaRepondu === undefined ? null : dejaRepondu ? (
              <Badge ton="ok">Déjà réussie</Badge>
            ) : (
              <Badge>Déjà tentée</Badge>
            )
          }
        >
          <QuestionVerifiable
            graine={bloc.id}
            question={bloc.question}
            onRepondre={(juste) => onVerifie?.(bloc.id, juste)}
          />
        </CadreBloc>
      );

    case 'figure':
      return (
        <CadreBloc id={bloc.id} cadre="neutre" etiquette={NOM_BLOC.figure} titre={bloc.titre}>
          <div className="overflow-x-auto">
            <FigureRenderer figure={bloc.figure} />
          </div>
        </CadreBloc>
      );

    case 'anime': {
      const Figure = FIGURES_ANIMEES[bloc.widget];
      return (
        <CadreBloc id={bloc.id} cadre="neutre" etiquette={NOM_BLOC.anime} titre={bloc.titre}>
          <Texte texte={bloc.consigne} />
          {Figure ? (
            <Figure parametres={bloc.parametres} />
          ) : (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm italic text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              Cette figure animée n’est pas encore disponible.
            </p>
          )}
        </CadreBloc>
      );
    }

    case 'experience':
      return (
        <CadreBloc id={bloc.id} cadre="neutre" etiquette={NOM_BLOC.experience} titre={bloc.titre}>
          {(
            [
              ['Protocole', bloc.protocole],
              ['Observation', bloc.observation],
              ['Interprétation', bloc.interpretation],
            ] as const
          ).map(([nom, texte]) => (
            <div key={nom}>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                {nom}
              </p>
              <Texte texte={texte} />
            </div>
          ))}
        </CadreBloc>
      );

    case 'complement':
      return (
        <CadreBloc
          id={bloc.id}
          cadre="discret"
          etiquette={NOM_BLOC.complement}
          titre={bloc.titre}
          badge={<Badge>Hors des attendus du bac</Badge>}
        >
          <Texte texte={bloc.texte} />
        </CadreBloc>
      );

    case 'lien-matiere':
      return (
        <CadreBloc id={bloc.id} cadre="discret" etiquette={ET_EN[bloc.matiere]} titre={bloc.titre}>
          <Texte texte={bloc.texte} />
          {bloc.lien && (
            <p className="text-sm">
              <LienRenvoi lien={bloc.lien} cheminCourant={cheminCourant} />
            </p>
          )}
        </CadreBloc>
      );
  }
}
