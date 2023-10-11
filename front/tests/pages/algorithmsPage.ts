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
      .click()
    await this.context.page.getByTestId('sidebar-algorithms').click()
    await expect(
      await this.context.page.getByRole('heading', { name: 'Algorithms' })
    ).toBeVisible()
  }

  canSearchForAlgorithms = async () => {
    await this.context.searchFor('first algo', 'First algo')
    await this.context.searchFor('toto', 'No data available')
  }

  cannotCreateAlgorithm = async () => {
    await expect(
      await this.context.getByTestId('create-algorithm')
    ).not.toBeVisible()
  }

  cannotUpdateAlgorithm = async () => {
    await expect(
      await this.context.getByTestId('datatable-menu').first()
    ).not.toBeVisible()
    await this.context.page.getByTestId('datatable-show').first().click()
    await expect(
      await this.context.page.getByRole('heading', {
        name: 'Decision trees & Diagnoses',
      })
    ).toBeVisible()
    await expect(
      this.context.page.getByRole('button', { name: 'Algorithm settings' })
    ).not.toBeVisible()
  }

  cannotArchiveAlgorithm = async () => {
    await expect(
      await this.context.getByTestId('datatable-menu').first()
    ).not.toBeVisible()
  }

  cannotDuplicateAlgorithm = async () => {
    await expect(
      await this.context.getByTestId('datatable-menu').first()
    ).not.toBeVisible()
  }

  canCreateAlgorithm = async () => {
    await expect(
      await this.context.getByTestId('create-algorithm')
    ).toBeVisible()
    await this.context.getByTestId('create-algorithm').click()
    await this.context.fillInput('name', 'Test algorithm')
    await this.context.fillInput('ageLimit', '4')
    await this.context.fillTextarea(
      'ageLimitMessage',
      'This is a test age limit message'
    )
    await this.context.fillInput('minimumAge', '2')
    await this.context.selectOptionByValue('mode', 'arm_control')
    await this.context.fillTextarea('description', 'This is a test description')

    await this.context.page
      .locator('label')
      .filter({ hasText: 'French' })
      .locator('span')
      .first()
      .click()

    await this.submitForm()
    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }

  canUpdateAlgorithm = async (description: string) => {
    await this.context.fillTextarea('description', description)
    await this.submitForm()

    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }

  canArchiveAlgorithm = async () => {
    await expect(
      await this.context.getByTestId('create-algorithm')
    ).toBeVisible()
    await this.context.getByTestId('create-algorithm').click()
    await this.context.fillInput('name', 'test archive')
    await this.context.fillTextarea('ageLimitMessage', 'a message')
    await this.context.fillInput('ageLimit', '3')
    await this.context.fillInput('minimumAge', '2')
    await this.context.selectOptionByValue('mode', 'arm_control')
    await this.context.fillTextarea('description', 'This is a test description')
    await this.submitForm()

    await this.context.page.waitForTimeout(500)

    await this.context.fillInput('search', 'test archive')

    await this.context.getByTestId('datatable-menu').first().click()
    await this.context.page.getByRole('menuitem', { name: 'Archive' }).click()
    await this.context.page.getByRole('button', { name: 'Yes' }).click()
    await expect(
      await this.context.page.getByText('Archived successfully')
    ).toBeVisible()
  }
}
