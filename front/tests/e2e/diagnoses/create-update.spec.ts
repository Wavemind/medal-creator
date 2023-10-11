/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminContext }) => {
  await adminContext.page.goto('/projects/1/algorithms/1')
})

test.describe('Create or update diagnosis', () => {
  test('should create a diagnosis', async ({ adminContext }) => {
    await adminContext.page
      .getByRole('button', { name: 'Show diagnoses' })
      .nth(1)
      .click()
    await adminContext.page
      .getByRole('button', { name: 'Add diagnosis' })
      .click()
    await adminContext.fillInput('label', 'another diagnosis')
    await adminContext.submitForm()
    await expect(
      await adminContext.page.getByText('Saved successfully')
    ).toBeVisible()
  })

  test('should update a diagnosis', async ({ adminContext }) => {
    await adminContext.page
      .getByRole('button', { name: 'Show diagnoses' })
      .nth(1)
      .click()
    await adminContext
      .getByTestId('diagnose-row')
      .last()
      .getByRole('button')
      .click()
    await adminContext.page.getByRole('menuitem', { name: 'Edit' }).click()
    await adminContext.page.getByLabel('Label *').click()
    await adminContext.fillInput('label', 'first diagnosis updated')
    await adminContext.submitForm()
    await expect(
      await adminContext.page.getByText('Saved successfully')
    ).toBeVisible()
  })
})
