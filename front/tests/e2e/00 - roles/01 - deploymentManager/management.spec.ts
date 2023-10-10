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
  await deploymentManagerPage.page.getByTestId('subMenu-managements').click()
  await expect(
    await deploymentManagerPage.page.getByRole('heading', {
      name: 'Managements',
    })
  ).toBeVisible()
})

test.describe('Check deploymentManager management permissions', () => {
  test('should not be able to create, edit, duplicate or delete a management', async ({
    deploymentManagerPage,
  }) => {
    await expect(
      await deploymentManagerPage.getByTestId('new-management')
    ).not.toBeVisible()
    await expect(
      await deploymentManagerPage.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should not be able to create, edit or delete a management exclusion', async ({
    deploymentManagerPage,
  }) => {
    await deploymentManagerPage.page
      .getByTestId('datatable-open-node')
      .first()
      .click()
    await expect(
      await deploymentManagerPage.page
        .getByTestId('node-exclusion-row')
        .getByRole('cell', { name: 'advise' })
    ).toBeVisible()
    await expect(
      deploymentManagerPage.page.getByRole('button', { name: 'Add exclusion' })
    ).not.toBeVisible()
    await expect(
      deploymentManagerPage.page.getByRole('button', { name: 'Delete' })
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ deploymentManagerPage }) => {
    await deploymentManagerPage.searchFor('refer', 'M2 refer')
    await deploymentManagerPage.searchFor('toto', 'No data available')
  })
})
