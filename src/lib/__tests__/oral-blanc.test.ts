import { describe, expect, it } from 'vitest';
import {
  CHRONO_ARRETE,
  basculerPause,
  demarrer,
  ecouleSecondes,
  enMarche,
  formatDuree,
  formatHorloge,
  nouvelleSeance,
  phaseSuivante,
  restantSecondes,
  seanceFinie,
  suspendre,
} from '../oral-blanc';

const T0 = 1_000_000;
const s = (n: number) => n * 1000;

describe('chrono de l’oral blanc', () => {
  it('compte à partir des horodatages, pas des tics', () => {
    const c = demarrer(CHRONO_ARRETE, T0);
    expect(enMarche(c)).toBe(true);
    expect(ecouleSecondes(c, T0 + s(90))).toBe(90);
  });

  it('ne compte pas le temps passé en pause', () => {
    let c = demarrer(CHRONO_ARRETE, T0);
    c = suspendre(c, T0 + s(30));
    expect(ecouleSecondes(c, T0 + s(300))).toBe(30);
    c = demarrer(c, T0 + s(300));
    expect(ecouleSecondes(c, T0 + s(310))).toBe(40);
  });

  it('ignore un double démarrage ou une double pause', () => {
    const c = demarrer(CHRONO_ARRETE, T0);
    expect(demarrer(c, T0 + s(50))).toBe(c);
    const p = suspendre(c, T0 + s(10));
    expect(suspendre(p, T0 + s(20))).toBe(p);
  });

  it('passe en négatif une fois le temps dépassé', () => {
    const c = demarrer(CHRONO_ARRETE, T0);
    expect(restantSecondes(600, c, T0)).toBe(600);
    expect(restantSecondes(600, c, T0 + 999)).toBe(600);
    expect(restantSecondes(600, c, T0 + s(1))).toBe(599);
    expect(restantSecondes(600, c, T0 + s(635))).toBe(-35);
  });
});

describe('affichage des durées', () => {
  it('écrit l’horloge en minutes:secondes, et le dépassement avec un +', () => {
    expect(formatHorloge(1200)).toBe('20:00');
    expect(formatHorloge(599)).toBe('09:59');
    expect(formatHorloge(0)).toBe('00:00');
    expect(formatHorloge(-35)).toBe('+00:35');
    expect(formatHorloge(-65)).toBe('+01:05');
  });

  it('écrit une durée en clair', () => {
    expect(formatDuree(45)).toBe('45 s');
    expect(formatDuree(600)).toBe('10 min');
    expect(formatDuree(552)).toBe('9 min 12 s');
    expect(formatDuree(-3)).toBe('0 s');
  });
});

describe('séance d’oral blanc', () => {
  const NB = 3;

  it('garde le temps réel de chaque phase et relance le chrono', () => {
    let seance = nouvelleSeance(T0);
    seance = phaseSuivante(seance, NB, T0 + s(1150));
    expect(seance.index).toBe(1);
    expect(seance.realise).toEqual([1150]);
    expect(ecouleSecondes(seance.chrono, T0 + s(1160))).toBe(10);
  });

  it('s’arrête après la dernière phase, sans aller plus loin', () => {
    let seance = nouvelleSeance(T0);
    seance = phaseSuivante(seance, NB, T0 + s(100));
    seance = phaseSuivante(seance, NB, T0 + s(200));
    seance = phaseSuivante(seance, NB, T0 + s(350));
    expect(seanceFinie(seance, NB)).toBe(true);
    expect(seance.realise).toEqual([100, 100, 150]);
    expect(enMarche(seance.chrono)).toBe(false);
    expect(phaseSuivante(seance, NB, T0 + s(999))).toBe(seance);
  });

  it('retire la pause du temps réalisé', () => {
    let seance = nouvelleSeance(T0);
    seance = basculerPause(seance, T0 + s(60));
    seance = basculerPause(seance, T0 + s(360));
    seance = phaseSuivante(seance, NB, T0 + s(420));
    expect(seance.realise).toEqual([120]);
  });
});
