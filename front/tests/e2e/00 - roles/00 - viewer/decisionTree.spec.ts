/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ viewerContext }) => {
  await viewerContext.page.goto('/')
  await viewerContext.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await viewerContext.page.getByTestId('sidebar-algorithms').click()
  await viewerContext.page.getByTestId('datatable-show').first().click()
  await expect(
    await viewerContext.page.getByRole('heading', {
      name: 'Decision trees & Diagnoses',
    })
  ).toBeVisible()
})

test.describe('Check viewer decision tree permissions', () => {
  test('should not be able to create, update or delete an decision tree', async ({
    viewerContext,
  }) => {
    await expect(
      await viewerContext.getByTestId('create-decision-tree')
    ).not.toBeVisible()
    await expect(
      await viewerContext.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should not be able to create, update or delete an diagnosis', async ({
    viewerContext,
  }) => {
    await viewerContext.page
      .getByTestId('datatable-open-diagnosis')
      .first()
      .click()
    await expect(
      await viewerContext.page
        .getByTestId('diagnoses-row')
        .getByRole('cell', { name: 'Diarrhea' })
    ).toBeVisible()
    await expect(
      viewerContext.page.getByRole('button', { name: 'Add diagnosis' })
    ).not.toBeVisible()
    await viewerContext.getByTestId('datatable-menu').first().click()
    await expect(
      await viewerContext.page.getByRole('menuitem', { name: 'Edit' })
    ).not.toBeVisible()
    await expect(
      await viewerContext.page.getByRole('menuitem', { name: 'Delete' })
    ).not.toBeVisible()
    await viewerContext.page.getByRole('menuitem', { name: 'Info' }).click()
    await expect(
      await viewerContext.page.getByRole('heading', {
        name: 'Cold',
      })
    ).toBeVisible()
  })

  test('should be able to search', async ({ viewerContext }) => {
    await viewerContext.searchFor('col', 'Cold')
    await viewerContext.searchFor('toto', 'No data available')
  })
})
