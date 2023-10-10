/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ clinicianPage }) => {
  await clinicianPage.page.goto('/')
})

test.describe('Check clinician project permissions', () => {
  test('should not be able to create or update a project', async ({
    clinicianPage,
  }) => {
    await expect(
      await clinicianPage.getByTestId('new-project')
    ).not.toBeVisible()
    await clinicianPage.page.goto('/projects/new')
    await expect(
      await clinicianPage.page.getByRole('heading', {
        name: 'New project',
      })
    ).not.toBeVisible()
    await clinicianPage.getByTestId('project-menu-1').click()
    await expect(
      await clinicianPage.page.getByRole('menuitem', {
        name: 'Settings',
      })
    ).not.toBeVisible()
    await clinicianPage.page.goto('/projects/1/edit')
    await expect(
      await clinicianPage.page.getByRole('heading', {
        name: 'Edit Project for Tanzania',
      })
    ).not.toBeVisible()
    await clinicianPage.page
      .getByRole('link', { name: 'Project for Tanzania' })
      .click()
    await expect(
      await clinicianPage.getByTestId('project-settings')
    ).not.toBeVisible()
  })
})
