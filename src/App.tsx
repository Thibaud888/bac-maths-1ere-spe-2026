import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ChapterLayout from '@/components/layout/ChapterLayout';
import HomePage from '@/routes/HomePage';
import NotFoundPage from '@/routes/NotFoundPage';
import FormularyPage from '@/routes/chapter/FormularyPage';
import AutomatismsPage from '@/routes/chapter/AutomatismsPage';
import ClassicsPage from '@/routes/chapter/ClassicsPage';
import ExamPage from '@/routes/chapter/ExamPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/chapitre/:slug" element={<ChapterLayout />}>
          <Route index element={<Navigate to="formulaire" replace />} />
          <Route path="formulaire" element={<FormularyPage />} />
          <Route path="automatismes" element={<AutomatismsPage />} />
          <Route path="classiques" element={<ClassicsPage />} />
          <Route path="examen" element={<ExamPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
