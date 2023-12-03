/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/tests/contexts/baseContext'
import { BasePage } from '@/tests/pageObjectModels/base'

export class AlgorithmsPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
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

  cannotPublishAlgorithm = async () => {
    await this.context.page.goto('/')
    await this.context.page
      .getByRole('link', { name: this.context.projectName })
      .last()
      .click()
    await this.checkHeadingIsVisible(`Project : ${this.context.projectName}`)
    await expect(
      await this.getElementByTestId('sidebar-publication')
    ).not.toBeVisible()
    const url = await this.context.page.url()
    await this.context.page.goto(`${url}/publication`)
    await expect(
      await this.context.page.getByRole('heading', {
        name: 'Publication',
      })
    ).not.toBeVisible()
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

  canPublishAlgorithm = async () => {
    await this.context.page.goto('/')
    await this.context.page
      .getByRole('link', { name: this.context.projectName })
      .last()
      .click()
    await this.checkHeadingIsVisible(`Project : ${this.context.projectName}`)
    await expect(
      await this.getElementByTestId('sidebar-publication')
    ).toBeVisible()
    await this.clickElementByTestId('sidebar-publication')
    await this.checkHeadingIsVisible('Publication')
    await expect(await this.getButtonByText('Generate')).toHaveAttribute(
      'disabled',
      ''
    )
    await this.context.page.getByText('Select algorithm').click()
    await this.clickOptionByText('First algo')
    await expect(await this.getButtonByText('Generate')).not.toHaveAttribute(
      'disabled',
      ''
      // TODO : Click on the generate on button
    )
  }
}
