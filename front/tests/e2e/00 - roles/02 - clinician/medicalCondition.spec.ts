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
  await clinicianPage.page.getByTestId('subMenu-medicalConditions').click()
})

test.describe('Check clinician medical condition permissions', () => {
  test('should not be able to create, edit, duplicate or delete a medical condition', async ({
    clinicianPage,
  }) => {
    await expect(
      await clinicianPage.page.getByRole('heading', {
        name: 'Medical conditions',
      })
    ).toBeVisible()
    await expect(
      await clinicianPage.getByTestId('create-medical-condition')
    ).not.toBeVisible()
    await expect(
      await clinicianPage.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ clinicianPage }) => {
    await clinicianPage.searchFor('Resp', 'Respiratory Distress')
    await clinicianPage.searchFor('toto', 'No data available')
  })
})
