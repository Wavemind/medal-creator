/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/tests/pages/basePage'

export class VariablesPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/')
    await this.context.page
      .getByRole('link', { name: this.context.projectName })
      .click()
    await this.context.page.getByTestId('sidebar-library').click()
    await this.checkHeadingIsVisible('Variables')
  }

  canSearchForVariables = async () => {
    await this.searchForElement('Cough', 'Cough')
  }

  cannotCreateVariable = async () => {
    await expect(
      await this.context.getByTestId('create-variable')
    ).not.toBeVisible()
  }

  cannotUpdateVariable = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await expect(
      await this.context.page.getByRole('menuitem', { name: 'Edit' })
    ).not.toBeVisible()
  }

  cannotDuplicateVariable = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await expect(
      await this.context.page.getByRole('menuitem', { name: 'Duplicate' })
    ).not.toBeVisible()
  }

  cannotDeleteVariable = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await expect(
      await this.context.page.getByRole('menuitem', { name: 'Delete' })
    ).not.toBeVisible()
  }

  canViewInfo = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await this.context.page.getByRole('menuitem', { name: 'Info' }).click()
    await this.checkHeadingIsVisible('Fever')
    await this.context.getByTestId('close-modal').click()
  }

  canCreateVariable = async () => {
    // Check correct inputs for correct categories
    await this.context.page.getByTestId('create-variable').click()
    await this.checkVariableInputs()

    // Check validations for variable step
    await this.context.page.getByTestId('close-modal').click()
    await this.context.page.getByTestId('create-variable').click()
    await this.validateVariableStep()

    // Check validations for answer step
    await this.context.getByTestId('close-modal').click()
    await this.context.page.getByTestId('create-variable').click()
    await this.validateAnswerStep()

    // Check skip answer step
    await this.context.getByTestId('close-modal').click()
    await this.context.page.getByTestId('create-variable').click()
    await this.skipAnswerStep()

    // Create variables
    await this.context.getByTestId('close-modal').click()
    await this.context.page.getByTestId('create-variable').click()
    await this.createVariableWithLabelAnswers()

    await this.context.page.getByTestId('create-variable').click()
    await this.createVariableWithLabelAndValueAnswers()

    await this.context.page.getByTestId('create-variable').click()
    await this.createVariableWithBooleanAnswers()

    await this.context.page.getByTestId('create-variable').click()
    await this.createVariableWithDecimalAnswers()
  }

  canUpdateVariable = async () => {
    await this.context.getByTestId('variable-edit-button').first().click()
    await expect(await this.context.getSelect('type')).toHaveAttribute(
      'disabled',
      ''
    )
    await expect(await this.context.getSelect('answerTypeId')).toHaveAttribute(
      'disabled',
      ''
    )
    await this.context.fillInput('label', 'updated label')
    await this.context.nextStep()
    await this.context.nextStep()
    await this.context.submitForm()

    await expect(
      await this.context.page.getByRole('cell', { name: 'updated label' })
    ).toBeVisible()
  }

  canDuplicateVariable = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await this.context.page.getByRole('menuitem', { name: 'Duplicate' }).click()
    await this.context.page.getByRole('button', { name: 'Yes' }).click()
    await this.checkTextIsVisible('Duplicated successfully')
  }

  canDeleteVariable = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await this.deleteElement()
  }

  private checkVariableInputs = async () => {
    await this.checkTextIsVisible('Variable', { exact: true })
    await this.checkHeadingIsVisible('Answers')
    await this.checkTextIsVisible('Medias')
    await expect(await this.context.getSelect('type')).toBeVisible()
    await this.context.nextStep()
    await this.checkTextIsVisible('Category is required')

    await expect(await this.context.getSelect('answerTypeId')).toBeVisible()
    await this.checkTextIsVisible('Answer type is required')
    await expect(await this.context.getSelect('stage')).toBeVisible()
    await expect(await this.context.getSelect('emergencyStatus')).toBeVisible()
    await expect(await this.context.getCheckbox('isMandatory')).toBeVisible()
    await expect(await this.context.getCheckbox('isNeonat')).toBeVisible()
    await expect(await this.context.getCheckbox('isIdentifiable')).toBeVisible()

    await expect(await this.context.getInput('label')).toBeVisible()
    await this.checkTextIsVisible('Label is required')
    await expect(await this.context.getByTestId('autocomplete')).toBeVisible()
    await expect(await this.context.getTextarea('description')).toBeVisible()

    // Update type and check display of new inputs
    await this.context.selectOptionByValue('type', 'AssessmentTest')
    await expect(await this.context.getCheckbox('isUnavailable')).toBeVisible()

    // BackgroundCalculation
    await this.context.selectOptionByValue('type', 'BackgroundCalculation')
    await expect(await this.context.getInput('formula')).toBeVisible()
    await expect(await this.context.getByTestId('info-formula')).toBeVisible()
    await expect(
      await this.context.getSelect('answerTypeId').inputValue()
    ).toBe('5')
    await expect(
      await this.context.getCheckbox('isUnavailable')
    ).not.toBeVisible()

    // Basic demographic
    await this.context.selectOptionByValue('type', 'BasicDemographic')
    await expect(await this.context.getCheckbox('isPreFill')).toBeVisible()

    // Basic measurement
    await this.context.selectOptionByValue('type', 'BasicMeasurement')
    await expect(
      await this.context.getSelect('answerTypeId').inputValue()
    ).toBe('4')
    await expect(await this.context.getCheckbox('isUnavailable')).toBeVisible()
    await expect(await this.context.getCheckbox('isEstimable')).toBeVisible()
    await expect(await this.context.getInput('placeholder')).toBeVisible()
    await expect(await this.context.getSelect('round')).toBeVisible()
    await this.context.fillInput('minValueWarning', '5')
    await this.context.fillInput('maxValueWarning', '5')
    await this.context.fillInput('minValueError', '5')
    await this.context.fillInput('maxValueError', '5')
    await this.context.nextStep()
    await this.checkTextIsVisible('Warning message if below range is required')
    await this.checkTextIsVisible('Warning message if above range is required')
    await this.checkTextIsVisible('Error message if below range is required')
    await this.checkTextIsVisible('Error message if above range is required')

    await expect(
      await this.context.getTextarea('minMessageWarning')
    ).toBeVisible()

    await this.context.fillInput('minValueWarning', '')
    await expect(
      await this.context.getTextarea('minMessageWarning')
    ).not.toBeVisible()

    await expect(
      await this.context.getTextarea('maxMessageWarning')
    ).toBeVisible()
    await this.context.fillInput('maxValueWarning', '')
    await expect(
      await this.context.getTextarea('maxMessageWarning')
    ).not.toBeVisible()

    await expect(
      await this.context.getTextarea('minMessageError')
    ).toBeVisible()
    await this.context.fillInput('minValueError', '')
    await expect(
      await this.context.getTextarea('minMessageError')
    ).not.toBeVisible()
    await expect(
      await this.context.getTextarea('maxMessageError')
    ).toBeVisible()
    await this.context.fillInput('maxValueError', '')
    await expect(
      await this.context.getTextarea('maxMessageError')
    ).not.toBeVisible()

    // Complaint category
    await this.context.selectOptionByValue('type', 'ComplaintCategory')
    await expect(
      await this.context.getSelect('answerTypeId').inputValue()
    ).toBe('1')
    await expect(
      await this.context.getInput('minValueWarning')
    ).not.toBeVisible()
    await expect(
      await this.context.getInput('maxValueWarning')
    ).not.toBeVisible()
    await expect(await this.context.getInput('minValueError')).not.toBeVisible()
    await expect(await this.context.getInput('maxValueError')).not.toBeVisible()
    await expect(
      await this.context.getByTestId('autocomplete')
    ).not.toBeVisible()

    // Exposure
    await this.context.selectOptionByValue('type', 'Exposure')
    await expect(await this.context.getSelect('system')).toBeVisible()

    await this.context.nextStep()
    await this.checkTextIsVisible('System is required')

    await expect(
      await this.context.optionExistsInSelect('system', 'priority_sign')
    ).toBeTruthy()
  }

  private validateVariableStep = async () => {
    await this.context.nextStep()
    await this.checkTextIsVisible('Category is required')
    await this.checkTextIsVisible('Label is required')

    await this.context.selectOptionByValue('type', 'PhysicalExam')
    await this.context.selectOptionByValue('answerTypeId', '3')

    await this.context.fillInput('minValueWarning', '4')
    await this.context.fillInput('maxValueWarning', '3')
    await this.context.fillInput('minValueError', '2')
    await this.context.fillInput('maxValueError', '1')

    await this.context.nextStep()

    await this.checkTextIsVisible('Warning message if below range is required')
    await this.checkTextIsVisible('System is required')

    await this.context.fillInput('label', 'test label')
    await this.context.selectOptionByValue('system', 'respiratory_circulation')

    await this.context.fillTextarea(
      'minMessageWarning',
      'test minMessageWarning'
    )
    await this.context.fillTextarea(
      'maxMessageWarning',
      'test maxMessageWarning'
    )
    await this.context.fillTextarea('minMessageError', 'test minMessageError')
    await this.context.fillTextarea('maxMessageError', 'test maxMessageError')

    await this.context.nextStep()

    await this.checkTextIsVisible(
      'The values you entered in the validation ranges seem incorrect. Please check the values again.'
    )

    await this.context.fillInput('minValueWarning', '5')
    await this.context.fillInput('maxValueWarning', '5')
    await this.context.fillInput('minValueError', '5')
    await this.context.fillInput('maxValueError', '5')

    await this.context.fillTextarea(
      'minMessageWarning',
      'test minMessageWarning'
    )
    await this.context.fillTextarea(
      'maxMessageWarning',
      'test maxMessageWarning'
    )
    await this.context.fillTextarea('minMessageError', 'test minMessageError')
    await this.context.fillTextarea('maxMessageError', 'test maxMessageError')

    // Go to answers step
    await this.context.nextStep()
  }

  private validateAnswerStep = async () => {
    await this.context.selectOptionByValue('type', 'PhysicalExam')
    await this.context.selectOptionByValue('answerTypeId', '3')

    await this.context.fillInput('label', 'test variable')
    await this.context.selectOptionByValue('system', 'respiratory_circulation')

    await this.context.nextStep()

    // Trigger default answer validation
    await this.context.nextStep()

    await this.checkTextIsVisible('Answers field must have at least 1 items')

    await this.context.getByTestId('add-answer').click()

    await expect(
      await this.context.getInput('answersAttributes[0].label')
    ).toBeVisible()

    await expect(
      await this.context.getSelect('answersAttributes[0].operator')
    ).toBeVisible()

    await expect(
      await this.context.getInput('answersAttributes[0].value')
    ).toBeVisible()

    await this.context.nextStep()

    await this.checkTextIsVisible('Label is required')
    await this.checkTextIsVisible('Operator is required')
    await this.checkTextIsVisible('Value is required')

    await this.context.getByTestId('delete-answer-0').click()
    await expect(
      await this.context.getInput('answersAttributes[0].label')
    ).not.toBeVisible()
    await expect(
      await this.context.getSelect('answersAttributes[0].operator')
    ).not.toBeVisible()
    await expect(
      await this.context.getInput('answersAttributes[0].value')
    ).not.toBeVisible()

    await this.context.getByTestId('add-answer').click()
    await this.context.fillInput('answersAttributes[0].label', 'test')
    await this.context.selectOptionByValue(
      'answersAttributes[0].operator',
      'less'
    )
    await this.context.fillInput('answersAttributes[0].value', '5')
    await this.context.nextStep()
    await this.checkTextIsVisible(
      'One (and only one) answer required with the GREATER THAN OR EQUAL TO operator in order to close your range.'
    )

    await this.context.getByTestId('add-answer').click()
    await this.context.fillInput('answersAttributes[1].label', 'test')
    await this.context.selectOptionByValue(
      'answersAttributes[1].operator',
      'more_or_equal'
    )
    await this.context.fillInput('answersAttributes[1].value', '6')
    await this.context.nextStep()
    await this.checkTextIsVisible(
      'The value for the LESS THAN operator must be equal to the value for the GREATER THAN OR EQUAL operator.'
    )

    await this.context.getByTestId('add-answer').click()
    await this.context.fillInput('answersAttributes[2].label', 'test')
    await this.context.selectOptionByValue(
      'answersAttributes[2].operator',
      'between'
    )
    await this.context.fillInput('answersAttributes[2].startValue', '6')
    await this.context.fillInput('answersAttributes[2].endValue', '6')
    await this.context.nextStep()
    await this.checkTextIsVisible(
      'The smallest value in your answers with the BETWEEN operator has to be equal to the answer with the LESS THAN operator.'
    )

    await this.context.fillInput('answersAttributes[1].value', '2')

    await this.context.nextStep()
    await this.checkTextIsVisible(
      "Your answer with the LESS THAN operator can't be greater than your answer with the GREATER THAN OR EQUAL operator."
    )

    await this.context.previousStep()
    await this.context.selectOptionByValue('answerTypeId', '4')

    await this.context.nextStep()
    await this.context.nextStep()

    await this.checkTextIsVisible('Answers field must have at least 1 items')
  }

  private skipAnswerStep = async () => {
    await this.context.selectOptionByValue('type', 'PhysicalExam')
    await this.context.selectOptionByValue('answerTypeId', '7')
    await this.context.fillInput('label', 'test label')
    await this.context.selectOptionByValue('system', 'respiratory_circulation')

    await this.context.nextStep()
    await this.checkTextIsVisible('Media upload')
    await this.checkTextIsVisible(
      'Drag and drop your files, or click to select a file'
    )
  }

  private createVariableWithLabelAnswers = async () => {
    await this.context.selectOptionByValue('type', 'PhysicalExam')
    await this.context.selectOptionByValue('answerTypeId', '2')
    await this.context.fillInput('label', 'variable with label as answers')
    await this.context.selectOptionByValue('system', 'respiratory_circulation')

    await this.context.nextStep()

    await this.context.getByTestId('add-answer').click()
    await this.context.fillInput(
      'answersAttributes[0].label',
      'Only label displayed'
    )

    await this.context.nextStep()
    await this.context.submitForm()
    await this.checkTextIsVisible('Saved successfully')
  }

  private createVariableWithLabelAndValueAnswers = async () => {
    await this.context.selectOptionByValue('type', 'VitalSignAnthropometric')
    await this.context.fillInput(
      'label',
      'variable with label and value as answers'
    )
    await this.context.selectOptionByValue('system', 'respiratory_circulation')
    await expect(await this.context.getCheckbox('isUnavailable')).toBeVisible()
    await this.context.page.getByText('Variable can be not feasible').click()

    await this.context.nextStep()

    await this.context.getByTestId('add-answer').click()
    await this.context.fillInput(
      'answersAttributes[0].label',
      'Only label displayed'
    )
    await this.context.fillInput(
      'answersAttributes[0].value',
      'Only label and value displayed'
    )

    await this.context.nextStep()
    await this.context.submitForm()
    await this.checkTextIsVisible('Saved successfully')
  }

  private createVariableWithBooleanAnswers = async () => {
    await this.context.selectOptionByValue('type', 'ComplaintCategory')
    await this.context.fillInput('label', 'variable with boolean answer type')

    await this.context.nextStep()
    await this.context.submitForm()
    await expect(
      await this.context.page.getByText('Saved successfully').last()
    ).toBeVisible()
  }

  private createVariableWithDecimalAnswers = async () => {
    await this.context.selectOptionByValue('type', 'Demographic')
    await this.context.selectOptionByValue('answerTypeId', '4')
    await this.context.fillInput('label', 'variable with decimal answer type')

    await this.context.nextStep()

    await this.context.getByTestId('add-answer').click()
    await this.context.fillInput('answersAttributes[0].label', 'test')
    await this.context.selectOptionByValue(
      'answersAttributes[0].operator',
      'less'
    )
    await this.context.fillInput('answersAttributes[0].value', '1')

    await this.context.getByTestId('add-answer').click()
    await this.context.fillInput('answersAttributes[1].label', 'test')
    await this.context.selectOptionByValue(
      'answersAttributes[1].operator',
      'between'
    )
    await this.context.fillInput('answersAttributes[1].startValue', '1')
    await this.context.fillInput('answersAttributes[1].endValue', '8')

    await this.context.getByTestId('add-answer').click()
    await this.context.fillInput('answersAttributes[2].label', 'test')
    await this.context.selectOptionByValue(
      'answersAttributes[2].operator',
      'more_or_equal'
    )
    await this.context.fillInput('answersAttributes[2].value', '8')

    await this.context.nextStep()

    await this.context.submitForm()
    await expect(
      await this.context.page.getByText('Saved successfully').last()
    ).toBeVisible()
  }
}
