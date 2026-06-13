import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { useAppStore } from '@/stores/app-store';
import ChapterLayout from '@/components/layout/ChapterLayout';
import HomePage from '@/routes/HomePage';
import BacBlancPage from '@/routes/BacBlancPage';
import NotFoundPage from '@/routes/NotFoundPage';
import FormularyPage from '@/routes/chapter/FormularyPage';
import AutomatismsPage from '@/routes/chapter/AutomatismsPage';
import ClassicsPage from '@/routes/chapter/ClassicsPage';
import ExamPage from '@/routes/chapter/ExamPage';
import FrenchLayout from '@/francais/components/layout/FrenchLayout';
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
import OralEpreuvePage from '@/francais/routes/oral/OralEpreuvePage';
import OralOeuvrePage from '@/francais/routes/oral/OralOeuvrePage';
import OralSimulateurPage from '@/francais/routes/oral/OralSimulateurPage';

export default function App() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/bac-blanc" element={<BacBlancPage />} />
        <Route path="/chapitre/:slug" element={<ChapterLayout />}>
          <Route index element={<Navigate to="formulaire" replace />} />
          <Route path="formulaire" element={<FormularyPage />} />
          <Route path="automatismes" element={<AutomatismsPage />} />
          <Route path="classiques" element={<ClassicsPage />} />
          <Route path="examen" element={<ExamPage />} />
        </Route>
      </Route>

      {/* --- Volet Français (additif, routes maths inchangées) --- */}
      <Route path="/francais" element={<FrenchLayout />}>
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

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
