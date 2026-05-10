import { useEffect, useRef, useState } from 'react';

type TimerProps = {
  durationSeconds: number;
  paused?: boolean;
  onTimeout?: () => void;
  /** Re-démarre le compteur à chaque changement de cette clé. */
  resetKey?: string | number;
};

function formatMs(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`;
}

export default function Timer({
  durationSeconds,
  paused = false,
  onTimeout,
  resetKey,
}: TimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const firedRef = useRef(false);

  useEffect(() => {
    setRemaining(durationSeconds);
    firedRef.current = false;
  }, [durationSeconds, resetKey]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [paused]);

  useEffect(() => {
    if (remaining === 0 && !firedRef.current) {
      firedRef.current = true;
      onTimeout?.();
    }
  }, [remaining, onTimeout]);

  const danger = remaining <= 60 && remaining > 0;
  const expired = remaining === 0;

  return (
    <span
      className={[
        'inline-block rounded px-2 py-1 font-mono text-sm tabular-nums',
        expired
          ? 'bg-red-100 text-red-700'
          : danger
            ? 'bg-amber-100 text-amber-800'
            : 'bg-slate-100 text-slate-700',
      ].join(' ')}
      aria-live="polite"
    >
      {formatMs(remaining)}
    </span>
  );
}
