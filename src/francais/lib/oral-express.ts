import type {
  Flashcard,
  FlashcardDeck,
  FrenchAccent,
  OralText,
  QuizItem,
} from '@/francais/lib/french-types';
import {
  getOralContent,
  getOralStudentEntretien,
  getOralStudentOeuvre,
  getOralStudentTextes,
} from '@/francais/lib/french-content-loader';

/**
 * Construit, à la volée, les decks de flashcards de la « Révision express oral »
 * d'un élève à partir de son contenu DÉJÀ validé (textes, œuvre choisie,
 * entretien, grammaire commune). Aucun contenu n'est dupliqué : les cartes
 * restent toujours synchronisées avec le descriptif. Les `id` (préfixe `flo-`,
 * distinct des flashcards de l'écrit `fl-`) sont stables pour que le suivi
 * « déjà vu » du store fonctionne.
 */
export function buildOralExpressDecks(eleve: string): FlashcardDeck[] {
  const decks: FlashcardDeck[] = [];

  const epreuve = buildEpreuveDeck(eleve);
  if (epreuve) decks.push(epreuve);

  const textes = buildTextesDeck(eleve);
  if (textes) decks.push(textes);

  const grammaire = buildGrammaireDeck(eleve);
  if (grammaire) decks.push(grammaire);

  const oeuvre = buildOeuvreDeck(eleve);
  if (oeuvre) decks.push(oeuvre);

  const entretien = buildEntretienDeck(eleve);
  if (entretien) decks.push(entretien);

  return decks;
}

/**
 * Convertit le quiz de grammaire (commun) en deck de flashcards Q→R pour le
 * « Quiz éclair » : la réponse est révélée directement, et l'élève marque la
 * carte « Je savais » (validée → ne réapparaît plus) ou « À revoir ». Réutilise
 * le moteur de flashcards et la persistance `flashcardDecisions`.
 */
export function buildGrammarQuizDeck(eleve: string): FlashcardDeck | null {
  const { grammaireQuiz } = getOralContent();
  const cards: Flashcard[] = grammaireQuiz.map((q) => ({
    id: `flo-${eleve}-gquiz-${q.id}`,
    deck: 'oral-grammaire-quiz',
    front: quizFront(q),
    back: quizBack(q),
    accent: 'blue',
  }));
  return makeDeck(
    'oral-grammaire-quiz',
    'Quiz éclair de grammaire',
    'Question → réponse : valide ce que tu sais, garde le reste à revoir.',
    'blue',
    1,
    cards
  );
}

/** Énoncé d'une question de quiz, avec ses choix listés s'il y en a. */
function quizFront(q: QuizItem): string {
  if (q.type === 'ordering' && q.items && q.items.length > 0) {
    return `${q.statement}\n\n*Dans quel ordre ?*`;
  }
  if (q.choices && q.choices.length > 0) {
    const list = q.choices.map((c) => `- ${c}`).join('\n');
    return `${q.statement}\n\n${list}`;
  }
  return q.statement;
}

/** Réponse correcte d'une question de quiz + explication. */
function quizBack(q: QuizItem): string {
  let answer = '';
  if (q.type === 'qcm' && q.choices && typeof q.answer === 'number') {
    answer = `**Réponse :** ${q.choices[q.answer]}`;
  } else if (q.type === 'multi' && q.choices && q.answers) {
    const good = q.answers.map((i) => q.choices![i]).join(' · ');
    answer = `**Réponses :** ${good}`;
  } else if (q.type === 'ordering' && q.items) {
    answer = `**Ordre :** ${q.items.join(' → ')}`;
  }
  return answer ? `${answer}\n\n${q.explanation}` : q.explanation;
}

function makeDeck(
  slug: string,
  title: string,
  description: string,
  accent: FrenchAccent,
  order: number,
  cards: Flashcard[]
): FlashcardDeck | null {
  if (cards.length === 0) return null;
  return {
    slug,
    title,
    description,
    accent,
    order,
    estimatedMinutes: Math.max(1, Math.round(cards.length * 0.5)),
    cards,
  };
}

/** Liste à puces Markdown des mouvements d'un texte (essentiel sinon détaillé). */
function mouvementsBack(text: OralText): string {
  const cles = text.essentiel?.mouvementsCles;
  if (cles && cles.length > 0) {
    return cles.map((m) => `- **${m.titre}** : ${m.phrase}`).join('\n');
  }
  return text.mouvements
    .map((m) => `- **${m.titre}** (${m.bornes}) : ${m.idee}`)
    .join('\n');
}

function buildEpreuveDeck(eleve: string): FlashcardDeck | null {
  const { epreuve } = getOralContent();
  const cards: Flashcard[] = epreuve.map((f) => ({
    id: `flo-${eleve}-epreuve-${f.id}`,
    deck: 'oral-epreuve',
    front: f.title,
    back: f.simplified?.core ?? f.statement,
    ...(f.simplified?.mnemonic ? { mnemonic: f.simplified.mnemonic } : {}),
    accent: 'slate',
  }));
  return makeDeck(
    'oral-epreuve',
    `L'épreuve en bref`,
    'Déroulé, barème, organisation des 30 min de préparation.',
    'slate',
    1,
    cards
  );
}

function buildTextesDeck(eleve: string): FlashcardDeck | null {
  const textes = getOralStudentTextes(eleve);
  const cards: Flashcard[] = [];
  for (const t of textes) {
    const probl = t.essentiel?.problematique ?? t.projetLecture.problematique;
    cards.push({
      id: `flo-${eleve}-${t.id}-probl`,
      deck: 'oral-textes',
      front: `**${t.titre}** — ${t.oeuvre}\n\nQuelle est la problématique ?`,
      back: probl,
      accent: 'emerald',
    });
    cards.push({
      id: `flo-${eleve}-${t.id}-mvts`,
      deck: 'oral-textes',
      front: `**${t.titre}** — Quels sont les mouvements du texte ?`,
      back: mouvementsBack(t),
      accent: 'emerald',
    });
    const aRetenir = t.essentiel?.aRetenir;
    if (aRetenir && aRetenir.length > 0) {
      cards.push({
        id: `flo-${eleve}-${t.id}-retenir`,
        deck: 'oral-textes',
        front: `**${t.titre}** — Ce qu'il faut absolument retenir`,
        back: aRetenir.map((p) => `- ${p}`).join('\n'),
        accent: 'emerald',
      });
    }
  }
  return makeDeck(
    'oral-textes',
    'Mes textes (P1)',
    'Problématique et mouvements clés de chaque texte du descriptif.',
    'emerald',
    2,
    cards
  );
}

function buildGrammaireDeck(eleve: string): FlashcardDeck | null {
  const { grammaireFiches } = getOralContent();
  const cards: Flashcard[] = grammaireFiches.map((f) => ({
    id: `flo-${eleve}-gram-${f.id}`,
    deck: 'oral-grammaire',
    front: `Grammaire — ${f.title}`,
    back: f.simplified?.core ?? f.statement,
    ...(f.simplified?.mnemonic ? { mnemonic: f.simplified.mnemonic } : {}),
    accent: 'blue',
  }));
  return makeDeck(
    'oral-grammaire',
    'Grammaire éclair (P1)',
    'Les points de grammaire au programme, version express.',
    'blue',
    3,
    cards
  );
}

function buildOeuvreDeck(eleve: string): FlashcardDeck | null {
  const oeuvre = getOralStudentOeuvre(eleve);
  if (!oeuvre) return null;
  const pres = oeuvre.presentationOrale;
  const cards: Flashcard[] = [];

  cards.push({
    id: `flo-${eleve}-oeuvre-pourquoi`,
    deck: 'oral-oeuvre',
    front: `${oeuvre.oeuvre} — Pourquoi avoir choisi cette œuvre ?`,
    back: pres.pourquoiCeChoix.points.map((p) => `- ${p}`).join('\n'),
    accent: 'violet',
  });

  pres.fil.forEach((segment, i) => {
    cards.push({
      id: `flo-${eleve}-oeuvre-fil-${i}`,
      deck: 'oral-oeuvre',
      front: `${oeuvre.oeuvre} — Présentation : ${segment.titre}`,
      back: segment.contenu,
      accent: 'violet',
    });
  });

  cards.push({
    id: `flo-${eleve}-oeuvre-jugement`,
    deck: 'oral-oeuvre',
    front: `${oeuvre.oeuvre} — Mon jugement personnel`,
    back: pres.jugementPersonnel.points.map((p) => `- ${p}`).join('\n'),
    accent: 'violet',
  });

  (oeuvre.passagesCles ?? []).forEach((p, i) => {
    cards.push({
      id: `flo-${eleve}-oeuvre-passage-${i}`,
      deck: 'oral-oeuvre',
      front: `${oeuvre.oeuvre} — Passage clé : ${p.titre}`,
      back: p.interet,
      accent: 'violet',
    });
  });

  return makeDeck(
    'oral-oeuvre',
    'Mon œuvre choisie (P2)',
    'Les 3 temps de ma présentation + passages clés.',
    'violet',
    4,
    cards
  );
}

function buildEntretienDeck(eleve: string): FlashcardDeck | null {
  const entretien = getOralStudentEntretien(eleve);
  const cards: Flashcard[] = entretien
    .filter((q) => !!q.reponseEssentielle)
    .map((q) => ({
      id: `flo-${eleve}-entretien-${q.id}`,
      deck: 'oral-entretien',
      // Préfixe l'œuvre : les cartes sont mélangées avec d'autres decks, on
      // rappelle qu'il s'agit de l'entretien sur l'œuvre choisie.
      front: `*${q.oeuvre}* (entretien) — ${q.question}`,
      back: q.reponseEssentielle!,
      accent: 'amber',
    }));
  return makeDeck(
    'oral-entretien',
    `Entretien (P2)`,
    `Mes réponses clés aux questions probables sur l'œuvre choisie.`,
    'amber',
    5,
    cards
  );
}
