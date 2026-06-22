import { Link, useLocation } from 'react-router-dom';
import {
  getOralStudent,
  listFrenchModules,
} from '@/francais/lib/french-content-loader';
import type { FrenchFamily } from '@/francais/lib/french-types';
import NavSidebar, { type NavGroup } from '@/components/layout/NavSidebar';

export const familyLabels: Record<FrenchFamily, string> = {
  methode: 'Méthode',
  reperes: 'Repères',
  'objet-etude': 'Objets d’étude',
};

const familyDot: Record<FrenchFamily, string> = {
  methode: 'bg-blue-500',
  reperes: 'bg-amber-500',
  'objet-etude': 'bg-emerald-500',
};

const familyOrder: FrenchFamily[] = ['methode', 'reperes', 'objet-etude'];

export default function FrenchSidebar() {
  const location = useLocation();

  // Espace oral d'un élève : la barre latérale liste les sections de l'élève
  // (groupées par partie d'épreuve), au lieu des modules de l'écrit.
  const oralMatch = location.pathname.match(/^\/francais\/oral\/([^/]+)/);
  if (oralMatch) {
    return <OralSidebar eleve={oralMatch[1]!} />;
  }

  const modules = listFrenchModules();
  const groups: NavGroup[] = familyOrder.reduce<NavGroup[]>((acc, family) => {
    const inFamily = modules.filter((m) => m.family === family);
    if (inFamily.length > 0) {
      acc.push({
        label: familyLabels[family],
        dot: familyDot[family],
        items: inFamily.map((m) => ({
          to: `/francais/module/${m.slug}`,
          label: m.shortTitle ?? m.title,
        })),
      });
    }
    return acc;
  }, []);

  return (
    <NavSidebar
      accent="indigo"
      brand={
        <div className="px-5 pt-6 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
            Première · 2025–2026
          </p>
          <p className="mt-1 text-[17px] font-bold leading-tight text-slate-900 dark:text-white">
            Bac Français
          </p>
          <p className="mt-1.5 text-[11px] leading-snug text-slate-400 dark:text-slate-500">
            EAF · écrit &amp; oral
          </p>
        </div>
      }
      primary={[
        { to: '/francais', label: 'Accueil', end: true },
        { to: '/francais/oral', label: 'Préparer l’oral' },
        { to: '/francais/express', label: 'Révision express' },
        { to: '/francais/ecrit', label: 'Accueil écrit', end: true },
      ]}
      groups={groups}
    />
  );
}

function OralSidebar({ eleve }: { eleve: string }) {
  const student = getOralStudent(eleve);
  const base = `/francais/oral/${eleve}`;

  const groups: NavGroup[] = [
    {
      label: 'Partie 1',
      dot: 'bg-emerald-500',
      items: [
        { to: `${base}/textes`, label: 'Textes' },
        { to: `${base}/grammaire`, label: 'Grammaire' },
      ],
    },
    {
      label: 'Partie 2',
      dot: 'bg-teal-500',
      items: [
        { to: `${base}/oeuvre`, label: 'Œuvre choisie' },
        { to: `${base}/entretien`, label: 'Entretien' },
      ],
    },
    {
      label: 'Outils',
      dot: 'bg-slate-400',
      items: [
        { to: `${base}/express`, label: 'Express' },
        { to: `${base}/methode`, label: 'Méthode' },
        { to: `${base}/epreuve`, label: 'L’épreuve' },
        { to: `${base}/simulateur`, label: 'Oral blanc' },
      ],
    },
  ];

  return (
    <NavSidebar
      accent="emerald"
      brand={
        <div className="px-5 pt-6 pb-4">
          <Link
            to="/francais/oral"
            className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            ← Changer d’élève
          </Link>
          <p className="mt-2 text-[17px] font-bold leading-tight text-slate-900 dark:text-white">
            {student?.nom ?? eleve}
          </p>
          <p className="mt-1.5 text-[11px] leading-snug text-slate-400 dark:text-slate-500">
            Oral · EAF
          </p>
        </div>
      }
      primary={[{ to: base, label: 'Tableau de bord', end: true }]}
      groups={groups}
    />
  );
}
