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
  await clinicianContext.page.getByTestId('subMenu-medicalConditions').click()
})

test.describe('Check clinician medical condition permissions', () => {
  test('should not be able to create, edit, duplicate or delete a medical condition', async ({
    clinicianContext,
  }) => {
    await expect(
      await clinicianContext.page.getByRole('heading', {
        name: 'Medical conditions',
      })
    ).toBeVisible()
    await expect(
      await clinicianContext.getByTestId('create-medical-condition')
    ).not.toBeVisible()
    await expect(
      await clinicianContext.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ clinicianContext }) => {
    await clinicianContext.searchFor('Resp', 'Respiratory Distress')
    await clinicianContext.searchFor('toto', 'No data available')
  })
})
