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

  navigateToMedalDataConfigPage = async () => {
    await this.clickElementByTestId('subMenu-config')
    await this.checkHeadingIsVisible('MedAL-data config')
  }

  cannotAccessMedalDataConfigPage = async () => {
    const url = await this.context.page.url()
    await expect(
      await this.getElementByTestId('subMenu-config')
    ).not.toBeVisible()
    await this.context.page.goto(`${url}/medal-data-config`)
    await expect(
      await this.context.page.getByRole('heading', {
        name: 'MedAL-data config',
      })
    ).not.toBeVisible()
  }

  canAddANewRow = async () => {
    await this.navigateToMedalDataConfigPage()
    await this.clickButtonByText('Add row')
    await this.form.fillInput(
      'medalDataConfigVariablesAttributes[0].label',
      'API test'
    )
    await this.form.fillInput(
      'medalDataConfigVariablesAttributes[0].apiKey',
      'api_test'
    )

    await this.getElementByTestId('async-autocomplete').first().click()
    await this.context.page.getByRole('button', { name: 'Fever' }).click()

    await this.clickButtonByText('Save')
    await this.checkTextIsVisible('Saved successfully')
  }

  canDeleteARow = async () => {
    await this.navigateToMedalDataConfigPage()

    await this.context.page.getByTestId('delete-api-config-0').click()

    await this.clickButtonByText('Save')
    await this.checkTextIsVisible('Saved successfully')
  }

  checkValidations = async () => {
    await this.navigateToMedalDataConfigPage()

    await this.clickButtonByText('Add row')
    await this.clickButtonByText('Save')

    await this.checkTextIsVisible('Label is required')
    await this.checkTextIsVisible('Api key is required')
    await this.checkTextIsVisible('Variable is invalid')
  }
}
