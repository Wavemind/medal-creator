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
    await adminPage.page.getByRole('button', { name: 'New user' }).click()
    await adminPage.page.getByLabel('First name*').fill('Quentin')
    await adminPage.page.getByLabel('Last name*').fill('Ucak')
    await adminPage.page.getByLabel('Email*').fill('quentin.fresco@wavemind.ch')
    await adminPage.page.getByLabel('Role*').selectOption('clinician')
    await adminPage.page
      .getByRole('button', { name: 'Project for Tanzania' })
      .click()
  })

  test('should navigate to users and open the modal to update a user', async ({
    adminPage,
  }) => {
    await adminPage.page.locator('[data-cy="datatable-menu-3"]').click()
    await adminPage.page.getByRole('menuitem', { name: 'Edit' }).click()

    await adminPage.page.getByLabel('Email*').fill('john.doe@wavemind.ch')
    await adminPage.page
      .getByRole('button', { name: 'Project for Tanzania' })
      .click()
    await adminPage.page.getByRole('button', { name: 'Save' }).click()
    await expect(
      await adminPage.page.getByText('Updated successfully')
    ).toBeVisible()
  })
})
