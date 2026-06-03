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
import FrenchHomePage from '@/francais/routes/FrenchHomePage';
import FichesPage from '@/francais/routes/module/FichesPage';
import QuizPage from '@/francais/routes/module/QuizPage';
import ExercicesPage from '@/francais/routes/module/ExercicesPage';
import SujetsPage from '@/francais/routes/module/SujetsPage';

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
        <Route index element={<FrenchHomePage />} />
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
