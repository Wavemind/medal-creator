/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/tests/contexts/baseContext'
import { BasePage } from '@/tests/pageObjectModels/base'

export class VariablesPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/')
    await this.context.page
      .getByRole('link', { name: this.context.projectName })
      .last()
      .click()
    await this.clickElementByTestId('sidebar-library')
    await this.checkHeadingIsVisible('Variables')
  }

  canSearchForVariables = async () => {
    await this.searchForElement('Cough', 'Cough')
  }

  cannotCreateVariable = async () => {
    await expect(
      await this.getElementByTestId('create-variable')
    ).not.toBeVisible()
  }

  cannotUpdateVariable = async () => {
    await this.getElementByTestId('datatable-menu').first().click()
    await expect(await this.getMenuItemByText('Edit')).not.toBeVisible()
  }

  cannotDuplicateVariable = async () => {
    await this.getElementByTestId('datatable-menu').first().click()
    await expect(await this.getMenuItemByText('Duplicate')).not.toBeVisible()
  }

  cannotDeleteVariable = async () => {
    await this.getElementByTestId('datatable-menu').first().click()
    await expect(await this.getMenuItemByText('Delete')).not.toBeVisible()
  }

  canViewInfo = async () => {
    await this.getElementByTestId('datatable-menu').first().click()
    await this.clickMenuItemByText('Info')
    await this.checkHeadingIsVisible('Fever')
    await this.clickElementByTestId('close-modal')
  }

  canCreateVariable = async () => {
    // Check correct inputs for correct categories
    await this.clickElementByTestId('create-variable')
    await this.checkVariableInputs()

    // Check validations for variable step
    await this.clickElementByTestId('close-modal')
    await this.clickElementByTestId('create-variable')
    await this.validateVariableStep()

    // Check validations for answer step
    await this.clickElementByTestId('close-modal')
    await this.clickElementByTestId('create-variable')
    await this.validateAnswerStep()

    // Check skip answer step
    await this.clickElementByTestId('close-modal')
    await this.clickElementByTestId('create-variable')
    await this.skipAnswerStep()

    // Create variables
    await this.clickElementByTestId('close-modal')
    await this.clickElementByTestId('create-variable')
    await this.createVariableWithLabelAnswers()

    await this.clickElementByTestId('create-variable')
    await this.createVariableWithLabelAndValueAnswers()

    await this.clickElementByTestId('create-variable')
    await this.createVariableWithBooleanAnswers()

    await this.clickElementByTestId('create-variable')
    await this.createVariableWithDecimalAnswers()
  }

  canUpdateVariable = async () => {
    await this.getElementByTestId('variable-edit-button').first().click()
    await expect(await this.form.getSelect('type')).toHaveAttribute(
      'disabled',
      ''
    )
    await expect(await this.form.getSelect('answerTypeId')).toHaveAttribute(
      'disabled',
      ''
    )
    await this.form.fillInput('label', 'updated label')
    await this.form.nextStep()
    await this.form.nextStep()
    await this.form.submitForm()

    await expect(
      await this.context.page.getByRole('cell', { name: 'updated label' })
    ).toBeVisible()
  }

  canDuplicateVariable = async () => {
    await this.getElementByTestId('datatable-menu').first().click()
    await this.clickMenuItemByText('Duplicate')
    await this.clickButtonByText('Yes')
    await this.checkTextIsVisible('Duplicated successfully')
  }

  canDeleteVariable = async () => {
    await this.getElementByTestId('datatable-menu').first().click()
    await this.deleteElement()
  }

  private checkVariableInputs = async () => {
    await this.checkTextIsVisible('Variable', { exact: true })
    await this.checkHeadingIsVisible('Answers')
    await this.checkTextIsVisible('Medias')
    await expect(await this.form.getSelect('type')).toBeVisible()
    await this.form.nextStep()
    await this.checkTextIsVisible('Category is required')

    await expect(await this.form.getSelect('answerTypeId')).toBeVisible()
    await this.checkTextIsVisible('Answer type is required')
    await expect(await this.form.getSelect('stage')).toBeVisible()
    await expect(await this.form.getSelect('emergencyStatus')).toBeVisible()
    await expect(await this.form.getCheckbox('isMandatory')).toBeVisible()
    await expect(await this.form.getCheckbox('isNeonat')).toBeVisible()
    await expect(await this.form.getCheckbox('isIdentifiable')).toBeVisible()

    await expect(await this.form.getInput('label')).toBeVisible()
    await this.checkTextIsVisible('Label is required')
    await expect(await this.getElementByTestId('autocomplete')).toBeVisible()
    await expect(await this.form.getTextarea('description')).toBeVisible()

    // Update type and check display of new inputs
    await this.form.selectOptionByValue('type', 'AssessmentTest')
    await expect(await this.form.getCheckbox('isUnavailable')).toBeVisible()

    // BackgroundCalculation
    await this.form.selectOptionByValue('type', 'BackgroundCalculation')
    await expect(await this.form.getInput('formula')).toBeVisible()
    await expect(await this.getElementByTestId('info-formula')).toBeVisible()
    await expect(await this.form.getSelect('answerTypeId').inputValue()).toBe(
      '5'
    )
    await expect(await this.form.getCheckbox('isUnavailable')).not.toBeVisible()

    // Basic demographic
    await this.form.selectOptionByValue('type', 'BasicDemographic')
    await expect(await this.form.getCheckbox('isPreFill')).toBeVisible()

    // Basic measurement
    await this.form.selectOptionByValue('type', 'BasicMeasurement')
    await expect(await this.form.getSelect('answerTypeId').inputValue()).toBe(
      '4'
    )
    await expect(await this.form.getCheckbox('isUnavailable')).toBeVisible()
    await expect(await this.form.getCheckbox('isEstimable')).toBeVisible()
    await expect(await this.form.getInput('placeholder')).toBeVisible()
    await expect(await this.form.getSelect('round')).toBeVisible()
    await this.form.fillInput('minValueWarning', '5')
    await this.form.fillInput('maxValueWarning', '5')
    await this.form.fillInput('minValueError', '5')
    await this.form.fillInput('maxValueError', '5')
    await this.form.nextStep()
    await this.checkTextIsVisible('Warning message if below range is required')
    await this.checkTextIsVisible('Warning message if above range is required')
    await this.checkTextIsVisible('Error message if below range is required')
    await this.checkTextIsVisible('Error message if above range is required')

    await expect(await this.form.getTextarea('minMessageWarning')).toBeVisible()

    await this.form.fillInput('minValueWarning', '')
    await expect(
      await this.form.getTextarea('minMessageWarning')
    ).not.toBeVisible()

    await expect(await this.form.getTextarea('maxMessageWarning')).toBeVisible()
    await this.form.fillInput('maxValueWarning', '')
    await expect(
      await this.form.getTextarea('maxMessageWarning')
    ).not.toBeVisible()

    await expect(await this.form.getTextarea('minMessageError')).toBeVisible()
    await this.form.fillInput('minValueError', '')
    await expect(
      await this.form.getTextarea('minMessageError')
    ).not.toBeVisible()
    await expect(await this.form.getTextarea('maxMessageError')).toBeVisible()
    await this.form.fillInput('maxValueError', '')
    await expect(
      await this.form.getTextarea('maxMessageError')
    ).not.toBeVisible()

    // Complaint category
    await this.form.selectOptionByValue('type', 'ComplaintCategory')
    await expect(await this.form.getSelect('answerTypeId').inputValue()).toBe(
      '1'
    )
    await expect(await this.form.getInput('minValueWarning')).not.toBeVisible()
    await expect(await this.form.getInput('maxValueWarning')).not.toBeVisible()
    await expect(await this.form.getInput('minValueError')).not.toBeVisible()
    await expect(await this.form.getInput('maxValueError')).not.toBeVisible()
    await expect(
      await this.getElementByTestId('autocomplete')
    ).not.toBeVisible()

    // Exposure
    await this.form.selectOptionByValue('type', 'Exposure')
    await expect(await this.form.getSelect('system')).toBeVisible()

    await this.form.nextStep()
    await this.checkTextIsVisible('System is required')

    await expect(
      await this.form.optionExistsInSelect('system', 'priority_sign')
    ).toBeTruthy()
  }

  private validateVariableStep = async () => {
    await this.form.nextStep()
    await this.checkTextIsVisible('Category is required')
    await this.checkTextIsVisible('Label is required')

    await this.form.selectOptionByValue('type', 'PhysicalExam')
    await this.form.selectOptionByValue('answerTypeId', '3')

    await this.form.fillInput('minValueWarning', '4')
    await this.form.fillInput('maxValueWarning', '3')
    await this.form.fillInput('minValueError', '2')
    await this.form.fillInput('maxValueError', '1')

    await this.form.nextStep()

    await this.checkTextIsVisible('Warning message if below range is required')
    await this.checkTextIsVisible('System is required')

    await this.form.fillInput('label', 'test label')
    await this.form.selectOptionByValue('system', 'respiratory_circulation')

    await this.form.fillTextarea('minMessageWarning', 'test minMessageWarning')
    await this.form.fillTextarea('maxMessageWarning', 'test maxMessageWarning')
    await this.form.fillTextarea('minMessageError', 'test minMessageError')
    await this.form.fillTextarea('maxMessageError', 'test maxMessageError')

    await this.form.nextStep()

    await this.checkTextIsVisible(
      'The values you entered in the validation ranges seem incorrect. Please check the values again.'
    )

    await this.form.fillInput('minValueWarning', '5')
    await this.form.fillInput('maxValueWarning', '5')
    await this.form.fillInput('minValueError', '5')
    await this.form.fillInput('maxValueError', '5')

    await this.form.fillTextarea('minMessageWarning', 'test minMessageWarning')
    await this.form.fillTextarea('maxMessageWarning', 'test maxMessageWarning')
    await this.form.fillTextarea('minMessageError', 'test minMessageError')
    await this.form.fillTextarea('maxMessageError', 'test maxMessageError')

    // Go to answers step
    await this.form.nextStep()
  }

  private validateAnswerStep = async () => {
    await this.form.selectOptionByValue('type', 'PhysicalExam')
    await this.form.selectOptionByValue('answerTypeId', '3')

    await this.form.fillInput('label', 'test variable')
    await this.form.selectOptionByValue('system', 'respiratory_circulation')

    await this.form.nextStep()

    // Trigger default answer validation
    await this.form.nextStep()

    await this.checkTextIsVisible('Answers field must have at least 1 items')

    await this.clickElementByTestId('add-answer')

    await expect(
      await this.form.getInput('answersAttributes[0].label')
    ).toBeVisible()

    await expect(
      await this.form.getSelect('answersAttributes[0].operator')
    ).toBeVisible()

    await expect(
      await this.form.getInput('answersAttributes[0].value')
    ).toBeVisible()

    await this.form.nextStep()

    await this.checkTextIsVisible('Label is required')
    await this.checkTextIsVisible('Operator is required')
    await this.checkTextIsVisible('Value is required')

    await this.clickElementByTestId('delete-answer-0')
    await expect(
      await this.form.getInput('answersAttributes[0].label')
    ).not.toBeVisible()
    await expect(
      await this.form.getSelect('answersAttributes[0].operator')
    ).not.toBeVisible()
    await expect(
      await this.form.getInput('answersAttributes[0].value')
    ).not.toBeVisible()

    await this.clickElementByTestId('add-answer')
    await this.form.fillInput('answersAttributes[0].label', 'test')
    await this.form.selectOptionByValue('answersAttributes[0].operator', 'less')
    await this.form.fillInput('answersAttributes[0].value', '5')
    await this.form.nextStep()
    await this.checkTextIsVisible(
      'One (and only one) answer required with the GREATER THAN OR EQUAL TO operator in order to close your range.'
    )

    await this.clickElementByTestId('add-answer')
    await this.form.fillInput('answersAttributes[1].label', 'test')
    await this.form.selectOptionByValue(
      'answersAttributes[1].operator',
      'more_or_equal'
    )
    await this.form.fillInput('answersAttributes[1].value', '6')
    await this.form.nextStep()
    await this.checkTextIsVisible(
      'The value for the LESS THAN operator must be equal to the value for the GREATER THAN OR EQUAL operator.'
    )

    await this.clickElementByTestId('add-answer')
    await this.form.fillInput('answersAttributes[2].label', 'test')
    await this.form.selectOptionByValue(
      'answersAttributes[2].operator',
      'between'
    )
    await this.form.fillInput('answersAttributes[2].startValue', '6')
    await this.form.fillInput('answersAttributes[2].endValue', '6')
    await this.form.nextStep()
    await this.checkTextIsVisible(
      'The smallest value in your answers with the BETWEEN operator has to be equal to the answer with the LESS THAN operator.'
    )

    await this.form.fillInput('answersAttributes[1].value', '2')

    await this.form.nextStep()
    await this.checkTextIsVisible(
      "Your answer with the LESS THAN operator can't be greater than your answer with the GREATER THAN OR EQUAL operator."
    )

    await this.form.previousStep()
    await this.form.selectOptionByValue('answerTypeId', '4')

    await this.form.nextStep()
    await this.form.nextStep()

    await this.checkTextIsVisible('Answers field must have at least 1 items')
  }

  private skipAnswerStep = async () => {
    await this.form.selectOptionByValue('type', 'PhysicalExam')
    await this.form.selectOptionByValue('answerTypeId', '7')
    await this.form.fillInput('label', 'test label')
    await this.form.selectOptionByValue('system', 'respiratory_circulation')

    await this.form.nextStep()
    await this.checkTextIsVisible('Media upload')
    await this.checkTextIsVisible(
      'Drag and drop your files, or click to select a file'
    )
  }

  private createVariableWithLabelAnswers = async () => {
    await this.form.selectOptionByValue('type', 'PhysicalExam')
    await this.form.selectOptionByValue('answerTypeId', '2')
    await this.form.fillInput('label', 'variable with label as answers')
    await this.form.selectOptionByValue('system', 'respiratory_circulation')

    await this.form.nextStep()

    await this.clickElementByTestId('add-answer')
    await this.form.fillInput(
      'answersAttributes[0].label',
      'Only label displayed'
    )

    await this.form.nextStep()
    await this.form.submitForm()
    await this.checkTextIsVisible('Saved successfully')
  }

  private createVariableWithLabelAndValueAnswers = async () => {
    await this.form.selectOptionByValue('type', 'VitalSignAnthropometric')
    await this.form.fillInput(
      'label',
      'variable with label and value as answers'
    )
    await this.form.selectOptionByValue('system', 'respiratory_circulation')
    await expect(await this.form.getCheckbox('isUnavailable')).toBeVisible()
    await this.context.page.getByText('Variable can be not feasible').click()

    await this.form.nextStep()

    await this.clickElementByTestId('add-answer')
    await this.form.fillInput(
      'answersAttributes[0].label',
      'Only label displayed'
    )
    await this.form.fillInput(
      'answersAttributes[0].value',
      'Only label and value displayed'
    )

    await this.form.nextStep()
    await this.form.submitForm()
    await this.checkTextIsVisible('Saved successfully')
  }

  private createVariableWithBooleanAnswers = async () => {
    await this.form.selectOptionByValue('type', 'ComplaintCategory')
    await this.form.fillInput('label', 'variable with boolean answer type')

    await this.form.nextStep()
    await this.form.submitForm()
    await expect(
      await this.context.page.getByText('Saved successfully').last()
    ).toBeVisible()
  }

  private createVariableWithDecimalAnswers = async () => {
    await this.form.selectOptionByValue('type', 'Demographic')
    await this.form.selectOptionByValue('answerTypeId', '4')
    await this.form.fillInput('label', 'variable with decimal answer type')

    await this.form.nextStep()

    await this.clickElementByTestId('add-answer')
    await this.form.fillInput('answersAttributes[0].label', 'test')
    await this.form.selectOptionByValue('answersAttributes[0].operator', 'less')
    await this.form.fillInput('answersAttributes[0].value', '1')

    await this.clickElementByTestId('add-answer')
    await this.form.fillInput('answersAttributes[1].label', 'test')
    await this.form.selectOptionByValue(
      'answersAttributes[1].operator',
      'between'
    )
    await this.form.fillInput('answersAttributes[1].startValue', '1')
    await this.form.fillInput('answersAttributes[1].endValue', '8')

    await this.clickElementByTestId('add-answer')
    await this.form.fillInput('answersAttributes[2].label', 'test')
    await this.form.selectOptionByValue(
      'answersAttributes[2].operator',
      'more_or_equal'
    )
    await this.form.fillInput('answersAttributes[2].value', '8')

    await this.form.nextStep()

    await this.form.submitForm()
    await expect(
      await this.context.page.getByText('Saved successfully').last()
    ).toBeVisible()
  }
}
