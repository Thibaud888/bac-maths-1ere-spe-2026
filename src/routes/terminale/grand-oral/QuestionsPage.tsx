import { Link } from 'react-router-dom';
import { spacesOfYear } from '@/lib/spaces';
import GrandOralIntro from '@/components/grand-oral/GrandOralIntro';
import QuestionForm from '@/components/grand-oral/QuestionForm';
import SectionSources from '@/components/grand-oral/SectionSources';
import { Refs, SourcesNumerotees } from '@/components/shared/Sources';
import { estFormulee, useGrandOralStore } from '@/stores/grand-oral-store';

/** Les spécialités de terminale : les espaces de l'année, hors grand oral. */
const SPECIALITES = spacesOfYear('terminale').filter((s) => s.id !== 'tle-grand-oral');

const SOURCES = ['s-grand-oral'] as const;

export default function QuestionsPage() {
  const questions = useGrandOralStore((s) => s.questions);
  const nbFormulees = questions.filter((q) => estFormulee(q)).length;

  return (
    <SourcesNumerotees ids={SOURCES} accent="amber">
      <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
        <GrandOralIntro title="Mes 2 questions" />

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-slate-300">
          {nbFormulees === 0 ? (
            <p>
              <span className="font-semibold">Un cadre à remplir.</span> Écris ici tes deux
              questions au fil de l’année, avec tes professeurs de spécialité.
            </p>
          ) : (
            <p>
              <span className="font-semibold">
                {nbFormulees} question{nbFormulees > 1 ? 's' : ''} sur {questions.length}{' '}
                formulée{nbFormulees > 1 ? 's' : ''}.
              </span>{' '}
              Elles servent de tirage à l’
              <Link
                to="/terminale/grand-oral/oral-blanc"
                className="font-medium text-amber-700 underline underline-offset-2 dark:text-amber-400"
              >
                oral blanc
              </Link>
              .
            </p>
          )}
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            Tout est enregistré à la frappe, dans ce navigateur et sur cet appareil seulement.
          </p>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          Chaque question porte sur l’une de tes spécialités, ou croise les deux ; le jour J, elles
          sont remises au jury sur une feuille signée par tes professeurs de spécialité.
          <Refs ids={SOURCES} />{' '}
          <Link
            to="/terminale/grand-oral/preparation"
            className="font-medium text-amber-700 underline underline-offset-2 dark:text-amber-400"
          >
            Méthode : trouver l’angle
          </Link>
        </p>

        {questions.map((question, index) => (
          <QuestionForm
            key={index}
            index={index}
            question={question}
            specialites={SPECIALITES}
          />
        ))}

        <SectionSources />
      </div>
    </SourcesNumerotees>
  );
}
