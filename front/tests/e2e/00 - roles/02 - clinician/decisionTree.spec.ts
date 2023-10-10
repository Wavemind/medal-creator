/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ clinicianPage }) => {
  await clinicianPage.page.goto('/')
  await clinicianPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await clinicianPage.page.getByTestId('sidebar-algorithms').click()
  await clinicianPage.page.getByTestId('datatable-show').first().click()
  await expect(
    await clinicianPage.page.getByRole('heading', {
      name: 'Decision trees & Diagnoses',
    })
  ).toBeVisible()
})

test.describe('Check clinician decision tree permissions', () => {
  test('should not be able to create, update or delete an decision tree', async ({
    clinicianPage,
  }) => {
    await expect(
      await clinicianPage.getByTestId('create-decision-tree')
    ).not.toBeVisible()
    await expect(
      await clinicianPage.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should not be able to create, update or delete an diagnosis', async ({
    clinicianPage,
  }) => {
    await clinicianPage.page
      .getByTestId('datatable-open-diagnosis')
      .first()
      .click()
    await expect(
      await clinicianPage.page
        .getByTestId('diagnoses-row')
        .getByRole('cell', { name: 'Diarrhea' })
    ).toBeVisible()
    await expect(
      clinicianPage.page.getByRole('button', { name: 'Add diagnosis' })
    ).not.toBeVisible()
    await clinicianPage.getByTestId('datatable-menu').first().click()
    await expect(
      await clinicianPage.page.getByRole('menuitem', { name: 'Edit' })
    ).not.toBeVisible()
    await expect(
      await clinicianPage.page.getByRole('menuitem', { name: 'Delete' })
    ).not.toBeVisible()
    await clinicianPage.page.getByRole('menuitem', { name: 'Info' }).click()
    await expect(
      await clinicianPage.page.getByRole('heading', {
        name: 'Cold',
      })
    ).toBeVisible()
  })

  test('should be able to search', async ({ clinicianPage }) => {
    await clinicianPage.searchFor('col', 'Cold')
    await clinicianPage.searchFor('toto', 'No data available')
  })
})
