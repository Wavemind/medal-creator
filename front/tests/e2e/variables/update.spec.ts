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
})

test('should see category and answer type disabled and update label', async ({
  adminPage,
}) => {
  await adminPage.getByDataCy('variable-edit-button').last().click()
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
