/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminContext }) => {
  await adminContext.page.goto('/projects/1/algorithms/1/consultation-order')
})

test('should create a diagnosis', async ({ adminContext }) => {
  await expect(
    await adminContext.page.getByText('RegistrationStep')
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText('First Look AssessmentStep')
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText('RegistrationStep')
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText('Complaint CategoriesStep')
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText('Basic MeasurementsStep')
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText('Medical HistoryStep')
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText('Physical ExamsStep')
  ).toBeVisible()
  await expect(await adminContext.page.getByText('TestsStep')).toBeVisible()
  await expect(
    await adminContext.page.getByText('Health Care QuestionsStep')
  ).toBeVisible()
  await expect(await adminContext.page.getByText('ReferralStep')).toBeVisible()

  await adminContext.page
    .locator('li')
    .filter({ hasText: 'RegistrationStep' })
    .getByRole('img')
    .click()

  await expect(await adminContext.page.getByText('First name')).toBeVisible()
  await expect(await adminContext.page.getByText('Last name')).toBeVisible()
  await expect(await adminContext.page.getByText('Birth date')).toBeVisible()

  // TODO DRAG AND DROP
})
