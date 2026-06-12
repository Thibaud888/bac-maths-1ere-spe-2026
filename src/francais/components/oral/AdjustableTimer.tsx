import { useCallback, useEffect, useRef, useState } from 'react';

type AdjustableTimerProps = {
  initialSeconds: number;
  onTimeout?: () => void;
  autoStart?: boolean;
};

function formatMs(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`;
}

/**
 * Compte à rebours ajustable en cours de route (+5 / −5 min), avec
 * pause/reprise et remise à zéro. Indépendant du Timer maths (qui ne permet
 * pas l'ajustement à chaud).
 */
export default function AdjustableTimer({
  initialSeconds,
  onTimeout,
  autoStart = true,
}: AdjustableTimerProps) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(autoStart);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => { clearInterval(id); };
  }, [running]);

  useEffect(() => {
    if (remaining === 0 && !firedRef.current) {
      firedRef.current = true;
      setRunning(false);
      onTimeout?.();
    }
    if (remaining > 0) {
      firedRef.current = false;
    }
  }, [remaining, onTimeout]);

  const adjust = useCallback((deltaSeconds: number) => {
    setRemaining((r) => Math.max(0, r + deltaSeconds));
  }, []);

  const expired = remaining === 0;
  const danger = remaining <= 60 && remaining > 0;

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
      <div className="flex items-center justify-center">
        <span
          className={[
            'font-mono text-5xl font-bold tabular-nums',
            expired
              ? 'text-red-600 dark:text-red-400'
              : danger
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-900 dark:text-slate-100',
          ].join(' ')}
          aria-live="polite"
        >
          {formatMs(remaining)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => { adjust(-300); }}
          className="rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          −5 min
        </button>
        <button
          type="button"
          onClick={() => { adjust(300); }}
          className="rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          +5 min
        </button>
        <button
          type="button"
          onClick={() => { setRunning((v) => !v); }}
          className="rounded bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          {running ? 'Pause' : 'Reprendre'}
        </button>
        <button
          type="button"
          onClick={() => { setRemaining(initialSeconds); firedRef.current = false; }}
          className="rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
