/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/')
})

test.describe('Create and update project', () => {
  test('should create a new project', async ({ adminPage }) => {
    await adminPage.page.getByRole('link', { name: 'Add project' }).click()
    await adminPage.page.getByLabel('Name').fill('FeverTravel App 2')
    await adminPage.page.getByLabel('Name').fill('FeverTravel App 2')
    await adminPage.page.getByText('Consent management ?').click()
    await adminPage.page
      .getByLabel('Description')
      .fill(
        'Practice Guidelines for Evaluation of Fever in returning Travelers or Migrants'
      )
    await adminPage.page
      .locator("input[type='file']")
      .setInputFiles('playwright/fixtures/example.json')
    await adminPage.page.getByLabel('Default language*').selectOption('1')
    await adminPage.page
      .getByPlaceholder('John doe | john.doe@email.com')
      .fill('wavemind')

    await adminPage.page
      .getByRole('button', { name: 'Quentin Doe dev-admin@wavemind.ch' })
      .click()

    await adminPage.page.getByRole('button', { name: 'Save' }).click()
    await adminPage.page.waitForURL('/projects/2')
    await expect(
      await adminPage.page.getByText('Created successfully')
    ).toBeVisible()
  })

  test('should update an existing project', async ({ adminPage }) => {
    await adminPage.page.locator('[data-cy="project-menu-2"]').click()
    await adminPage.page.getByRole('menuitem', { name: 'Settings' }).click()
    await adminPage.page.getByLabel('Name').click()
    await adminPage.page.getByLabel('Name').fill('Renamed project')
    await adminPage.page.getByRole('button', { name: 'Save' }).click()
    await expect(
      await adminPage.page.getByText('Updated successfully')
    ).toBeVisible()
  })
})
