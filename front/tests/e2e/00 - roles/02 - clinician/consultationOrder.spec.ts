/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ clinicianPage }) => {
  await clinicianPage.page.goto('/')
  await clinicianPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await clinicianPage.page.getByTestId('sidebar-algorithms').click()
  await clinicianPage.page.getByTestId('datatable-show').first().click()
  await clinicianPage.page.getByTestId('subMenu-order').click()
  await expect(
    await clinicianPage.page.getByRole('heading', {
      name: 'Consultation order',
    })
  ).toBeVisible()
})

test.beforeEach(async ({ clinicianPage }) => {
  // Checks whether all of the steps are visible, as well as the sub steps and additional information
  await expect(
    await clinicianPage.page.getByText('RegistrationStep')
  ).toBeVisible()
  await expect(
    await clinicianPage.page.getByText('First Look AssessmentStep')
  ).toBeVisible()
  await expect(
    await clinicianPage.page.getByText('RegistrationStep')
  ).toBeVisible()
  await expect(
    await clinicianPage.page.getByText('Complaint CategoriesStep')
  ).toBeVisible()
  await expect(
    await clinicianPage.page.getByText('Basic MeasurementsStep')
  ).toBeVisible()
  await expect(
    await clinicianPage.page.getByText('Medical HistoryStep')
  ).toBeVisible()
  await expect(
    await clinicianPage.page.getByText('Physical ExamsStep')
  ).toBeVisible()
  await expect(await clinicianPage.page.getByText('TestsStep')).toBeVisible()
  await expect(
    await clinicianPage.page.getByText('Health Care QuestionsStep')
  ).toBeVisible()
  await expect(await clinicianPage.page.getByText('ReferralStep')).toBeVisible()

  await clinicianPage.page
    .locator('li')
    .filter({ hasText: 'RegistrationStep' })
    .getByRole('img')
    .click()

  await expect(await clinicianPage.page.getByText('First name')).toBeVisible()
  await expect(await clinicianPage.page.getByText('Last name')).toBeVisible()
  await expect(await clinicianPage.page.getByText('Birth date')).toBeVisible()
})

test.describe('Check clinician consultation order permissions', () => {
  test('should not be able to move node', async ({ clinicianPage }) => {
    // TODO
  })
})
