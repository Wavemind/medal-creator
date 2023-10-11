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
  await clinicianContext.page.getByTestId('subMenu-managements').click()
  await expect(
    await clinicianContext.page.getByRole('heading', {
      name: 'Managements',
    })
  ).toBeVisible()
})

test.describe('Check clinician management permissions', () => {
  test('should not be able to create, edit, duplicate or delete a management', async ({
    clinicianContext,
  }) => {
    await expect(
      await clinicianContext.getByTestId('new-management')
    ).not.toBeVisible()
    await expect(
      await clinicianContext.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should not be able to create, edit or delete a management exclusion', async ({
    clinicianContext,
  }) => {
    await clinicianContext.page
      .getByTestId('datatable-open-node')
      .first()
      .click()
    await expect(
      await clinicianContext.page
        .getByTestId('node-exclusion-row')
        .getByRole('cell', { name: 'advise' })
    ).toBeVisible()
    await expect(
      clinicianContext.page.getByRole('button', { name: 'Add exclusion' })
    ).not.toBeVisible()
    await expect(
      clinicianContext.page.getByRole('button', { name: 'Delete' })
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ clinicianContext }) => {
    await clinicianContext.searchFor('refer', 'M2 refer')
    await clinicianContext.searchFor('toto', 'No data available')
  })
})
