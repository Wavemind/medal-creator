/**
 * The external imports
 */
import { test as base, expect, type Locator, type Page } from '@playwright/test'

type MyFixtures = {
  adminContext: AdminContext
  projectAdminContext: ProjectAdminContext
  clinicianContext: ClinicianContext
  deploymentManagerContext: DeploymentManagerContext
  viewerContext: ViewerContext
}

// TODO: Extract form interaction in another class
// Need to find a way to have admin or user page context + form class function
export class BaseContext {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  // Generic test for search functionality in all datatables
  async searchFor(term: string, foundRow: string) {
    await this.page.getByRole('textbox').click()
    await this.page.getByRole('textbox').fill(term)
    await expect(
      await this.page.getByRole('cell', {
        name: foundRow,
      })
    ).toBeVisible()
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
  async fillInput(name: string, value: string): Promise<void> {
    const input = this.getInput(name)
    await input.fill(value)
  }

  // Fill a checkbox
  async checkCheckbox(name: string): Promise<void> {
    const checkbox = this.getCheckbox(name)
    await checkbox.setChecked(!(await checkbox.isChecked), { force: true })
  }

  // Fill a textarea field with a value
  async fillTextarea(name: string, value: string): Promise<void> {
    const textarea = this.getTextarea(name)
    await textarea.fill(value)
  }

  // Select an option in a select field by its value
  async selectOptionByValue(name: string, value: string): Promise<void> {
    const select = this.getSelect(name)
    await select.selectOption({ value })
  }

  // Click a button by its text content
  async clickButtonByText(text: string): Promise<void> {
    const button = this.getButtonByText(text)
    await button.click()
  }

  // Go to next step in a form
  async nextStep(): Promise<void> {
    await this.getByTestId('next').click()
  }

  // Go to previous step in a form
  async previousStep(): Promise<void> {
    await this.getByTestId('previous').click()
  }

  // Submit a form by clicking a submit button
  async submitForm(): Promise<void> {
    const submitButton = this.page.locator('button[type="submit"]')
    await submitButton.click()
  }

  getByTestId(name: string): Locator {
    return this.page.getByTestId(name)
  }
}

// Page Object Model for the "admin" page.
class AdminContext extends BaseContext {}

// Page Object Model for the "admin" page.
class ProjectAdminContext extends BaseContext {}

// Page Object Model for the "clinician" page.
class ClinicianContext extends BaseContext {}

// Page Object Model for the "deployment manager" page.
class DeploymentManagerContext extends BaseContext {}

// Page Object Model for the "viewer" page.
class ViewerContext extends BaseContext {}

export * from '@playwright/test'
export const test = base.extend<MyFixtures>({
  adminContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: './playwright/.auth/admin.json',
    })
    const adminContext = new AdminContext(await context.newPage())
    await use(adminContext)
    await context.close()
  },
  projectAdminContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: './playwright/.auth/projectAdmin.json',
    })
    const projectAdminContext = new ProjectAdminContext(await context.newPage())
    await use(projectAdminContext)
    await context.close()
  },
  clinicianContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: './playwright/.auth/clinician.json',
    })
    const clinicianContext = new ClinicianContext(await context.newPage())
    await use(clinicianContext)
    await context.close()
  },
  deploymentManagerContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: './playwright/.auth/deploymentManager.json',
    })
    const viewerContext = new DeploymentManagerContext(await context.newPage())
    await use(viewerContext)
    await context.close()
  },
  viewerContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: './playwright/.auth/viewer.json',
    })
    const viewerContext = new ViewerContext(await context.newPage())
    await use(viewerContext)
    await context.close()
  },
})
