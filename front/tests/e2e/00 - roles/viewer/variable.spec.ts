/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ viewerPage }) => {
  await viewerPage.page.goto('/')
  await viewerPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await viewerPage.page.getByTestId('sidebar-library').click()
})

test.describe('Check viewer variable permissions', () => {
  test('should not be able to create, edit, duplicate or delete a variable, but should view details', async ({
    viewerPage,
  }) => {
    await expect(
      await viewerPage.page.getByRole('heading', { name: 'Variables' })
    ).toBeVisible()
    await expect(
      await viewerPage.getByTestId('create-variable')
    ).not.toBeVisible()
    await viewerPage.getByTestId('datatable-menu').first().click()
    await expect(
      await viewerPage.page.getByRole('menuitem', { name: 'Edit' })
    ).not.toBeVisible()
    await expect(
      await viewerPage.page.getByRole('menuitem', { name: 'Duplicate' })
    ).not.toBeVisible()
    await expect(
      await viewerPage.page.getByRole('menuitem', { name: 'Delete' })
    ).not.toBeVisible()
    await viewerPage.page.getByRole('menuitem', { name: 'Info' }).click()
    await expect(await viewerPage.page.getByText('Fever')).toBeVisible()
    await viewerPage.getByTestId('close-modal').click()
  })

  test('should be able to search', async ({ viewerPage }) => {
    await viewerPage.searchFor('Cough', 'Cough')
    await viewerPage.searchFor('toto', 'No data available')
  })
})
