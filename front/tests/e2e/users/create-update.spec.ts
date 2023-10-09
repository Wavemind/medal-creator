/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/users')
})

test.describe('Create and update user', () => {
  test('should navigate to users and open the modal to create a new user', async ({
    adminPage,
  }) => {
    await adminPage.getByTestId('new-user').click()
    await adminPage.fillInput('firstName', 'Quentin')
    await adminPage.fillInput('lastName', 'Ucak')
    await adminPage.fillInput('email', 'quentin.fresco@wavemind.ch')
    await adminPage.selectOptionByValue('role', 'clinician')
    await adminPage.page
      .getByRole('button', { name: 'Renamed project' })
      .click()

    await adminPage.submitForm()
  })

  test('should navigate to users and open the modal to update a user', async ({
    adminPage,
  }) => {
    await adminPage.getByTestId('datatable-menu').first().click()
    await adminPage.page.getByRole('menuitem', { name: 'Edit' }).click()
    await adminPage.fillInput('email', 'john.doe@wavemind.ch')

    await adminPage.page
      .getByRole('button', { name: 'Renamed project' })
      .click()
    await adminPage.submitForm()
    await expect(
      await adminPage.page.getByText('Saved successfully')
    ).toBeVisible()
  })
})
