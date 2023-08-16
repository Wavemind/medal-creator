/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/projects/1/algorithms/1/consultation-order')
})

test('should create a diagnosis', async ({ adminPage }) => {
  await expect(await adminPage.page.getByText('RegistrationStep')).toBeVisible()
  await expect(
    await adminPage.page.getByText('First Look AssessmentStep')
  ).toBeVisible()
  await expect(await adminPage.page.getByText('RegistrationStep')).toBeVisible()
  await expect(
    await adminPage.page.getByText('Complaint CategoriesStep')
  ).toBeVisible()
  await expect(
    await adminPage.page.getByText('Basic MeasurementsStep')
  ).toBeVisible()
  await expect(
    await adminPage.page.getByText('Medical HistoryStep')
  ).toBeVisible()
  await expect(
    await adminPage.page.getByText('Physical ExamsStep')
  ).toBeVisible()
  await expect(await adminPage.page.getByText('TestsStep')).toBeVisible()
  await expect(
    await adminPage.page.getByText('Health Care QuestionsStep')
  ).toBeVisible()
  await expect(await adminPage.page.getByText('ReferralStep')).toBeVisible()

  await adminPage.page
    .locator('li')
    .filter({ hasText: 'RegistrationStep' })
    .getByRole('img')
    .click()

  await expect(await adminPage.page.getByText('First name')).toBeVisible()
  await expect(await adminPage.page.getByText('Last name')).toBeVisible()
  await expect(await adminPage.page.getByText('Birth date')).toBeVisible()

  // TODO DRAG AND DROP
})
