/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ deploymentManagerContext }) => {
  await deploymentManagerContext.page.goto('/')
  await deploymentManagerContext.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await deploymentManagerContext.page.getByTestId('sidebar-algorithms').click()
  await deploymentManagerContext.page
    .getByTestId('datatable-show')
    .first()
    .click()
  await deploymentManagerContext.page.getByTestId('subMenu-order').click()
  await expect(
    await deploymentManagerContext.page.getByRole('heading', {
      name: 'Consultation order',
    })
  ).toBeVisible()
})

test.beforeEach(async ({ deploymentManagerContext }) => {
  // Checks whether all of the steps are visible, as well as the sub steps and additional information
  await expect(
    await deploymentManagerContext.page.getByText('RegistrationStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerContext.page.getByText('First Look AssessmentStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerContext.page.getByText('RegistrationStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerContext.page.getByText('Complaint CategoriesStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerContext.page.getByText('Basic MeasurementsStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerContext.page.getByText('Medical HistoryStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerContext.page.getByText('Physical ExamsStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerContext.page.getByText('TestsStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerContext.page.getByText('Health Care QuestionsStep')
  ).toBeVisible()
  await expect(
    await deploymentManagerContext.page.getByText('ReferralStep')
  ).toBeVisible()

  await deploymentManagerContext.page
    .locator('li')
    .filter({ hasText: 'RegistrationStep' })
    .getByRole('img')
    .click()

  await expect(
    await deploymentManagerContext.page.getByText('First name')
  ).toBeVisible()
  await expect(
    await deploymentManagerContext.page.getByText('Last name')
  ).toBeVisible()
  await expect(
    await deploymentManagerContext.page.getByText('Birth date')
  ).toBeVisible()
})

test.describe('Check deploymentManager consultation order permissions', () => {
  test('should not be able to move node', async ({
    deploymentManagerContext,
  }) => {
    // TODO
  })
})
