const { test, expect } = require('@playwright/test');

test.describe('TaskFlow E2E Lifecycle', () => {
  test('creates, edits, and deletes a task', async ({ page }) => {
    // 1. Load the app
    await page.goto('http://localhost:3000');
    await expect(page.getByRole('heading', { name: 'TaskFlow', level: 1 })).toBeVisible();

    const uniqueTitle = `E2E Task ${Date.now()}`;

    // 2. Create a new task via the form
    await page.getByLabel(/Title \*/i).fill(uniqueTitle);
    await page.getByLabel(/Description/i).fill('This task was created by automated Playwright E2E test.');
    await page.getByLabel(/Status/i).selectOption('todo');
    await page.getByLabel(/Priority/i).selectOption('high');
    await page.getByTestId('submit-button').click();

    // 3. Assert it appears in the list
    const taskCard = page.locator('.task-card', { hasText: uniqueTitle });
    await expect(taskCard).toBeVisible();
    await expect(taskCard.getByTestId('task-title')).toHaveText(uniqueTitle);
    await expect(taskCard.getByTestId('task-status-badge')).toHaveText('To Do');

    // 4. Edit the task's status
    await taskCard.getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByRole('heading', { name: 'Edit Task' })).toBeVisible();
    await page.getByLabel(/Status/i).selectOption('in_progress');
    await page.getByTestId('submit-button').click();

    // 5. Assert the change is reflected
    await expect(taskCard.getByTestId('task-status-badge')).toHaveText('In Progress');

    // 6. Delete the task
    await taskCard.getByRole('button', { name: 'Delete' }).click();

    // 7. Assert it's removed from the list
    await expect(taskCard).not.toBeVisible();
  });
});
