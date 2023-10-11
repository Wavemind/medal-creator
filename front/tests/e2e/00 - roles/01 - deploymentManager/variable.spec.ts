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
})

test.describe('Check deploymentManager variable permissions', () => {
  test('should not be able to create, edit, duplicate or delete a variable, but should view details', async ({
    deploymentManagerContext,
  }) => {
    await expect(
      await deploymentManagerContext.page.getByRole('heading', {
        name: 'Variables',
      })
    ).toBeVisible()
    await expect(
      await deploymentManagerContext.getByTestId('create-variable')
    ).not.toBeVisible()
    await deploymentManagerContext.getByTestId('datatable-menu').first().click()
    await expect(
      await deploymentManagerContext.page.getByRole('menuitem', {
        name: 'Edit',
      })
    ).not.toBeVisible()
    await expect(
      await deploymentManagerContext.page.getByRole('menuitem', {
        name: 'Duplicate',
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
      await deploymentManagerContext.page.getByText('Fever')
    ).toBeVisible()
    await deploymentManagerContext.getByTestId('close-modal').click()
  })

  test('should be able to search', async ({ deploymentManagerContext }) => {
    await deploymentManagerContext.searchFor('Cough', 'Cough')
    await deploymentManagerContext.searchFor('toto', 'No data available')
  })
})
