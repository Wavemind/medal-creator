/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ deploymentManagerContext }) => {
  await deploymentManagerContext.page.goto('/')
  await deploymentManagerContext.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await deploymentManagerContext.page.getByTestId('sidebar-library').click()
  await deploymentManagerContext.page.getByTestId('subMenu-drugs').click()
  await expect(
    await deploymentManagerContext.page.getByRole('heading', { name: 'Drugs' })
  ).toBeVisible()
})

test.describe('Check deploymentManager drug permissions', () => {
  test('should not be able to create, edit or delete a drug', async ({
    deploymentManagerContext,
  }) => {
    await expect(
      await deploymentManagerContext.getByTestId('create-drug')
    ).not.toBeVisible()
    await expect(
      await deploymentManagerContext.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should not be able to create, edit or delete a drug exclusion', async ({
    deploymentManagerContext,
  }) => {
    await deploymentManagerContext.page
      .getByTestId('datatable-open-node')
      .first()
      .click()
    await expect(
      await deploymentManagerContext.page
        .getByTestId('node-exclusion-row')
        .getByRole('cell', { name: 'Panadol' })
    ).toBeVisible()
    await expect(
      deploymentManagerContext.page.getByRole('button', {
        name: 'Add exclusion',
      })
    ).not.toBeVisible()
    await expect(
      deploymentManagerContext.page.getByRole('button', { name: 'Delete' })
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ deploymentManagerContext }) => {
    await deploymentManagerContext.searchFor('Amo', 'Amox')
    await deploymentManagerContext.searchFor('toto', 'No data available')
  })
})
