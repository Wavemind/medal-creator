/**
 * The external imports
 */
import { test as base, type Locator, type Page } from '@playwright/test'

type MyFixtures = {
  adminPage: AdminPage
  userPage: UserPage
}

// TODO: Extract form interaction in another class
// Need to find a way to have admin or user page context + form class function
class BasePage {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  // Get an input field using its name attribute
  getInput(name: string): Locator {
    return this.page.locator(`input[name="${name}"]`)
  }

  // Get a textarea field using its name attribute
  getTextarea(name: string): Locator {
    return this.page.locator(`textarea[name="${name}"]`)
  }

  // Get a select field using its name attribute
  getSelect(name: string): Locator {
    return this.page.locator(`select[name="${name}"]`)
  }

  // Check if an option with a specific value exists in a select element
  async optionExistsInSelect(
    selectName: string,
    optionValue: string
  ): Promise<boolean> {
    const select = this.getSelect(selectName)
    const option = select.locator(`option[value="${optionValue}"]`)
    return (await option.count()) > 0
  }

  // Get a checkbox using its name attribute
  getCheckbox(name: string): Locator {
    return this.page.locator(`input[type="checkbox"][name="${name}"]`)
  }

  // Get a button by its text content
  getButtonByText(text: string): Locator {
    return this.page.locator(`button:has-text("${text}")`)
  }

  // Fill an input field with a value
  async fillInput(name: string, value: string) {
    const input = this.getInput(name)
    await input.fill(value)
  }

  // Fill a checkbox
  async checkCheckbox(name: string): Promise<void> {
    const checkbox = this.getCheckbox(name)
    await checkbox.setChecked(!(await checkbox.isChecked), { force: true })
  }

  // Fill a textarea field with a value
  async fillTextarea(name: string, value: string) {
    const textarea = this.getTextarea(name)
    await textarea.fill(value)
  }

  // Select an option in a select field by its value
  async selectOptionByValue(name: string, value: string) {
    const select = this.getSelect(name)
    await select.selectOption({ value })
  }

  // Click a button by its text content
  async clickButtonByText(text: string) {
    const button = this.getButtonByText(text)
    await button.click()
  }

  // Go to next step in a form
  async nextStep() {
    await this.getByDataCy('next').click()
  }

  // Go to previous step in a form
  async previousStep() {
    await this.getByDataCy('previous').click()
  }

  // Submit a form by clicking a submit button
  async submitForm() {
    const submitButton = this.page.locator('button[type="submit"]')
    await submitButton.click()
  }

  getByDataCy(name: string): Locator {
    return this.page.locator(`[data-cy="${name}"]`)
  }
}

// Page Object Model for the "admin" page.
class AdminPage extends BasePage {}

// Page Object Model for the "user" page.
class UserPage extends BasePage {}

export * from '@playwright/test'
export const test = base.extend<MyFixtures>({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: './.auth/admin.json',
    })
    const adminPage = new AdminPage(await context.newPage())
    await use(adminPage)
    await context.close()
  },
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: './.auth/user.json',
    })
    const userPage = new UserPage(await context.newPage())
    await use(userPage)
    await context.close()
  },
})
