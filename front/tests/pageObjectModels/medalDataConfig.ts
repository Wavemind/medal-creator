/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/tests/contexts/baseContext'
import { BasePage } from '@/tests/pageObjectModels/base'

export class MedalDataConfigPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigateToAlgorithm = async () => {
    await this.context.page.goto('/')
    await this.context.page
      .getByRole('link', { name: this.context.projectName })
      .last()
      .click()
    await this.clickElementByTestId('sidebar-algorithms')
    await this.clickOnFirstAlgo()
    await this.checkHeadingIsVisible('Decision trees & Diagnoses')
  }

  navigateToExports = async () => {
    await this.clickElementByTestId('subMenu-exports')
    await this.checkHeadingIsVisible('MedAL-data config')
  }

  cannotAccessExportsPage = async () => {
    const url = await this.context.page.url()
    await expect(
      await this.getElementByTestId('subMenu-exports')
    ).not.toBeVisible()
    await this.context.page.goto(`${url}/exports`)
    await expect(
      await this.context.page.getByRole('heading', {
        name: 'MedAL-data config',
      })
    ).not.toBeVisible()
  }
}
