/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ viewerContext }) => {
  await viewerContext.page.goto('/')
  await viewerContext.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await viewerContext.page.getByTestId('sidebar-library').click()
  await viewerContext.page.getByTestId('subMenu-medicalConditions').click()
})

test.describe('Check viewer medical condition permissions', () => {
  test('should not be able to create, edit, duplicate or delete a medical condition', async ({
    viewerContext,
  }) => {
    await expect(
      await viewerContext.page.getByRole('heading', {
        name: 'Medical conditions',
      })
    ).toBeVisible()
    await expect(
      await viewerContext.getByTestId('create-medical-condition')
    ).not.toBeVisible()
    await expect(
      await viewerContext.getByTestId('datatable-menu')
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ viewerContext }) => {
    await viewerContext.searchFor('Resp', 'Respiratory Distress')
    await viewerContext.searchFor('toto', 'No data available')
  })
})
