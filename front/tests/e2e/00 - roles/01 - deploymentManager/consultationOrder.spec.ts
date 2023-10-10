/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ deploymentManagerPage }) => {
  await deploymentManagerPage.page.goto('/')
  await deploymentManagerPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await deploymentManagerPage.page.getByTestId('sidebar-algorithms').click()
  await deploymentManagerPage.page.getByTestId('datatable-show').first().click()
  await deploymentManagerPage.page.getByTestId('subMenu-order').click()
  await expect(
    await deploymentManagerPage.page.getByRole('heading', {
      name: 'Consultation order',
    })
  ).toBeVisible()
})

test.beforeEach(async ({ deploymentManagerPage }) => {
  // Checks whether all of the steps are visible, as well as the sub steps and additional information
  await expect(
    await deploymentManagerPage.page.getByText('RegistrationStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerPage.page.getByText('First Look AssessmentStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerPage.page.getByText('RegistrationStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerPage.page.getByText('Complaint CategoriesStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerPage.page.getByText('Basic MeasurementsStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerPage.page.getByText('Medical HistoryStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerPage.page.getByText('Physical ExamsStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerPage.page.getByText('TestsStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerPage.page.getByText('Health Care QuestionsStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerPage.page.getByText('ReferralStep')
  ).toBeVisible()

  await deploymentManagerPage.page
    .locator('li')
    .filter({ hasText: 'RegistrationStep' })
    .getByRole('img')
    .click()

  await expect(
    await deploymentManagerPage.page.getByText('First name')
  ).toBeVisible()
  await expect(
    await deploymentManagerPage.page.getByText('Last name')
  ).toBeVisible()
  await expect(
    await deploymentManagerPage.page.getByText('Birth date')
  ).toBeVisible()
})

test.describe('Check deploymentManager consultation order permissions', () => {
  test('should not be able to move node', async ({ deploymentManagerPage }) => {
    // TODO
  })
})
