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
  await expect(
    await deploymentManagerPage.page.getByRole('heading', {
      name: 'Algorithms',
    })
  ).toBeVisible()
})

// TODO : Add the duplicate test once it's implemented
test.describe('Check deploymentManager algorithm permissions', () => {
  test('should not be able to create, update, archive or duplicate an algorithm', async ({
    deploymentManagerPage,
  }) => {
    await expect(
      await deploymentManagerPage.getByTestId('create-algorithm')
    ).not.toBeVisible()
    await deploymentManagerPage.page
      .getByRole('link', { name: 'Project for Tanzania' })
      .click()
    await deploymentManagerPage.page
      .getByRole('link', { name: 'Algorithms', exact: true })
      .click()
    await expect(
      await deploymentManagerPage.getByTestId('datatable-menu').first()
    ).not.toBeVisible()
    await deploymentManagerPage.page
      .getByTestId('datatable-show')
      .first()
      .click()
    await expect(
      await deploymentManagerPage.page.getByRole('heading', {
        name: 'Decision trees & Diagnoses',
      })
    ).toBeVisible()
    await expect(
      deploymentManagerPage.page.getByRole('button', {
        name: 'Algorithm settings',
      })
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ deploymentManagerPage }) => {
    await deploymentManagerPage.searchFor('first algo', 'First algo')
    await deploymentManagerPage.searchFor('toto', 'No data available')
  })
})
