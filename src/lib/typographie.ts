/**
 * Typographie française, appliquée au moment de l'affichage.
 *
 * Le contenu JSON est écrit au clavier (apostrophe droite, espaces ordinaires) ;
 * l'interface, elle, emploie l'apostrophe courbe. Plutôt que de réécrire les
 * fichiers, les pages passent leurs textes par `typographie()` : le texte ne
 * change pas, seule sa présentation s'harmonise.
 *
 * - apostrophe droite ' → apostrophe courbe ’ ;
 * - espace insécable avant « : ; ! ? » et après « « », avant « » » : la
 *   ponctuation ne part jamais seule en début de ligne ;
 * - espace insécable entre un nombre et le mot qui le suit (« 20 min »,
 *   « 14 juin ») : un nombre ne se sépare pas de son unité.
 */

const INSECABLE = ' ';

export function typographie(texte: string): string {
  return texte
    .replace(/'/g, '’')
    .replace(/ ([:;!?»])/g, `${INSECABLE}$1`)
    .replace(/« /g, `«${INSECABLE}`)
    .replace(/(\d) (?=[\p{L}%])/gu, `$1${INSECABLE}`);
}
