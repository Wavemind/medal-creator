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
      await adminPage.page.getByText('Saved successfully')
    ).toBeVisible()
  })

  test('should update a diagnosis', async ({ adminPage }) => {
    await adminPage.page
      .getByRole('button', { name: 'Show diagnoses' })
      .nth(1)
      .click()
    await adminPage
      .getByTestId('diagnose-row')
      .last()
      .getByRole('button')
      .click()
    await adminPage.page.getByRole('menuitem', { name: 'Edit' }).click()
    await adminPage.page.getByLabel('Label *').click()
    await adminPage.fillInput('label', 'first diagnosis updated')
    await adminPage.submitForm()
    await expect(
      await adminPage.page.getByText('Saved successfully')
    ).toBeVisible()
  })
})
