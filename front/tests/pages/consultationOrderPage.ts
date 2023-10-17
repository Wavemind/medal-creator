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
      .last()
      .click()
    await this.clickElementByTestId('sidebar-algorithms')
    await this.clickOnFirstAlgo()
    await this.clickElementByTestId('subMenu-order')
    await this.checkHeadingIsVisible('Consultation order')
  }

  checkSteps = async () => {
    await this.checkTextIsVisible('RegistrationStep')
    await this.checkTextIsVisible('First Look AssessmentStep')
    await this.checkTextIsVisible('RegistrationStep')
    await this.checkTextIsVisible('Complaint CategoriesStep')
    await this.checkTextIsVisible('Basic MeasurementsStep')
    await this.checkTextIsVisible('Medical HistoryStep')
    await this.checkTextIsVisible('Physical ExamsStep')
    await this.checkTextIsVisible('TestsStep')
    await this.checkTextIsVisible('Health Care QuestionsStep')
    await this.checkTextIsVisible('ReferralStep')

    await this.context.page
      .locator('li')
      .filter({ hasText: 'RegistrationStep' })
      .getByRole('img')
      .click()

    await this.checkTextIsVisible('First name')
    await this.checkTextIsVisible('Last name')
    await this.checkTextIsVisible('Birth date')
  }
}
