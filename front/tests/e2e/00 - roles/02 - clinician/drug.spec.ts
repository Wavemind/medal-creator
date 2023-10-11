/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ clinicianContext }) => {
  await clinicianContext.page.goto('/')
  await clinicianContext.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await clinicianContext.page.getByTestId('sidebar-library').click()
  await clinicianContext.page.getByTestId('subMenu-drugs').click()
  await expect(
    await clinicianContext.page.getByRole('heading', { name: 'Drugs' })
  ).toBeVisible()
})

test.describe('Check clinician drug permissions', () => {
  test('should not be able to create, edit or delete a drug', async ({
    clinicianContext,
  }) => {
    await expect(
      await clinicianContext.getByTestId('create-drug')
    ).not.toBeVisible()
    await expect(
      await clinicianContext.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should not be able to create, edit or delete a drug exclusion', async ({
    clinicianContext,
  }) => {
    await clinicianContext.page
      .getByTestId('datatable-open-node')
      .first()
      .click()
    await expect(
      await clinicianContext.page
        .getByTestId('node-exclusion-row')
        .getByRole('cell', { name: 'Panadol' })
    ).toBeVisible()
    await expect(
      clinicianContext.page.getByRole('button', { name: 'Add exclusion' })
    ).not.toBeVisible()
    await expect(
      clinicianContext.page.getByRole('button', { name: 'Delete' })
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ clinicianContext }) => {
    await clinicianContext.searchFor('Amo', 'Amox')
    await clinicianContext.searchFor('toto', 'No data available')
  })
})
