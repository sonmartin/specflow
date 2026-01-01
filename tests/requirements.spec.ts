import { test, expect } from '@playwright/test';

test.describe('Requirements Management', () => {
  test('should display the requirements list', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Requirements' })).toBeVisible();
  });

  test('should show requirement detail panel', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Select a requirement to view details')).toBeVisible();
  });

  test('should have New button in the requirements list', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: '+ New' })).toBeVisible();
  });
});

