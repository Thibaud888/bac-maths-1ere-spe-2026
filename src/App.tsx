import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { useAppStore } from '@/stores/app-store';
import { applyTheme } from '@/lib/themes';
import ChapterLayout from '@/components/layout/ChapterLayout';
import HomePage from '@/routes/HomePage';
import NotFoundPage from '@/routes/NotFoundPage';
import LeBacPage from '@/routes/outils/LeBacPage';
import SimulateurPage from '@/routes/outils/SimulateurPage';
import MatiereAccueilPage from '@/routes/terminale/MatiereAccueilPage';
import ChapitreLayout from '@/routes/terminale/chapitre/ChapitreLayout';
import ApercuPage from '@/routes/terminale/chapitre/ApercuPage';
import { CoursIndex, CoursNotionPage } from '@/routes/terminale/chapitre/CoursPage';
import TleExercicesPage, { ExercicePage } from '@/routes/terminale/chapitre/ExercicesPage';
import TypeBacPage, { TypeBacExercicePage } from '@/routes/terminale/chapitre/TypeBacPage';
import MemoPage from '@/routes/terminale/chapitre/MemoPage';
import type { Matiere } from '@/lib/terminale/types';
import GrandOralLayout from '@/routes/terminale/grand-oral/GrandOralLayout';
import EpreuvePage from '@/routes/terminale/grand-oral/EpreuvePage';
import QuestionsPage from '@/routes/terminale/grand-oral/QuestionsPage';
import PreparationPage from '@/routes/terminale/grand-oral/PreparationPage';
import ExposePage from '@/routes/terminale/grand-oral/ExposePage';
import EntretienPage from '@/routes/terminale/grand-oral/EntretienPage';
import OralBlancPage from '@/routes/terminale/grand-oral/OralBlancPage';
import MathsHomePage from '@/routes/premiere/MathsHomePage';
import BacBlancPage from '@/routes/BacBlancPage';
import FormularyPage from '@/routes/chapter/FormularyPage';
import AutomatismsPage from '@/routes/chapter/AutomatismsPage';
import ClassicsPage from '@/routes/chapter/ClassicsPage';
import ExamPage from '@/routes/chapter/ExamPage';
import FrenchModuleLayout from '@/francais/components/layout/FrenchModuleLayout';
import FrenchHubPage from '@/francais/routes/FrenchHubPage';
import EcritHomePage from '@/francais/routes/EcritHomePage';
import FichesPage from '@/francais/routes/module/FichesPage';
import QuizPage from '@/francais/routes/module/QuizPage';
import ExercicesPage from '@/francais/routes/module/ExercicesPage';
import SujetsPage from '@/francais/routes/module/SujetsPage';
import ExpressPage from '@/francais/routes/ExpressPage';
import OralStudentLayout from '@/francais/components/oral/OralStudentLayout';
import OralSelectPage from '@/francais/routes/oral/OralSelectPage';
import OralHomePage from '@/francais/routes/oral/OralHomePage';
import OralTextesPage from '@/francais/routes/oral/OralTextesPage';
import OralTextDetailPage from '@/francais/routes/oral/OralTextDetailPage';
import OralMethodePage from '@/francais/routes/oral/OralMethodePage';
import OralGrammairePage from '@/francais/routes/oral/OralGrammairePage';
import OralEntretienPage from '@/francais/routes/oral/OralEntretienPage';
import OralExpressPage from '@/francais/routes/oral/OralExpressPage';
import OralEpreuvePage from '@/francais/routes/oral/OralEpreuvePage';
import OralOeuvrePage from '@/francais/routes/oral/OralOeuvrePage';
import OralSimulateurPage from '@/francais/routes/oral/OralSimulateurPage';

/**
 * Renvoie une ancienne adresse vers la nouvelle, en gardant le sous-chemin :
 * les liens et favoris d'avant la réorganisation continuent de fonctionner.
 */
/**
 * Routes d'une matière de terminale : accueil, « Méthodes » (chapitre transverse) et
 * chapitres — mêmes pages pour les deux matières (charte § 11).
 */
function routesTerminale(matiere: Matiere, base: string) {
  const pages = (
    <>
      <Route index element={<ApercuPage />} />
      <Route path="cours" element={<CoursIndex />} />
      <Route path="cours/:notion" element={<CoursNotionPage />} />
      <Route path="exercices" element={<TleExercicesPage />} />
      <Route path="exercices/:exercice" element={<ExercicePage />} />
      <Route path="type-bac" element={<TypeBacPage />} />
      <Route path="type-bac/:exercice" element={<TypeBacExercicePage />} />
      <Route path="memo" element={<MemoPage />} />
    </>
  );
  return [
    <Route key={base} path={base} element={<MatiereAccueilPage matiere={matiere} />} />,
    <Route key={`${base}/methodes`} path={`${base}/methodes`} element={<ChapitreLayout matiere={matiere} transverse />}>
      {pages}
    </Route>,
    <Route key={`${base}/:slug`} path={`${base}/:slug`} element={<ChapitreLayout matiere={matiere} />}>
      {pages}
    </Route>,
  ];
}

function LegacyRedirect({ from, to }: { from: string; to: string }) {
  const { pathname, search, hash } = useLocation();
  const rest = pathname.startsWith(from) ? pathname.slice(from.length) : '';
  return <Navigate to={`${to}${rest}${search}${hash}`} replace />;
}

export default function App() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />

        {/* --- Outils, valables pour les deux années --- */}
        <Route path="/le-bac" element={<LeBacPage />} />
        <Route path="/simulateur" element={<SimulateurPage />} />

        {/* --- Terminale --- */}
        <Route path="/terminale" element={<Navigate to="/terminale/maths" replace />} />
        {routesTerminale('maths', '/terminale/maths')}
        {routesTerminale('physique-chimie', '/terminale/physique-chimie')}
        <Route path="/terminale/grand-oral" element={<GrandOralLayout />}>
          <Route index element={<Navigate to="epreuve" replace />} />
          <Route path="epreuve" element={<EpreuvePage />} />
          <Route path="questions" element={<QuestionsPage />} />
          <Route path="preparation" element={<PreparationPage />} />
          <Route path="expose" element={<ExposePage />} />
          <Route path="entretien" element={<EntretienPage />} />
          <Route path="oral-blanc" element={<OralBlancPage />} />
        </Route>

        {/* --- Première : maths --- */}
        <Route path="/premiere" element={<Navigate to="/premiere/maths" replace />} />
        <Route path="/premiere/maths" element={<MathsHomePage />} />
        <Route path="/premiere/maths/bac-blanc" element={<BacBlancPage />} />
        <Route path="/premiere/maths/:slug" element={<ChapterLayout />}>
          <Route index element={<Navigate to="formulaire" replace />} />
          <Route path="formulaire" element={<FormularyPage />} />
          <Route path="automatismes" element={<AutomatismsPage />} />
          <Route path="classiques" element={<ClassicsPage />} />
          <Route path="examen" element={<ExamPage />} />
        </Route>

        {/* --- Première : français --- */}
        <Route path="/premiere/francais">
          <Route index element={<FrenchHubPage />} />
          <Route path="ecrit" element={<EcritHomePage />} />
          <Route path="express" element={<ExpressPage />} />
          <Route path="oral">
            <Route index element={<OralSelectPage />} />
            <Route path=":eleve" element={<OralStudentLayout />}>
              <Route index element={<OralHomePage />} />
              <Route path="epreuve" element={<OralEpreuvePage />} />
              <Route path="textes" element={<OralTextesPage />} />
              <Route path="textes/:id" element={<OralTextDetailPage />} />
              <Route path="methode" element={<OralMethodePage />} />
              <Route path="grammaire" element={<OralGrammairePage />} />
              <Route path="oeuvre" element={<OralOeuvrePage />} />
              <Route path="entretien" element={<OralEntretienPage />} />
              <Route path="express" element={<OralExpressPage />} />
              <Route path="simulateur" element={<OralSimulateurPage />} />
            </Route>
          </Route>
          <Route path="module/:slug" element={<FrenchModuleLayout />}>
            <Route index element={<Navigate to="fiches" replace />} />
            <Route path="fiches" element={<FichesPage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route path="exercices" element={<ExercicesPage />} />
            <Route path="sujets" element={<SujetsPage />} />
          </Route>
        </Route>
      </Route>

      {/* --- Anciennes adresses, conservées --- */}
      <Route
        path="/bac-blanc"
        element={<Navigate to="/premiere/maths/bac-blanc" replace />}
      />
      <Route
        path="/chapitre/*"
        element={<LegacyRedirect from="/chapitre" to="/premiere/maths" />}
      />
      <Route
        path="/francais/*"
        element={<LegacyRedirect from="/francais" to="/premiere/francais" />}
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
