/**
 * The internal imports
 */
import { BaseContext } from '@/tests/contexts/baseContext'
import { BasePage } from '@/tests/pageObjectModels/base'

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
