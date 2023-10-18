/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/playwright/pages/basePage'

export class NotFoundPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/toto')
  }

  pageNotFound = async () => {
    await this.checkHeadingIsVisible('404 | Page not found')
  }
}
