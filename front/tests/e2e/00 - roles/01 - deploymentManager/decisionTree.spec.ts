/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ deploymentManagerContext }) => {
  await deploymentManagerContext.page.goto('/')
  await deploymentManagerContext.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await deploymentManagerContext.page.getByTestId('sidebar-algorithms').click()
  await deploymentManagerContext.page
    .getByTestId('datatable-show')
    .first()
    .click()
  await expect(
    await deploymentManagerContext.page.getByRole('heading', {
      name: 'Decision trees & Diagnoses',
    })
  ).toBeVisible()
})

test.describe('Check deploymentManager decision tree permissions', () => {
  test('should not be able to create, update or delete an decision tree', async ({
    deploymentManagerContext,
  }) => {
    await expect(
      await deploymentManagerContext.getByTestId('create-decision-tree')
    ).not.toBeVisible()
    await expect(
      await deploymentManagerContext.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should not be able to create, update or delete an diagnosis', async ({
    deploymentManagerContext,
  }) => {
    await deploymentManagerContext.page
      .getByTestId('datatable-open-diagnosis')
      .first()
      .click()
    await expect(
      await deploymentManagerContext.page
        .getByTestId('diagnoses-row')
        .getByRole('cell', { name: 'Diarrhea' })
    ).toBeVisible()
    await expect(
      deploymentManagerContext.page.getByRole('button', {
        name: 'Add diagnosis',
      })
    ).not.toBeVisible()
    await deploymentManagerContext.getByTestId('datatable-menu').first().click()
    await expect(
      await deploymentManagerContext.page.getByRole('menuitem', {
        name: 'Edit',
      })
    ).not.toBeVisible()
    await expect(
      await deploymentManagerContext.page.getByRole('menuitem', {
        name: 'Delete',
      })
    ).not.toBeVisible()
    await deploymentManagerContext.page
      .getByRole('menuitem', { name: 'Info' })
      .click()
    await expect(
      await deploymentManagerContext.page.getByRole('heading', {
        name: 'Cold',
      })
    ).toBeVisible()
  })

  test('should be able to search', async ({ deploymentManagerContext }) => {
    await deploymentManagerContext.searchFor('col', 'Cold')
    await deploymentManagerContext.searchFor('toto', 'No data available')
  })
})
