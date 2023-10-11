/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminContext }) => {
  await adminContext.page.goto('/users')
})

test.describe('Create and update user', () => {
  test('should navigate to users and open the modal to create a new user', async ({
    adminContext,
  }) => {
    await adminContext.getByTestId('new-user').click()
    await adminContext.fillInput('firstName', 'Quentin')
    await adminContext.fillInput('lastName', 'Ucak')
    await adminContext.fillInput('email', 'quentin.fresco@wavemind.ch')
    await adminContext.selectOptionByValue('role', 'clinician')
    await adminContext.page
      .getByRole('button', { name: 'Renamed project' })
      .click()

    await adminContext.submitForm()
  })

  test('should navigate to users and open the modal to update a user', async ({
    adminContext,
  }) => {
    await adminContext.getByTestId('datatable-menu').first().click()
    await adminContext.page.getByRole('menuitem', { name: 'Edit' }).click()
    await adminContext.fillInput('email', 'john.doe@wavemind.ch')

    await adminContext.page
      .getByRole('button', { name: 'Renamed project' })
      .click()
    await adminContext.submitForm()
    await expect(
      await adminContext.page.getByText('Saved successfully')
    ).toBeVisible()
  })
})
