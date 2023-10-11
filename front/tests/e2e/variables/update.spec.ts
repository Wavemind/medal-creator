/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminContext }) => {
  await adminContext.page.goto('/projects/1/library')
})

test('should see category and answer type disabled and update label', async ({
  adminContext,
}) => {
  await adminContext.getByTestId('variable-edit-button').last().click()
  await expect(await adminContext.getSelect('type')).toHaveAttribute(
    'disabled',
    ''
  )
  await expect(await adminContext.getSelect('answerTypeId')).toHaveAttribute(
    'disabled',
    ''
  )
  await adminContext.fillInput('label', 'updated label')
  await adminContext.nextStep()
  await adminContext.submitForm()

  await expect(
    await adminContext.page.getByRole('cell', { name: 'updated label' })
  ).toBeVisible()
})
