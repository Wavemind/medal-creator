/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/tests/contexts/baseContext'
import { BasePage } from '@/tests/pageObjectModels/base'

export class ExportsPage extends BasePage {
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
    await this.checkHeadingIsVisible('Translations export')
    await this.checkHeadingIsVisible('Variables export')
  }

  cannotAccessExportsPage = async () => {
    const url = await this.context.page.url()
    await expect(
      await this.getElementByTestId('subMenu-exports')
    ).not.toBeVisible()
    await this.context.page.goto(`${url}/exports`)
    await expect(
      await this.context.page.getByRole('heading', {
        name: 'Translations export',
      })
    ).not.toBeVisible()
  }

  downloadVariables = async () => {
    await this.navigateToExports()
    const downloadPromise = this.context.page.waitForEvent('download')
    await this.clickElementByTestId('download-variables')
    const download = await downloadPromise
    expect(download.url()).toContain('.xlsx')
  }

  downloadTranslations = async () => {
    await this.navigateToExports()
    const downloadPromise = this.context.page.waitForEvent('download')
    await this.clickElementByTestId('download-translations')
    const download = await downloadPromise
    expect(download.url()).toContain('.xlsx')
  }

  uploadTranslationsFile = async () => {
    await this.navigateToExports()
    const downloadPromise = this.context.page.waitForEvent('download')
    await this.clickElementByTestId('download-translations')
    const download = await downloadPromise

    await download.saveAs('tests/fixtures/translations.xlsx')
    await this.context.page
      .locator("input[type='file']")
      .setInputFiles('tests/fixtures/translations.xlsx')

    await this.form.submitForm()

    await this.checkTextIsVisible('Saved successfully')
  }

  checkUploadValidations = async () => {
    await this.navigateToExports()

    await this.form.submitForm()
    await this.checkTextIsVisible('Excel file is required')

    await this.context.page
      .locator("input[type='file']")
      .setInputFiles('tests/fixtures/example.xlsx')
    await this.form.submitForm()
    await this.checkTextIsVisible('An error occured while importing your data.')

    await this.context.page
      .locator("input[type='file']")
      .setInputFiles('tests/fixtures/example.json')
    await this.form.submitForm()
    await this.checkTextIsVisible('Only XLSX files are allowed')
  }
}
