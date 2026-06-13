import { useParams } from 'react-router-dom';
import { LiteraryText } from '@/francais/components/text/LiteraryText';
import { useFrenchAppStore } from '@/francais/stores/french-app-store';
import type {
  OralOeuvre,
  OralOeuvreArgument,
} from '@/francais/lib/french-types';
import AdjustableTimer from './AdjustableTimer';
import RevealPanel from './RevealPanel';
import RevisedToggle from './RevisedToggle';

type OralOeuvreViewProps = {
  oeuvre: OralOeuvre;
};

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
      {children}
    </h2>
  );
}

/**
 * Zone de notes personnelles persistée en local (`bfr-2026-app`), réutilisant
 * le mécanisme des textes collés. Permet à l'élève de reformuler à sa main les
 * appuis fournis (pourquoi ce choix, jugement, citations).
 */
function PersonalNote({
  storageKey,
  placeholder,
}: {
  storageKey: string;
  placeholder: string;
}) {
  const value = useFrenchAppStore((s) => s.pastedOralTexts[storageKey] ?? '');
  const setValue = useFrenchAppStore((s) => s.setPastedOralText);
  return (
    <div className="mt-3">
      <textarea
        value={value}
        onChange={(e) => {
          setValue(storageKey, e.target.value);
        }}
        rows={3}
        placeholder={placeholder}
        className="w-full rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-sm leading-relaxed text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
      />
      {value.trim().length > 0 && (
        <p className="mt-1 text-right text-xs italic text-slate-400 dark:text-slate-500">
          Enregistré sur cet appareil uniquement.
        </p>
      )}
    </div>
  );
}

/** Un « temps » de la présentation reposant sur des points à dire + pistes. */
function ArgumentBlock({
  arg,
  noteKey,
  notePlaceholder,
}: {
  arg: OralOeuvreArgument;
  noteKey: string;
  notePlaceholder: string;
}) {
  return (
    <div>
      <ul className="space-y-2">
        {arg.points.map((p, i) => (
          <li
            key={i}
            className="flex gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <div className="min-w-0">
              <LiteraryText text={p} />
            </div>
          </li>
        ))}
      </ul>
      {arg.pistes && arg.pistes.length > 0 && (
        <div className="mt-3">
          <RevealPanel label="Autres pistes à développer">
            <ul className="ml-4 list-disc space-y-1">
              {arg.pistes.map((p, i) => (
                <li key={i}>
                  <LiteraryText text={p} />
                </li>
              ))}
            </ul>
          </RevealPanel>
        </div>
      )}
      <PersonalNote storageKey={noteKey} placeholder={notePlaceholder} />
    </div>
  );
}

export default function OralOeuvreView({ oeuvre }: OralOeuvreViewProps) {
  const { eleve } = useParams<{ eleve: string }>();
  const oralViewMode = useFrenchAppStore((s) => s.oralViewMode);
  const ns = `oeuvre:${eleve ?? ''}`;
  const { presentationOrale: pres } = oeuvre;

  return (
    <article className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Œuvre choisie · 2ᵈᵉ partie (8 pts)
        </p>
        <h1 className="mt-1 text-2xl font-bold italic text-slate-900 dark:text-slate-100">
          {oeuvre.oeuvre}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          {oeuvre.auteur}
          {oeuvre.date ? ` (${oeuvre.date})` : ''}
          {oeuvre.genre ? ` — ${oeuvre.genre}` : ''}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {oeuvre.editeur && (
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {oeuvre.editeur}
            </span>
          )}
          {oeuvre.distinction && (
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              {oeuvre.distinction}
            </span>
          )}
          {oeuvre.parcours && (
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {oeuvre.parcours}
            </span>
          )}
        </div>
      </header>

      {!oeuvre.domainePublic && (
        <p className="mt-4 rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-3 text-xs text-amber-800 dark:text-amber-300">
          Œuvre encore sous droits d’auteur : aucune citation longue n’est
          reproduite ici. Les emplacements « Mes citations » te permettent de
          recopier tes extraits — ils restent sur cet appareil uniquement.
        </p>
      )}

      {/* ----- LE DÉROULÉ ORAL (pièce maîtresse) ----- */}
      <SectionTitle>Ma présentation (2 à 3 min)</SectionTitle>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Le propos d’ouverture de la 2ᵈᵉ partie, en trois temps. Entraîne-toi à
        voix haute avec le minuteur, puis lance l’entretien.
      </p>
      <div className="mt-3">
        <AdjustableTimer initialSeconds={180} autoStart={false} />
      </div>

      {oeuvre.accroche && (
        <p className="mt-4 italic text-slate-600 dark:text-slate-400">
          <span className="font-semibold not-italic text-slate-900 dark:text-slate-100">
            Accroche possible. </span>
          <LiteraryText text={oeuvre.accroche} />
        </p>
      )}

      <h3 className="mt-5 text-base font-semibold text-slate-900 dark:text-slate-100">
        1. Pourquoi ce choix ?
      </h3>
      <div className="mt-2">
        <ArgumentBlock
          arg={pres.pourquoiCeChoix}
          noteKey={`${ns}:pourquoi`}
          notePlaceholder="Ma version personnelle du « pourquoi ce choix »…"
        />
      </div>
      <div className="mt-3">
        <RevisedToggle
          checkKey={`${eleve ?? ''}::oeuvre::pourquoi`}
          compactLabel
          label="Marquer ce temps comme revu"
        />
      </div>

      <h3 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
        2. Présentation de l’œuvre
      </h3>
      <div className="mt-2 space-y-2">
        {pres.fil.map((segment, i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {segment.titre}
            </p>
            <div className="mt-1">
              <LiteraryText text={segment.contenu} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <RevisedToggle
          checkKey={`${eleve ?? ''}::oeuvre::presentation`}
          compactLabel
          label="Marquer ce temps comme revu"
        />
      </div>

      <h3 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
        3. Mon jugement personnel
      </h3>
      <div className="mt-2">
        <ArgumentBlock
          arg={pres.jugementPersonnel}
          noteKey={`${ns}:jugement`}
          notePlaceholder="Ma version personnelle du jugement…"
        />
      </div>
      <div className="mt-3">
        <RevisedToggle
          checkKey={`${eleve ?? ''}::oeuvre::jugement`}
          compactLabel
          label="Marquer ce temps comme revu"
        />
      </div>

      {oralViewMode === 'essentiel' && (
        <p className="mt-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-3 text-xs text-slate-600 dark:text-slate-400">
          Mode <strong>Essentiel</strong> : seul le propos à dire en 2-3 min est
          affiché. Passe en <strong>Détaillé</strong> (en haut) pour le dossier
          complet : auteur, contexte, résumé, personnages, thèmes, passages clés
          et ouvertures.
        </p>
      )}

      {/* ----- RÉFÉRENTIEL DE FOND (mode Détaillé) ----- */}
      {oralViewMode === 'detaille' && (
        <>
      {oeuvre.auteurNotice && (
        <>
          <SectionTitle>L’auteur</SectionTitle>
          <div className="mt-2">
            <LiteraryText text={oeuvre.auteurNotice} />
          </div>
        </>
      )}

      {oeuvre.contexte && (
        <>
          <SectionTitle>Contexte</SectionTitle>
          <div className="mt-2">
            <LiteraryText text={oeuvre.contexte} />
          </div>
        </>
      )}

      {oeuvre.resume && (
        <>
          <SectionTitle>Résumé</SectionTitle>
          <div className="mt-2">
            <LiteraryText text={oeuvre.resume} />
          </div>
        </>
      )}

      {oeuvre.structure && (
        <>
          <SectionTitle>Structure & narration</SectionTitle>
          <div className="mt-2">
            <LiteraryText text={oeuvre.structure} />
          </div>
        </>
      )}

      {oeuvre.personnages && oeuvre.personnages.length > 0 && (
        <>
          <SectionTitle>Personnages</SectionTitle>
          <ul className="mt-2 space-y-2">
            {oeuvre.personnages.map((p) => (
              <li
                key={p.nom}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3"
              >
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {p.nom}
                </span>
                <span className="text-slate-500 dark:text-slate-400"> — {p.role}</span>
                {p.description && (
                  <p className="mt-1">
                    <LiteraryText text={p.description} />
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {oeuvre.themes && oeuvre.themes.length > 0 && (
        <>
          <SectionTitle>Thèmes & enjeux</SectionTitle>
          <div className="mt-2 space-y-3">
            {oeuvre.themes.map((t) => (
              <div
                key={t.titre}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4"
              >
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {t.titre}
                </h3>
                <p className="mt-1">
                  <LiteraryText text={t.developpement} />
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {oeuvre.passagesCles && oeuvre.passagesCles.length > 0 && (
        <>
          <SectionTitle>Passages clés</SectionTitle>
          <div className="mt-2 space-y-3">
            {oeuvre.passagesCles.map((p, idx) => (
              <div
                key={p.titre}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {p.titre}
                  </h3>
                  {p.reference && (
                    <span className="shrink-0 rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {p.reference}
                    </span>
                  )}
                </div>
                <p className="mt-1 italic text-slate-600 dark:text-slate-400">
                  <LiteraryText text={p.situation} />
                </p>
                <p className="mt-2">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    Intérêt. </span>
                  <LiteraryText text={p.interet} />
                </p>
                <RevealPanel label="Mes citations">
                  <PersonalNote
                    storageKey={`${ns}:passage:${idx}`}
                    placeholder="Recopie ici la ou les citations exactes de ce passage…"
                  />
                </RevealPanel>
              </div>
            ))}
          </div>
        </>
      )}

      {oeuvre.ouvertures && oeuvre.ouvertures.length > 0 && (
        <>
          <SectionTitle>Ouvertures pour l’entretien</SectionTitle>
          <ul className="mt-2 space-y-2">
            {oeuvre.ouvertures.map((o, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3"
              >
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {o.cible}
                </span>
                {o.type && (
                  <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                    {o.type}
                  </span>
                )}
                <p className="mt-1">
                  <LiteraryText text={o.lien} />
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
        </>
      )}
    </article>
  );
}
