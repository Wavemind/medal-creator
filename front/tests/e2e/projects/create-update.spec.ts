/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/')
})

test.describe('Create and update project', () => {
  test('should create a new project', async ({ adminPage }) => {
    await adminPage.getByTestId('new-project').click()
    await adminPage.fillInput('name', 'FeverTravel App 2')
    await adminPage.page.getByText('Consent management ?').click()
    await adminPage.fillTextarea(
      'description',
      'Practice Guidelines for Evaluation of Fever in returning Travelers or Migrants'
    )

    await adminPage.page
      .locator("input[type='file']")
      .setInputFiles('playwright/fixtures/example.json')
    await adminPage.selectOptionByValue('languageId', '1')
    await adminPage.page
      .getByPlaceholder('John doe | john.doe@email.com')
      .fill('wavemind')

    await adminPage.page
      .getByRole('button', { name: 'Quentin Doe dev-admin@wavemind.ch' })
      .click()

    await adminPage.submitForm()
    await expect(
      await adminPage.page.getByText('Created successfully')
    ).toBeVisible()
  })

  test('should update an existing project', async ({ adminPage }) => {
    await adminPage.getByTestId('project-menu').first().click()
    await adminPage.page.getByRole('menuitem', { name: 'Settings' }).click()
    await adminPage.fillInput('name', 'Renamed project')
    await adminPage.submitForm()

    await expect(
      await adminPage.page.getByText('Updated successfully')
    ).toBeVisible()
  })
})
