import { Route, Routes } from 'react-router-dom';
import HomePage from '@/routes/HomePage';
import ChapterPage from '@/routes/ChapterPage';
import NotFoundPage from '@/routes/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chapitre/:slug" element={<ChapterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
