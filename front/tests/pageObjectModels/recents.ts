/**
 * The internal imports
 */
import { BaseContext } from '@/tests/contexts/baseContext'
import { BasePage } from '@/tests/pageObjectModels/base'

export class RecentsPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/')
    await this.context.page
      .getByRole('link', { name: this.context.projectName })
      .last()
      .click()
    await this.clickElementByTestId('sidebar-recent')
    await this.checkHeadingIsVisible('Recents')
  }

  canSearchForDecisionTrees = async () => {
    await this.searchForElement('col', 'Cold')
  }
}
