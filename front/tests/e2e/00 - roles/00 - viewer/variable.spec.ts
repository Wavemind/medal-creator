/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ viewerContext }) => {
  await viewerContext.page.goto('/')
  await viewerContext.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await viewerContext.page.getByTestId('sidebar-library').click()
})

test.describe('Check viewer variable permissions', () => {
  test('should not be able to create, edit, duplicate or delete a variable, but should view details', async ({
    viewerContext,
  }) => {
    await expect(
      await viewerContext.page.getByRole('heading', { name: 'Variables' })
    ).toBeVisible()
    await expect(
      await viewerContext.getByTestId('create-variable')
    ).not.toBeVisible()
    await viewerContext.getByTestId('datatable-menu').first().click()
    await expect(
      await viewerContext.page.getByRole('menuitem', { name: 'Edit' })
    ).not.toBeVisible()
    await expect(
      await viewerContext.page.getByRole('menuitem', { name: 'Duplicate' })
    ).not.toBeVisible()
    await expect(
      await viewerContext.page.getByRole('menuitem', { name: 'Delete' })
    ).not.toBeVisible()
    await viewerContext.page.getByRole('menuitem', { name: 'Info' }).click()
    await expect(await viewerContext.page.getByText('Fever')).toBeVisible()
    await viewerContext.getByTestId('close-modal').click()
  })

  test('should be able to search', async ({ viewerContext }) => {
    await viewerContext.searchFor('Cough', 'Cough')
    await viewerContext.searchFor('toto', 'No data available')
  })
})
