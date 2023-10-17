/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/tests/pages/basePage'

export class AlgorithmsPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  getIdFromUrl = async () => {
    const url = await this.context.page.url()
    const regex = /\d+$/
    const extractedIdArray = url.match(regex)

    if (extractedIdArray && extractedIdArray.length > 0) {
      return extractedIdArray[0]
    }
  }

  navigate = async () => {
    await this.context.page.goto('/')
    await this.context.page
      .getByRole('link', { name: this.context.projectName })
      .last()
      .click()
    await this.clickElementByTestId('sidebar-algorithms')
    await this.checkHeadingIsVisible('Algorithms')
  }

  navigateToProjectSettings = async () => {
    await this.context.page
      .getByRole('row', { name: 'First algo' })
      .getByTestId('datatable-show')
      .click()
    await this.checkHeadingIsVisible('Decision trees & Diagnoses')
    await expect(await this.getButtonByText('Algorithm settings')).toBeVisible()
    await this.clickButtonByText('Algorithm settings')
  }

  canSearchForAlgorithms = async () => {
    await this.searchForElement('first algo', 'First algo')
  }

  cannotCreateAlgorithm = async () => {
    await expect(
      await this.getElementByTestId('create-algorithm')
    ).not.toBeVisible()
  }

  cannotUpdateAlgorithm = async () => {
    await this.checkDoesNotHaveMenu()
    await this.clickOnFirstAlgo()
    await this.checkHeadingIsVisible('Decision trees & Diagnoses')
    await expect(
      await this.getButtonByText('Algorithm settings')
    ).not.toBeVisible()
  }

  cannotArchiveAlgorithm = async () => {
    await this.checkDoesNotHaveMenu()
  }

  cannotDuplicateAlgorithm = async () => {
    await this.checkDoesNotHaveMenu()
  }

  canCreateAlgorithm = async () => {
    await expect(
      await this.getElementByTestId('create-algorithm')
    ).toBeVisible()
    await this.clickElementByTestId('create-algorithm')
    await this.form.fillInput('name', 'Test algorithm')
    await this.form.fillInput('ageLimit', '4')
    await this.form.fillTextarea(
      'ageLimitMessage',
      'This is a test age limit message'
    )
    await this.form.fillInput('minimumAge', '2')
    await this.form.selectOptionByValue('mode', 'arm_control')
    await this.form.fillTextarea('description', 'This is a test description')

    await this.context.page
      .locator('label')
      .filter({ hasText: 'French' })
      .locator('span')
      .first()
      .click()

    await this.form.submitForm()
    await this.checkTextIsVisible('Saved successfully')
  }

  canUpdateAlgorithm = async (description: string) => {
    await this.form.fillTextarea('description', description)
    await this.form.submitForm()

    await this.checkTextIsVisible('Saved successfully')
  }

  canArchiveAlgorithm = async () => {
    await expect(
      await this.getElementByTestId('create-algorithm')
    ).toBeVisible()
    await this.clickElementByTestId('create-algorithm')
    await this.form.fillInput('name', 'test archive')
    await this.form.fillTextarea('ageLimitMessage', 'a message')
    await this.form.fillInput('ageLimit', '3')
    await this.form.fillInput('minimumAge', '2')
    await this.form.selectOptionByValue('mode', 'arm_control')
    await this.form.fillTextarea('description', 'This is a test description')
    await this.form.submitForm()

    await this.context.page.waitForTimeout(500)

    await this.form.fillInput('search', 'test archive')

    await this.getElementByTestId('datatable-menu').first().click()
    await this.clickMenuItemByText('Archive')
    await this.clickButtonByText('Yes')
    await this.checkTextIsVisible('Archived successfully')
  }
}
