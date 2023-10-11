/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ viewerContext }) => {
  await viewerContext.page.goto('/')
  await viewerContext.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await viewerContext.page.getByTestId('sidebar-algorithms').click()
  await viewerContext.page.getByTestId('datatable-show').first().click()
  await viewerContext.page.getByTestId('subMenu-order').click()
  await expect(
    await viewerContext.page.getByRole('heading', {
      name: 'Consultation order',
    })
  ).toBeVisible()
})

test.beforeEach(async ({ viewerContext }) => {
  // Checks whether all of the steps are visible, as well as the sub steps and additional information
  await expect(
    await viewerContext.page.getByText('RegistrationStep')
  ).toBeVisible()
  await expect(
    await viewerContext.page.getByText('First Look AssessmentStep')
  ).toBeVisible()
  await expect(
    await viewerContext.page.getByText('RegistrationStep')
  ).toBeVisible()
  await expect(
    await viewerContext.page.getByText('Complaint CategoriesStep')
  ).toBeVisible()
  await expect(
    await viewerContext.page.getByText('Basic MeasurementsStep')
  ).toBeVisible()
  await expect(
    await viewerContext.page.getByText('Medical HistoryStep')
  ).toBeVisible()
  await expect(
    await viewerContext.page.getByText('Physical ExamsStep')
  ).toBeVisible()
  await expect(await viewerContext.page.getByText('TestsStep')).toBeVisible()
  await expect(
    await viewerContext.page.getByText('Health Care QuestionsStep')
  ).toBeVisible()
  await expect(await viewerContext.page.getByText('ReferralStep')).toBeVisible()

  await viewerContext.page
    .locator('li')
    .filter({ hasText: 'RegistrationStep' })
    .getByRole('img')
    .click()

  await expect(await viewerContext.page.getByText('First name')).toBeVisible()
  await expect(await viewerContext.page.getByText('Last name')).toBeVisible()
  await expect(await viewerContext.page.getByText('Birth date')).toBeVisible()
})

test.describe('Check viewer consultation order permissions', () => {
  test('should not be able to move node', async ({ viewerContext }) => {
    // TODO
  })
})
