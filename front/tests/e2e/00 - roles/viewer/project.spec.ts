/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ viewerPage }) => {
  await viewerPage.page.goto('/')
})

test.describe('Check viewer project permissions', () => {
  test('should not be able to create or update a project', async ({
    viewerPage,
  }) => {
    await expect(await viewerPage.getByTestId('new-project')).not.toBeVisible()
    await viewerPage.page.goto('/projects/new')
    await expect(
      await viewerPage.page.getByRole('heading', { name: 'New project' })
    ).not.toBeVisible()
    await viewerPage.getByTestId('project-menu-1').click()
    await expect(
      await viewerPage.page.getByRole('menuitem', { name: 'Settings' })
    ).not.toBeVisible()
    await viewerPage.page.goto('/projects/1/edit')
    await expect(
      await viewerPage.page.getByRole('heading', {
        name: 'Edit Project for Tanzania',
      })
    ).not.toBeVisible()
    await viewerPage.page
      .getByRole('link', { name: 'Project for Tanzania' })
      .click()
    await expect(
      await viewerPage.getByTestId('project-settings')
    ).not.toBeVisible()
  })
})
