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
  await viewerContext.page.getByTestId('subMenu-managements').click()
  await expect(
    await viewerContext.page.getByRole('heading', { name: 'Managements' })
  ).toBeVisible()
})

test.describe('Check viewer management permissions', () => {
  test('should not be able to create, edit, duplicate or delete a management', async ({
    viewerContext,
  }) => {
    await expect(
      await viewerContext.getByTestId('new-management')
    ).not.toBeVisible()
    await expect(
      await viewerContext.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should not be able to create, edit or delete a management exclusion', async ({
    viewerContext,
  }) => {
    await viewerContext.page.getByTestId('datatable-open-node').first().click()
    await expect(
      await viewerContext.page
        .getByTestId('node-exclusion-row')
        .getByRole('cell', { name: 'advise' })
    ).toBeVisible()
    await expect(
      viewerContext.page.getByRole('button', { name: 'Add exclusion' })
    ).not.toBeVisible()
    await expect(
      viewerContext.page.getByRole('button', { name: 'Delete' })
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ viewerContext }) => {
    await viewerContext.searchFor('refer', 'M2 refer')
    await viewerContext.searchFor('toto', 'No data available')
  })
})
