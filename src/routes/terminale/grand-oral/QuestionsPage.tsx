import { Link } from 'react-router-dom';
import { spacesOfYear } from '@/lib/spaces';
import GrandOralIntro from '@/components/grand-oral/GrandOralIntro';
import QuestionForm from '@/components/grand-oral/QuestionForm';
import SectionSources from '@/components/grand-oral/SectionSources';
import Essentiel from '@/components/shared/Essentiel';
import { Refs, SourcesNumerotees } from '@/components/shared/Sources';
import { estFormulee, useGrandOralStore } from '@/stores/grand-oral-store';

/** Les spécialités de terminale : les espaces de l'année, hors grand oral. */
const SPECIALITES = spacesOfYear('terminale').filter((s) => s.id !== 'tle-grand-oral');

const SOURCES = ['s-grand-oral'] as const;

const LIEN = 'font-medium text-amber-700 underline underline-offset-2 dark:text-amber-400';

export default function QuestionsPage() {
  const questions = useGrandOralStore((s) => s.questions);
  const nbFormulees = questions.filter((q) => estFormulee(q)).length;

  return (
    <SourcesNumerotees ids={SOURCES} accent="amber">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-8 sm:py-8">
        <div className="space-y-6">
          <GrandOralIntro title="Mes 2 questions" />
          <Essentiel accent="amber">
            <ul className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <li>
                {nbFormulees === 0 ? (
                  <>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Un cadre à remplir.
                    </span>{' '}
                    Écris ici tes deux questions au fil de l’année, avec tes professeurs de
                    spécialité.
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {nbFormulees} question{nbFormulees > 1 ? 's' : ''} sur {questions.length}{' '}
                      formulée{nbFormulees > 1 ? 's' : ''}.
                    </span>{' '}
                    Elles servent de tirage à l’
                    <Link to="/terminale/grand-oral/oral-blanc" className={LIEN}>
                      oral blanc
                    </Link>
                    .
                  </>
                )}
              </li>
              <li>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Ce que dit le texte.
                </span>{' '}
                Chaque question porte sur l’une de tes spécialités, ou croise les deux&nbsp;; le
                jour J, elles sont remises au jury sur une feuille signée par tes professeurs de
                spécialité.
                <Refs ids={SOURCES} />{' '}
                <Link to="/terminale/grand-oral/preparation" className={LIEN}>
                  Méthode&nbsp;: trouver l’angle
                </Link>
              </li>
              <li className="text-xs text-slate-600 dark:text-slate-400">
                Tout est enregistré à la frappe, dans ce navigateur et sur cet appareil seulement.
              </li>
            </ul>
          </Essentiel>
        </div>

        <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
          {questions.map((question, index) => (
            <QuestionForm
              key={index}
              index={index}
              question={question}
              specialites={SPECIALITES}
            />
          ))}
        </div>

        <SectionSources />
      </div>
    </SourcesNumerotees>
  );
}
