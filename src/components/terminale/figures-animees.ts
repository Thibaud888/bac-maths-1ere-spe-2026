import type { ComponentType } from 'react';

/** Ce que reçoit une figure animée : les paramètres écrits dans le bloc `anime`. */
export type ProprietesFigureAnimee = { parametres: Record<string, unknown> };

/**
 * Registre des figures animées (charte § 4.2, bloc `anime`) : un nom → un composant
 * React testé, chargé seulement là où il sert. Aucune n'est encore livrée ; un bloc
 * qui en nomme une inconnue affiche sa consigne et un message de repli.
 */
export const FIGURES_ANIMEES: Readonly<Record<string, ComponentType<ProprietesFigureAnimee>>> = {};
