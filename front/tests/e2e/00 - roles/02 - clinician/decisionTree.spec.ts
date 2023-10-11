/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ clinicianContext }) => {
  await clinicianContext.page.goto('/')
  await clinicianContext.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await clinicianContext.page.getByTestId('sidebar-algorithms').click()
  await clinicianContext.page.getByTestId('datatable-show').first().click()
  await expect(
    await clinicianContext.page.getByRole('heading', {
      name: 'Decision trees & Diagnoses',
    })
  ).toBeVisible()
})

test.describe('Check clinician decision tree permissions', () => {
  test('should not be able to create, update or delete an decision tree', async ({
    clinicianContext,
  }) => {
    await expect(
      await clinicianContext.getByTestId('create-decision-tree')
    ).not.toBeVisible()
    await expect(
      await clinicianContext.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should not be able to create, update or delete an diagnosis', async ({
    clinicianContext,
  }) => {
    await clinicianContext.page
      .getByTestId('datatable-open-diagnosis')
      .first()
      .click()
    await expect(
      await clinicianContext.page
        .getByTestId('diagnoses-row')
        .getByRole('cell', { name: 'Diarrhea' })
    ).toBeVisible()
    await expect(
      clinicianContext.page.getByRole('button', { name: 'Add diagnosis' })
    ).not.toBeVisible()
    await clinicianContext.getByTestId('datatable-menu').first().click()
    await expect(
      await clinicianContext.page.getByRole('menuitem', { name: 'Edit' })
    ).not.toBeVisible()
    await expect(
      await clinicianContext.page.getByRole('menuitem', { name: 'Delete' })
    ).not.toBeVisible()
    await clinicianContext.page.getByRole('menuitem', { name: 'Info' }).click()
    await expect(
      await clinicianContext.page.getByRole('heading', {
        name: 'Cold',
      })
    ).toBeVisible()
  })

  test('should be able to search', async ({ clinicianContext }) => {
    await clinicianContext.searchFor('col', 'Cold')
    await clinicianContext.searchFor('toto', 'No data available')
  })
})
