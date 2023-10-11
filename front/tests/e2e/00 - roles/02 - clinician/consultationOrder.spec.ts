/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ clinicianContext }) => {
  await clinicianContext.page.goto('/')
  await clinicianContext.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await clinicianContext.page.getByTestId('sidebar-algorithms').click()
  await clinicianContext.page.getByTestId('datatable-show').first().click()
  await clinicianContext.page.getByTestId('subMenu-order').click()
  await expect(
    await clinicianContext.page.getByRole('heading', {
      name: 'Consultation order',
    })
  ).toBeVisible()
})

test.beforeEach(async ({ clinicianContext }) => {
  // Checks whether all of the steps are visible, as well as the sub steps and additional information
  await expect(
    await clinicianContext.page.getByText('RegistrationStep')
  ).toBeVisible()
  await expect(
    await clinicianContext.page.getByText('First Look AssessmentStep')
  ).toBeVisible()
  await expect(
    await clinicianContext.page.getByText('RegistrationStep')
  ).toBeVisible()
  await expect(
    await clinicianContext.page.getByText('Complaint CategoriesStep')
  ).toBeVisible()
  await expect(
    await clinicianContext.page.getByText('Basic MeasurementsStep')
  ).toBeVisible()
  await expect(
    await clinicianContext.page.getByText('Medical HistoryStep')
  ).toBeVisible()
  await expect(
    await clinicianContext.page.getByText('Physical ExamsStep')
  ).toBeVisible()
  await expect(await clinicianContext.page.getByText('TestsStep')).toBeVisible()
  await expect(
    await clinicianContext.page.getByText('Health Care QuestionsStep')
  ).toBeVisible()
  await expect(
    await clinicianContext.page.getByText('ReferralStep')
  ).toBeVisible()

  await clinicianContext.page
    .locator('li')
    .filter({ hasText: 'RegistrationStep' })
    .getByRole('img')
    .click()

  await expect(
    await clinicianContext.page.getByText('First name')
  ).toBeVisible()
  await expect(await clinicianContext.page.getByText('Last name')).toBeVisible()
  await expect(
    await clinicianContext.page.getByText('Birth date')
  ).toBeVisible()
})

test.describe('Check clinician consultation order permissions', () => {
  test('should not be able to move node', async ({ clinicianContext }) => {
    // TODO
  })
})
