/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/projects/1/algorithms/1')
})

test.describe('Create or update diagnosis', () => {
  test('should create a diagnosis', async ({ adminPage }) => {
    await adminPage.page
      .getByRole('button', { name: 'Show diagnoses' })
      .nth(1)
      .click()
    await adminPage.page.getByRole('button', { name: 'Add diagnosis' }).click()
    await adminPage.fillInput('label', 'another diagnosis')
    await adminPage.submitForm()
    await expect(
      await adminPage.page.getByRole('cell', {
        name: 'another diagnosis',
        exact: true,
      })
    ).toBeVisible()
  })

  test('should update a diagnosis', async ({ adminPage }) => {
    await adminPage.page
      .getByRole('button', { name: 'Show diagnoses' })
      .nth(1)
      .click()
    await adminPage.page
      .getByRole('row', {
        name: 'another diagnosis 5 Open treatment',
        exact: true,
      })
      .getByRole('button')
      .click()
    await adminPage.page.getByRole('menuitem', { name: 'Edit' }).click()
    await adminPage.page.getByLabel('Label*').click()
    await adminPage.fillInput('label', 'first diagnosis updated')
    await adminPage.submitForm()
    await expect(
      await adminPage.page.getByRole('cell', {
        name: 'first diagnosis updated',
        exact: true,
      })
    ).toBeVisible()
  })
})
