export const EXAM_DATE = new Date('2026-06-12T08:00:00+02:00');

export function daysUntilExam(now: Date = new Date()): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((EXAM_DATE.getTime() - now.getTime()) / msPerDay);
}
