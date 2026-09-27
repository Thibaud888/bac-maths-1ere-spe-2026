import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import { applyTheme } from '@/lib/themes';
import { useAppStore } from '@/stores/app-store';
import '@/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root introuvable dans index.html');
}

// Thème posé avant le premier rendu : pas d'éclair de thème clair au chargement.
applyTheme(useAppStore.getState().theme);

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
