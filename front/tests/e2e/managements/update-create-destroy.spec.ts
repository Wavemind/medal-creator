/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminContext }) => {
  await adminContext.page.goto('/')
  await adminContext.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await adminContext.page
    .getByRole('link', { name: 'Library', exact: true })
    .click()
  await adminContext.page.getByRole('link', { name: 'Managements' }).click()
})

test('should create a management', async ({ adminContext }) => {
  await adminContext.getByTestId('create-management').click()
  await adminContext.fillInput('label', 'New management')
  await adminContext.submitForm()

  await expect(
    await adminContext.page.getByText('Saved successfully')
  ).toBeVisible()
})

test('should update a management', async ({ adminContext }) => {
  await adminContext.getByTestId('datatable-menu').first().click()
  await adminContext.page.getByRole('menuitem', { name: 'Edit' }).click()
  await adminContext.fillInput('label', 'updated management label')
  await adminContext.submitForm()

  await expect(
    await adminContext.page.getByText('Saved successfully')
  ).toBeVisible()
})

test('should destroy a management', async ({ adminContext }) => {
  await adminContext.getByTestId('datatable-menu').first().click()
  await adminContext.page.getByRole('menuitem', { name: 'Delete' }).click()
  await adminContext.page.getByRole('button', { name: 'Yes' }).click()
  await expect(
    await adminContext.page.getByText('Deleted successfully')
  ).toBeVisible()
})
