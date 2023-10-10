/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ viewerPage }) => {
  await viewerPage.page.goto('/')
  await viewerPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await viewerPage.page.getByTestId('sidebar-algorithms').click()
  await expect(
    await viewerPage.page.getByRole('heading', { name: 'Algorithms' })
  ).toBeVisible()
})

// TODO : Add the duplicate test once it's implemented
test.describe('Check viewer algorithm permissions', () => {
  test('should not be able to create, update, archive or duplicate an algorithm', async ({
    viewerPage,
  }) => {
    await expect(
      await viewerPage.getByTestId('create-algorithm')
    ).not.toBeVisible()
    await viewerPage.page
      .getByRole('link', { name: 'Project for Tanzania' })
      .click()
    await viewerPage.page
      .getByRole('link', { name: 'Algorithms', exact: true })
      .click()
    await expect(
      await viewerPage.getByTestId('datatable-menu').first()
    ).not.toBeVisible()
    await viewerPage.page.getByTestId('datatable-show').first().click()
    await expect(
      await viewerPage.page.getByRole('heading', {
        name: 'Decision trees & Diagnoses',
      })
    ).toBeVisible()
    await expect(
      viewerPage.page.getByRole('button', { name: 'Algorithm settings' })
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ viewerPage }) => {
    await viewerPage.searchFor('first algo', 'First algo')
    await viewerPage.searchFor('toto', 'No data available')
  })
})
