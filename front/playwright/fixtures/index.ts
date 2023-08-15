/**
 * The external imports
 */
import { test as base, type Page } from '@playwright/test'

// Page Object Model for the "admin" page.
class AdminPage {
  // Page signed in as "admin".
  page: Page

  constructor(page: Page) {
    this.page = page
  }
}

// Page Object Model for the "user" page.
class UserPage {
  // Page signed in as "user".
  page: Page

  constructor(page: Page) {
    this.page = page
  }
}

// Declare the types of your fixtures.
type MyFixtures = {
  adminPage: AdminPage
  userPage: UserPage
}

export * from '@playwright/test'
export const test = base.extend<MyFixtures>({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: '../playwright/.auth/admin.json',
    })
    const adminPage = new AdminPage(await context.newPage())
    await use(adminPage)
    await context.close()
  },
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: '../playwright/.auth/user.json',
    })
    const userPage = new UserPage(await context.newPage())
    await use(userPage)
    await context.close()
  },
})
