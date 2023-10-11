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
  await viewerContext.page.getByTestId('subMenu-drugs').click()
  await expect(
    await viewerContext.page.getByRole('heading', { name: 'Drugs' })
  ).toBeVisible()
})

test.describe('Check viewer drug permissions', () => {
  test('should not be able to create, edit or delete a drug', async ({
    viewerContext,
  }) => {
    await expect(
      await viewerContext.getByTestId('create-drug')
    ).not.toBeVisible()
    await expect(
      await viewerContext.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should not be able to create, edit or delete a drug exclusion', async ({
    viewerContext,
  }) => {
    await viewerContext.page.getByTestId('datatable-open-node').first().click()
    await expect(
      await viewerContext.page
        .getByTestId('node-exclusion-row')
        .getByRole('cell', { name: 'Panadol' })
    ).toBeVisible()
    await expect(
      viewerContext.page.getByRole('button', { name: 'Add exclusion' })
    ).not.toBeVisible()
    await expect(
      viewerContext.page.getByRole('button', { name: 'Delete' })
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ viewerContext }) => {
    await viewerContext.searchFor('Amo', 'Amox')
    await viewerContext.searchFor('toto', 'No data available')
  })
})
