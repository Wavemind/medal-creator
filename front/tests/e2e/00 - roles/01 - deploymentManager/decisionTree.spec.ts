/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ deploymentManagerPage }) => {
  await deploymentManagerPage.page.goto('/')
  await deploymentManagerPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await deploymentManagerPage.page.getByTestId('sidebar-algorithms').click()
  await deploymentManagerPage.page.getByTestId('datatable-show').first().click()
  await expect(
    await deploymentManagerPage.page.getByRole('heading', {
      name: 'Decision trees & Diagnoses',
    })
  ).toBeVisible()
})

test.describe('Check deploymentManager decision tree permissions', () => {
  test('should not be able to create, update or delete an decision tree', async ({
    deploymentManagerPage,
  }) => {
    await expect(
      await deploymentManagerPage.getByTestId('create-decision-tree')
    ).not.toBeVisible()
    await expect(
      await deploymentManagerPage.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should not be able to create, update or delete an diagnosis', async ({
    deploymentManagerPage,
  }) => {
    await deploymentManagerPage.page
      .getByTestId('datatable-open-diagnosis')
      .first()
      .click()
    await expect(
      await deploymentManagerPage.page
        .getByTestId('diagnoses-row')
        .getByRole('cell', { name: 'Diarrhea' })
    ).toBeVisible()
    await expect(
      deploymentManagerPage.page.getByRole('button', { name: 'Add diagnosis' })
    ).not.toBeVisible()
    await deploymentManagerPage.getByTestId('datatable-menu').first().click()
    await expect(
      await deploymentManagerPage.page.getByRole('menuitem', { name: 'Edit' })
    ).not.toBeVisible()
    await expect(
      await deploymentManagerPage.page.getByRole('menuitem', { name: 'Delete' })
    ).not.toBeVisible()
    await deploymentManagerPage.page
      .getByRole('menuitem', { name: 'Info' })
      .click()
    await expect(
      await deploymentManagerPage.page.getByRole('heading', {
        name: 'Cold',
      })
    ).toBeVisible()
  })

  test('should be able to search', async ({ deploymentManagerPage }) => {
    await deploymentManagerPage.searchFor('col', 'Cold')
    await deploymentManagerPage.searchFor('toto', 'No data available')
  })
})
