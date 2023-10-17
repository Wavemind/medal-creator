/**
 * The external imports
 */
import { expect, type Page } from '@playwright/test'

// TODO : Clean the methods when finished
// TODO : Extract form interaction in another class
export class BaseContext {
  page: Page
  projectName: string

  constructor(page: Page, projectName: string) {
    this.page = page
    this.projectName = projectName
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
}
