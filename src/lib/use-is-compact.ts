import { useEffect, useState } from 'react';

/** Largeur en dessous de laquelle la barre latérale s'ouvre en tiroir. */
const COMPACT_QUERY = '(max-width: 767px)';

function matches(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(COMPACT_QUERY).matches;
}

/**
 * Vrai sur écran étroit (téléphone). La barre latérale y est masquée par
 * défaut et s'ouvre par-dessus la page au lieu de la pousser.
 */
export function useIsCompact(): boolean {
  const [compact, setCompact] = useState(matches);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mq = window.matchMedia(COMPACT_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      setCompact(event.matches);
    };
    mq.addEventListener('change', onChange);
    setCompact(mq.matches);
    return () => {
      mq.removeEventListener('change', onChange);
    };
  }, []);

  return compact;
}
