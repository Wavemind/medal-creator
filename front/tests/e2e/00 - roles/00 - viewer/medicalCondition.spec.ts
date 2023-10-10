/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ viewerPage }) => {
  await viewerPage.page.goto('/')
  await viewerPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await viewerPage.page.getByTestId('sidebar-library').click()
  await viewerPage.page.getByTestId('subMenu-medicalConditions').click()
})

test.describe('Check viewer medical condition permissions', () => {
  test('should not be able to create, edit, duplicate or delete a medical condition', async ({
    viewerPage,
  }) => {
    await expect(
      await viewerPage.page.getByRole('heading', { name: 'Medical conditions' })
    ).toBeVisible()
    await expect(
      await viewerPage.getByTestId('create-medical-condition')
    ).not.toBeVisible()
    await expect(
      await viewerPage.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ viewerPage }) => {
    await viewerPage.searchFor('Resp', 'Respiratory Distress')
    await viewerPage.searchFor('toto', 'No data available')
  })
})
