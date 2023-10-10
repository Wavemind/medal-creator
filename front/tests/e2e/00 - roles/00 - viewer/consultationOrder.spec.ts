/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ viewerPage }) => {
  await viewerPage.page.goto('/')
  await viewerPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await viewerPage.page.getByTestId('sidebar-algorithms').click()
  await viewerPage.page.getByTestId('datatable-show').first().click()
  await viewerPage.page.getByTestId('subMenu-order').click()
  await expect(
    await viewerPage.page.getByRole('heading', {
      name: 'Consultation order',
    })
  ).toBeVisible()
})

test.beforeEach(async ({ viewerPage }) => {
  // Checks whether all of the steps are visible, as well as the sub steps and additional information
  await expect(
    await viewerPage.page.getByText('RegistrationStep')
  ).toBeVisible()
  await expect(
    await viewerPage.page.getByText('First Look AssessmentStep')
  ).toBeVisible()
  await expect(
    await viewerPage.page.getByText('RegistrationStep')
  ).toBeVisible()
  await expect(
    await viewerPage.page.getByText('Complaint CategoriesStep')
  ).toBeVisible()
  await expect(
    await viewerPage.page.getByText('Basic MeasurementsStep')
  ).toBeVisible()
  await expect(
    await viewerPage.page.getByText('Medical HistoryStep')
  ).toBeVisible()
  await expect(
    await viewerPage.page.getByText('Physical ExamsStep')
  ).toBeVisible()
  await expect(await viewerPage.page.getByText('TestsStep')).toBeVisible()
  await expect(
    await viewerPage.page.getByText('Health Care QuestionsStep')
  ).toBeVisible()
  await expect(await viewerPage.page.getByText('ReferralStep')).toBeVisible()

  await viewerPage.page
    .locator('li')
    .filter({ hasText: 'RegistrationStep' })
    .getByRole('img')
    .click()

  await expect(await viewerPage.page.getByText('First name')).toBeVisible()
  await expect(await viewerPage.page.getByText('Last name')).toBeVisible()
  await expect(await viewerPage.page.getByText('Birth date')).toBeVisible()
})

test.describe('Check viewer consultation order permissions', () => {
  test('should not be able to move node', async ({ viewerPage }) => {
    // TODO
  })
})
