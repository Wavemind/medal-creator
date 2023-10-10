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
  await viewerPage.page.getByTestId('subMenu-drugs').click()
  await expect(
    await viewerPage.page.getByRole('heading', { name: 'Drugs' })
  ).toBeVisible()
})

test.describe('Check viewer drug permissions', () => {
  test('should not be able to create, edit or delete a drug', async ({
    viewerPage,
  }) => {
    await expect(await viewerPage.getByTestId('create-drug')).not.toBeVisible()
    await expect(
      await viewerPage.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should not be able to create, edit or delete a drug exclusion', async ({
    viewerPage,
  }) => {
    await viewerPage.page.getByTestId('datatable-open-node').first().click()
    await expect(
      await viewerPage.page
        .getByTestId('node-exclusion-row')
        .getByRole('cell', { name: 'Panadol' })
    ).toBeVisible()
    await expect(
      viewerPage.page.getByRole('button', { name: 'Add exclusion' })
    ).not.toBeVisible()
    await expect(
      viewerPage.page.getByRole('button', { name: 'Delete' })
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ viewerPage }) => {
    await viewerPage.searchFor('Amo', 'Amox')
    await viewerPage.searchFor('toto', 'No data available')
  })
})
