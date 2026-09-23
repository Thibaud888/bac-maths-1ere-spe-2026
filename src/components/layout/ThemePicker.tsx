import { useEffect, useRef, useState } from 'react';
import { THEMES, themeMeta, type ThemeMeta } from '@/lib/themes';
import { useAppStore } from '@/stores/app-store';

/**
 * Choix du thème d'affichage, dans le bandeau supérieur. La liste reste ouverte
 * après un choix : on peut essayer les thèmes l'un après l'autre et voir la
 * page changer derrière. Elle se ferme par un clic ailleurs ou par Échap.
 */
export default function ThemePicker() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const current = themeMeta(theme);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative ml-auto shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Changer de thème (actuel : ${current.label})`}
        className="flex items-center gap-2 rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
      >
        <PaletteIcon />
        <span className="hidden text-xs font-semibold sm:inline">{current.label}</span>
      </button>

      {open && (
        <div
          role="radiogroup"
          aria-label="Thème d’affichage"
          className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800"
        >
          <p className="px-2.5 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Thème
          </p>
          {THEMES.map((t) => (
            <ThemeOption
              key={t.id}
              theme={t}
              selected={t.id === current.id}
              onSelect={() => setTheme(t.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeOption({
  theme,
  selected,
  onSelect,
}: {
  theme: ThemeMeta;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
        selected
          ? 'bg-slate-100 dark:bg-slate-700/70'
          : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'
      }`}
    >
      <Apercu theme={theme} />
      <span className="min-w-0 flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {theme.label}
      </span>
      {selected && <CheckIcon />}
    </button>
  );
}

/** Vignette : le fond, une carte et « Aa » dans les couleurs et la police du thème. */
function Apercu({ theme }: { theme: ThemeMeta }) {
  const { fond, carte, texte, police } = theme.apercu;
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-10 shrink-0 items-end overflow-hidden rounded-md border border-slate-300/70 p-1 dark:border-slate-600"
      style={{ backgroundColor: fond }}
    >
      <span
        className="flex h-5 w-full items-center justify-center rounded-sm text-xs font-semibold leading-none"
        style={{ backgroundColor: carte, color: texte, fontFamily: police }}
      >
        Aa
      </span>
    </span>
  );
}

function PaletteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-1.8a2 2 0 0 0-1.5 3.3c.4.5.3 1.3-.2 1.7-.7.6-1.6 1-2.5 1z" />
      <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
      <circle cx="10.5" cy="7" r="1" fill="currentColor" />
      <circle cx="15" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-slate-700 dark:text-slate-200"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
