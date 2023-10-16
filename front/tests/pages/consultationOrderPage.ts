/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/tests/pages/basePage'

export class ConsultationOrderPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/')
    await this.context.page
      .getByRole('link', { name: this.context.projectName })
      .click()
    await this.context.page.getByTestId('sidebar-algorithms').click()
    await this.context.page.getByTestId('datatable-show').first().click()
    await this.context.page.getByTestId('subMenu-order').click()
    await expect(
      await this.context.page.getByRole('heading', {
        name: 'Consultation order',
      })
    ).toBeVisible()
  }

  checkSteps = async () => {
    await expect(
      await this.context.page.getByText('RegistrationStep')
    ).toBeVisible()
    await expect(
      await this.context.page.getByText('First Look AssessmentStep')
    ).toBeVisible()
    await expect(
      await this.context.page.getByText('RegistrationStep')
    ).toBeVisible()
    await expect(
      await this.context.page.getByText('Complaint CategoriesStep')
    ).toBeVisible()
    await expect(
      await this.context.page.getByText('Basic MeasurementsStep')
    ).toBeVisible()
    await expect(
      await this.context.page.getByText('Medical HistoryStep')
    ).toBeVisible()
    await expect(
      await this.context.page.getByText('Physical ExamsStep')
    ).toBeVisible()
    await expect(await this.context.page.getByText('TestsStep')).toBeVisible()
    await expect(
      await this.context.page.getByText('Health Care QuestionsStep')
    ).toBeVisible()
    await expect(
      await this.context.page.getByText('ReferralStep')
    ).toBeVisible()

    await this.context.page
      .locator('li')
      .filter({ hasText: 'RegistrationStep' })
      .getByRole('img')
      .click()

    await expect(await this.context.page.getByText('First name')).toBeVisible()
    await expect(await this.context.page.getByText('Last name')).toBeVisible()
    await expect(await this.context.page.getByText('Birth date')).toBeVisible()
  }
}
