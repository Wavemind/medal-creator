/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ clinicianPage }) => {
  await clinicianPage.page.goto('/')
  await clinicianPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await clinicianPage.page.getByTestId('sidebar-library').click()
  await clinicianPage.page.getByTestId('subMenu-drugs').click()
  await expect(
    await clinicianPage.page.getByRole('heading', { name: 'Drugs' })
  ).toBeVisible()
})

test.describe('Check clinician drug permissions', () => {
  test('should not be able to create, edit or delete a drug', async ({
    clinicianPage,
  }) => {
    await expect(
      await clinicianPage.getByTestId('create-drug')
    ).not.toBeVisible()
    await expect(
      await clinicianPage.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should not be able to create, edit or delete a drug exclusion', async ({
    clinicianPage,
  }) => {
    await clinicianPage.page.getByTestId('datatable-open-node').first().click()
    await expect(
      await clinicianPage.page
        .getByTestId('node-exclusion-row')
        .getByRole('cell', { name: 'Panadol' })
    ).toBeVisible()
    await expect(
      clinicianPage.page.getByRole('button', { name: 'Add exclusion' })
    ).not.toBeVisible()
    await expect(
      clinicianPage.page.getByRole('button', { name: 'Delete' })
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ clinicianPage }) => {
    await clinicianPage.searchFor('Amo', 'Amox')
    await clinicianPage.searchFor('toto', 'No data available')
  })
})
