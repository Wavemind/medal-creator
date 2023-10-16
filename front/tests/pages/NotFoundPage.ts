/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/tests/pages/basePage'

export class NotFoundPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/toto')
  }

  pageNotFound = async () => {
    await expect(
      await this.context.page.getByRole('heading', {
        name: '404 | Page not found',
      })
    ).toBeVisible()
  }
}
