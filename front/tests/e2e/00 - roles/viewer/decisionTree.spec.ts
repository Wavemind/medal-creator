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
  await viewerPage.page.getByTestId('datatable-show').first().click()
  await expect(
    await viewerPage.page.getByRole('heading', {
      name: 'Decision trees & Diagnoses',
    })
  ).toBeVisible()
})

test.describe('Check viewer decision tree permissions', () => {
  test('should not be able to create, update or delete an decision tree', async ({
    viewerPage,
  }) => {
    await expect(
      await viewerPage.getByTestId('create-decision-tree')
    ).not.toBeVisible()
    await expect(
      await viewerPage.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should not be able to create, update or delete an diagnosis', async ({
    viewerPage,
  }) => {
    await viewerPage.page
      .getByTestId('datatable-open-diagnosis')
      .first()
      .click()
    await expect(
      await viewerPage.page
        .getByTestId('diagnoses-row')
        .getByRole('cell', { name: 'Diarrhea' })
    ).toBeVisible()
    await expect(
      viewerPage.page.getByRole('button', { name: 'Add diagnosis' })
    ).not.toBeVisible()
    await viewerPage.getByTestId('datatable-menu').first().click()
    await expect(
      await viewerPage.page.getByRole('menuitem', { name: 'Edit' })
    ).not.toBeVisible()
    await expect(
      await viewerPage.page.getByRole('menuitem', { name: 'Delete' })
    ).not.toBeVisible()
    await viewerPage.page.getByRole('menuitem', { name: 'Info' }).click()
    await expect(
      await viewerPage.page.getByRole('heading', {
        name: 'Cold',
      })
    ).toBeVisible()
  })

  test('should be able to search', async ({ viewerPage }) => {
    await viewerPage.searchFor('col', 'Cold')
    // TODO : Search in sub row ?
    await viewerPage.searchFor('toto', 'No data available')
  })
})
