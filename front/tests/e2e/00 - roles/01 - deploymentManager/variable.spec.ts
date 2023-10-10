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
})

test.describe('Check deploymentManager variable permissions', () => {
  test('should not be able to create, edit, duplicate or delete a variable, but should view details', async ({
    deploymentManagerPage,
  }) => {
    await expect(
      await deploymentManagerPage.page.getByRole('heading', {
        name: 'Variables',
      })
    ).toBeVisible()
    await expect(
      await deploymentManagerPage.getByTestId('create-variable')
    ).not.toBeVisible()
    await deploymentManagerPage.getByTestId('datatable-menu').first().click()
    await expect(
      await deploymentManagerPage.page.getByRole('menuitem', { name: 'Edit' })
    ).not.toBeVisible()
    await expect(
      await deploymentManagerPage.page.getByRole('menuitem', {
        name: 'Duplicate',
      })
    ).not.toBeVisible()
    await expect(
      await deploymentManagerPage.page.getByRole('menuitem', { name: 'Delete' })
    ).not.toBeVisible()
    await deploymentManagerPage.page
      .getByRole('menuitem', { name: 'Info' })
      .click()
    await expect(
      await deploymentManagerPage.page.getByText('Fever')
    ).toBeVisible()
    await deploymentManagerPage.getByTestId('close-modal').click()
  })

  test('should be able to search', async ({ deploymentManagerPage }) => {
    await deploymentManagerPage.searchFor('Cough', 'Cough')
    await deploymentManagerPage.searchFor('toto', 'No data available')
  })
})
