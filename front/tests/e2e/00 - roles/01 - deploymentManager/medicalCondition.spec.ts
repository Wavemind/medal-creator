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
  await deploymentManagerPage.page
    .getByTestId('subMenu-medicalConditions')
    .click()
})

test.describe('Check deploymentManager medical condition permissions', () => {
  test('should not be able to create, edit, duplicate or delete a medical condition', async ({
    deploymentManagerPage,
  }) => {
    await expect(
      await deploymentManagerPage.page.getByRole('heading', {
        name: 'Medical conditions',
      })
    ).toBeVisible()
    await expect(
      await deploymentManagerPage.getByTestId('create-medical-condition')
    ).not.toBeVisible()
    await expect(
      await deploymentManagerPage.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ deploymentManagerPage }) => {
    await deploymentManagerPage.searchFor('Resp', 'Respiratory Distress')
    await deploymentManagerPage.searchFor('toto', 'No data available')
  })
})
