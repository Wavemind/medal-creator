/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ deploymentManagerPage }) => {
  await deploymentManagerPage.page.goto('/')
  await deploymentManagerPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await deploymentManagerPage.page.getByTestId('sidebar-library').click()
  await deploymentManagerPage.page.getByTestId('subMenu-drugs').click()
  await expect(
    await deploymentManagerPage.page.getByRole('heading', { name: 'Drugs' })
  ).toBeVisible()
})

test.describe('Check deploymentManager drug permissions', () => {
  test('should not be able to create, edit or delete a drug', async ({
    deploymentManagerPage,
  }) => {
    await expect(
      await deploymentManagerPage.getByTestId('create-drug')
    ).not.toBeVisible()
    await expect(
      await deploymentManagerPage.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should not be able to create, edit or delete a drug exclusion', async ({
    deploymentManagerPage,
  }) => {
    await deploymentManagerPage.page
      .getByTestId('datatable-open-node')
      .first()
      .click()
    await expect(
      await deploymentManagerPage.page
        .getByTestId('node-exclusion-row')
        .getByRole('cell', { name: 'Panadol' })
    ).toBeVisible()
    await expect(
      deploymentManagerPage.page.getByRole('button', { name: 'Add exclusion' })
    ).not.toBeVisible()
    await expect(
      deploymentManagerPage.page.getByRole('button', { name: 'Delete' })
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ deploymentManagerPage }) => {
    await deploymentManagerPage.searchFor('Amo', 'Amox')
    await deploymentManagerPage.searchFor('toto', 'No data available')
  })
})
