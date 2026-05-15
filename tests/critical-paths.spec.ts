import { test, expect } from '@playwright/test';

test.describe('QCM runner — golden path', () => {
  test('répond à un QCM et voit le feedback', async ({ page }) => {
    await page.goto('/chapitre/suites/automatismes');
    await expect(page.locator('article').first()).toBeVisible();
    const buttons = page.locator('article button:not([disabled])');
    await buttons.first().click();
    await expect(
      page.locator('text=Correct').or(page.locator('text=Pas tout à fait'))
    ).toBeVisible();
  });
});

test.describe('ExerciseRunner — golden path', () => {
  test('ouvre un exercice classique et voit les boutons d\'aide', async ({ page }) => {
    await page.goto('/chapitre/suites/exercices');
    const firstExercise = page.locator('article').first();
    await expect(firstExercise).toBeVisible();
    await expect(page.getByRole('button', { name: 'Voir la solution' }).first()).toBeVisible();
  });

  test('révèle la solution et voit les boutons d\'auto-évaluation', async ({ page }) => {
    await page.goto('/chapitre/suites/exercices');
    await page.getByRole('button', { name: 'Voir la solution' }).first().click();
    await expect(page.getByRole('button', { name: '✓ Je l\'ai réussi' })).toBeVisible();
  });
});

test.describe('Homepage — affichage de la progression', () => {
  test('affiche les 9 chapitres', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('ul li a');
    await expect(links).toHaveCount(9);
  });

  test('affiche les indicateurs de progression par chapitre', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('ul li a').first();
    await expect(firstCard.locator('text=/\\d+\\/\\d+ auto/')).toBeVisible();
  });
});
