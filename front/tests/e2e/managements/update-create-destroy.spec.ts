/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/')
  await adminPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await adminPage.page
    .getByRole('link', { name: 'Library', exact: true })
    .click()
  await adminPage.page.getByRole('link', { name: 'Managements' }).click()
})

test('should create a management', async ({ adminPage }) => {
  await adminPage.getByDataCy('create-management').click()
  await adminPage.fillInput('label', 'New management')
  await adminPage.submitForm()

  await expect(
    await adminPage.page.getByText('Created successfully')
  ).toBeVisible()
})

test('should update a management', async ({ adminPage }) => {
  await adminPage.getByDataCy('datatable-menu').first().click()
  await adminPage.page.getByRole('menuitem', { name: 'Edit' }).click()
  await adminPage.fillInput('label', 'updated management label')
  await adminPage.submitForm()

  await expect(
    await adminPage.page.getByText('Updated successfully')
  ).toBeVisible()
})

test('should destroy a management', async ({ adminPage }) => {
  await adminPage.getByDataCy('datatable-menu').first().click()
  await adminPage.page.getByRole('menuitem', { name: 'Delete' }).click()
  await adminPage.page.getByRole('button', { name: 'Yes' }).click()
  await expect(
    await adminPage.page.getByText('Deleted successfully')
  ).toBeVisible()
})
