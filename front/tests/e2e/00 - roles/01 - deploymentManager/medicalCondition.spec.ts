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
  await deploymentManagerContext.page
    .getByTestId('subMenu-medicalConditions')
    .click()
})

test.describe('Check deploymentManager medical condition permissions', () => {
  test('should not be able to create, edit, duplicate or delete a medical condition', async ({
    deploymentManagerContext,
  }) => {
    await expect(
      await deploymentManagerContext.page.getByRole('heading', {
        name: 'Medical conditions',
      })
    ).toBeVisible()
    await expect(
      await deploymentManagerContext.getByTestId('create-medical-condition')
    ).not.toBeVisible()
    await expect(
      await deploymentManagerContext.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ deploymentManagerContext }) => {
    await deploymentManagerContext.searchFor('Resp', 'Respiratory Distress')
    await deploymentManagerContext.searchFor('toto', 'No data available')
  })
})
