/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/projects/1/library')
})

test('should see category and answer type disabled and update label', async ({
  adminPage,
}) => {
  await adminPage.getByTestId('variable-edit-button').last().click()
  await expect(await adminPage.getSelect('type')).toHaveAttribute(
    'disabled',
    ''
  )
  await expect(await adminPage.getSelect('answerTypeId')).toHaveAttribute(
    'disabled',
    ''
  )
  await adminPage.fillInput('label', 'updated label')
  await adminPage.nextStep()
  await adminPage.submitForm()

  await expect(
    await adminPage.page.getByRole('cell', { name: 'updated label' })
  ).toBeVisible()
})
