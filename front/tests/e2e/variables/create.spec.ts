/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/projects/1/library')
  await adminPage.page.getByRole('button', { name: 'Create variable' }).click()
})

test('should check inputs displayed in variable step', async ({
  adminPage,
}) => {
  await expect(
    await adminPage.page.getByText('Variable', { exact: true })
  ).toBeVisible()
  await expect(await adminPage.page.getByText('Answers')).toBeVisible()
  await expect(await adminPage.page.getByText('Medias')).toBeVisible()
  await expect(await adminPage.getSelect('type')).toBeVisible()
  await adminPage.nextStep()
  await expect(
    await adminPage.page.getByText('Category is required')
  ).toBeVisible()

  // TODO : It works until here
  await expect(await adminPage.getSelect('answerTypeId')).toBeVisible()
  await expect(
    await adminPage.page.getByText('Answer type is required')
  ).toBeVisible()
  await expect(await adminPage.getSelect('stage')).toBeVisible()
  await expect(await adminPage.getSelect('emergencyStatus')).toBeVisible()
  await expect(await adminPage.getCheckbox('isMandatory')).toBeVisible()
  await expect(await adminPage.getCheckbox('isNeonat')).toBeVisible()
  await expect(await adminPage.getCheckbox('isIdentifiable')).toBeVisible()

  await expect(await adminPage.getInput('label')).toBeVisible()
  await expect(
    await adminPage.page.getByText('Label is required')
  ).toBeVisible()
  await expect(await adminPage.getByTestId('autocomplete')).toBeVisible()
  await expect(await adminPage.getTextarea('description')).toBeVisible()

  // Update type and check display of new inputs
  await adminPage.selectOptionByValue('type', 'AssessmentTest')
  await expect(await adminPage.getCheckbox('isUnavailable')).toBeVisible()

  // BackgroundCalculation
  await adminPage.selectOptionByValue('type', 'BackgroundCalculation')
  await expect(await adminPage.getInput('formula')).toBeVisible()
  await expect(await adminPage.getByTestId('info-formula')).toBeVisible()
  await expect(await adminPage.getSelect('answerTypeId').inputValue()).toBe('5')
  await expect(await adminPage.getCheckbox('isUnavailable')).not.toBeVisible()

  // Basic demographic
  await adminPage.selectOptionByValue('type', 'BasicDemographic')
  await expect(await adminPage.getCheckbox('isPreFill')).toBeVisible()

  // Basic measurement
  await adminPage.selectOptionByValue('type', 'BasicMeasurement')
  await expect(await adminPage.getSelect('answerTypeId').inputValue()).toBe('4')
  await expect(await adminPage.getCheckbox('isUnavailable')).toBeVisible()
  await expect(await adminPage.getCheckbox('isEstimable')).toBeVisible()
  await expect(await adminPage.getInput('placeholder')).toBeVisible()
  await expect(await adminPage.getSelect('round')).toBeVisible()
  await adminPage.fillInput('minValueWarning', '5')
  await expect(await adminPage.getTextarea('minMessageWarning')).toBeVisible()
  await expect(
    await adminPage.getTextarea('minMessageWarning')
  ).toHaveAttribute('required', '')
  await adminPage.fillInput('minValueWarning', '')
  await expect(
    await adminPage.getTextarea('minMessageWarning')
  ).not.toBeVisible()
  await adminPage.fillInput('maxValueWarning', '5')
  await expect(await adminPage.getTextarea('maxMessageWarning')).toBeVisible()
  await expect(
    await adminPage.getTextarea('maxMessageWarning')
  ).toHaveAttribute('required', '')
  await adminPage.fillInput('maxValueWarning', '')
  await expect(
    await adminPage.getTextarea('maxMessageWarning')
  ).not.toBeVisible()
  await adminPage.fillInput('minValueError', '5')
  await expect(await adminPage.getTextarea('minMessageError')).toBeVisible()
  await expect(await adminPage.getTextarea('minMessageError')).toHaveAttribute(
    'required',
    ''
  )
  await adminPage.fillInput('minValueError', '')
  await expect(await adminPage.getTextarea('minMessageError')).not.toBeVisible()
  await adminPage.fillInput('maxValueError', '5')
  await expect(await adminPage.getTextarea('maxMessageError')).toBeVisible()
  await expect(await adminPage.getTextarea('maxMessageError')).toHaveAttribute(
    'required',
    ''
  )
  await adminPage.fillInput('maxValueError', '')
  await expect(await adminPage.getTextarea('maxMessageError')).not.toBeVisible()

  // Complaint category
  await adminPage.selectOptionByValue('type', 'ComplaintCategory')
  await expect(await adminPage.getSelect('answerTypeId').inputValue()).toBe('1')
  await expect(await adminPage.getInput('minValueWarning')).not.toBeVisible()
  await expect(await adminPage.getInput('maxValueWarning')).not.toBeVisible()
  await expect(await adminPage.getInput('minValueError')).not.toBeVisible()
  await expect(await adminPage.getInput('maxValueError')).not.toBeVisible()
  await expect(await adminPage.getByTestId('autocomplete')).not.toBeVisible()

  // Exposure
  await adminPage.selectOptionByValue('type', 'Exposure')
  await expect(await adminPage.getSelect('system')).toBeVisible()
  await expect(await adminPage.getSelect('system')).toHaveAttribute(
    'required',
    ''
  )
  await expect(
    await adminPage.optionExistsInSelect('system', 'priority_sign')
  ).toBeTruthy()
})

test('should validate variable step', async ({ adminPage }) => {
  await adminPage.nextStep()
  await expect(adminPage.page.getByText('Category is required')).toBeVisible()
  await expect(adminPage.page.getByText('Label is required')).toBeVisible()

  await adminPage.selectOptionByValue('type', 'PhysicalExam')
  await adminPage.selectOptionByValue('answerTypeId', '3')

  await adminPage.fillInput('minValueWarning', '4')
  await adminPage.fillInput('maxValueWarning', '3')
  await adminPage.fillInput('minValueError', '2')
  await adminPage.fillInput('maxValueError', '1')

  await adminPage.nextStep()

  await expect(
    adminPage.page.getByText('Warning message if below range is required')
  ).toBeVisible()
  await expect(adminPage.page.getByText('System is required')).toBeVisible()

  await adminPage.fillInput('label', 'test label')
  await adminPage.selectOptionByValue('system', 'respiratory_circulation')

  await adminPage.fillTextarea('minMessageWarning', 'test minMessageWarning')
  await adminPage.fillTextarea('maxMessageWarning', 'test maxMessageWarning')
  await adminPage.fillTextarea('minMessageError', 'test minMessageError')
  await adminPage.fillTextarea('maxMessageError', 'test maxMessageError')

  await adminPage.nextStep()

  await expect(
    await adminPage.page.getByText(
      'The values you entered in the validation ranges seem incorrect. Please check the values again.'
    )
  ).toBeVisible()

  await adminPage.fillInput('minValueWarning', '5')
  await adminPage.fillInput('maxValueWarning', '5')
  await adminPage.fillInput('minValueError', '5')
  await adminPage.fillInput('maxValueError', '5')

  await adminPage.fillTextarea('minMessageWarning', 'test minMessageWarning')
  await adminPage.fillTextarea('maxMessageWarning', 'test maxMessageWarning')
  await adminPage.fillTextarea('minMessageError', 'test minMessageError')
  await adminPage.fillTextarea('maxMessageError', 'test maxMessageError')

  // Go to answers step
  await adminPage.nextStep()
})

test('should validate answer step', async ({ adminPage }) => {
  await adminPage.selectOptionByValue('type', 'PhysicalExam')
  await adminPage.selectOptionByValue('answerTypeId', '3')

  await adminPage.fillInput('label', 'test variable')
  await adminPage.selectOptionByValue('system', 'respiratory_circulation')

  await adminPage.nextStep()

  // Trigger default answer validation
  await adminPage.nextStep()

  await expect(
    await adminPage.page.getByText('Answers field must have at least 1 items')
  ).toBeVisible()

  await adminPage.getByTestId('add-answer').click()

  await expect(
    await adminPage.getInput('answersAttributes[0].label')
  ).toBeVisible()
  await expect(
    await adminPage.getInput('answersAttributes[0].label')
  ).toHaveAttribute('required', '')
  await expect(
    await adminPage.getSelect('answersAttributes[0].operator')
  ).toBeVisible()
  await expect(
    await adminPage.getSelect('answersAttributes[0].operator')
  ).toHaveAttribute('required', '')
  await expect(
    await adminPage.getInput('answersAttributes[0].value')
  ).toBeVisible()
  await expect(
    await adminPage.getInput('answersAttributes[0].value')
  ).toHaveAttribute('required', '')

  await adminPage.getByTestId('delete-answer-0').click()
  await expect(
    await adminPage.getInput('answersAttributes[0].label')
  ).not.toBeVisible()
  await expect(
    await adminPage.getSelect('answersAttributes[0].operator')
  ).not.toBeVisible()
  await expect(
    await adminPage.getInput('answersAttributes[0].value')
  ).not.toBeVisible()

  await adminPage.getByTestId('add-answer').click()
  await adminPage.fillInput('answersAttributes[0].label', 'test')
  await adminPage.selectOptionByValue('answersAttributes[0].operator', 'less')
  await adminPage.fillInput('answersAttributes[0].value', '5')
  await adminPage.nextStep()
  await expect(
    await adminPage.page.getByText(
      'One (and only one) answer required with the GREATER THAN OR EQUAL TO operator in order to close your range.'
    )
  ).toBeVisible()

  await adminPage.getByTestId('add-answer').click()
  await adminPage.fillInput('answersAttributes[1].label', 'test')
  await adminPage.selectOptionByValue(
    'answersAttributes[1].operator',
    'more_or_equal'
  )
  await adminPage.fillInput('answersAttributes[1].value', '6')
  await adminPage.nextStep()
  await expect(
    await adminPage.page.getByText(
      'The value for the LESS THAN operator must be equal to the value for the GREATER THAN OR EQUAL operator.'
    )
  ).toBeVisible()

  await adminPage.getByTestId('add-answer').click()
  await adminPage.fillInput('answersAttributes[2].label', 'test')
  await adminPage.selectOptionByValue(
    'answersAttributes[2].operator',
    'between'
  )
  await adminPage.fillInput('answersAttributes[2].startValue', '6')
  await adminPage.fillInput('answersAttributes[2].endValue', '6')
  await adminPage.nextStep()
  await expect(
    await adminPage.page.getByText(
      'The smallest value in your answers with the BETWEEN operator has to be equal to the answer with the LESS THAN operator.'
    )
  ).toBeVisible()

  await adminPage.fillInput('answersAttributes[1].value', '2')

  await adminPage.nextStep()
  await expect(
    await adminPage.page.getByText(
      "Your answer with the LESS THAN operator can't be greater than your answer with the GREATER THAN OR EQUAL operator."
    )
  ).toBeVisible()

  await adminPage.previousStep()
  await adminPage.selectOptionByValue('answerTypeId', '4')

  await adminPage.nextStep()
  await adminPage.nextStep()

  await expect(
    await adminPage.page.getByText('Answers field must have at least 1 items')
  ).toBeVisible()
})

test('should skip answer step', async ({ adminPage }) => {
  await adminPage.selectOptionByValue('type', 'PhysicalExam')
  await adminPage.selectOptionByValue('answerTypeId', '7')
  await adminPage.fillInput('label', 'test label')
  await adminPage.selectOptionByValue('system', 'respiratory_circulation')

  await adminPage.nextStep()
  await expect(await adminPage.page.getByText('Media upload')).toBeVisible()
  await expect(
    await adminPage.page.getByText(
      'Drag and drop your files, or click to select a file'
    )
  ).toBeVisible()
})

test('should create a variable with label as answers', async ({
  adminPage,
}) => {
  await adminPage.selectOptionByValue('type', 'PhysicalExam')
  await adminPage.selectOptionByValue('answerTypeId', '2')
  await adminPage.fillInput('label', 'riable with label as answers')
  await adminPage.selectOptionByValue('system', 'respiratory_circulation')

  await adminPage.nextStep()

  await adminPage.getByTestId('add-answer').click()
  await adminPage.fillInput(
    'answersAttributes[0].label',
    'Only label displayed'
  )

  await adminPage.nextStep()
  await adminPage.submitForm()
  await expect(
    await adminPage.page.getByText('Saved successfully')
  ).toBeVisible()
})

test('should create a variable with label and value as answers', async ({
  adminPage,
}) => {
  await adminPage.selectOptionByValue('type', 'VitalSignAnthropometric')
  await adminPage.fillInput('label', 'variable with label and value as answers')
  await adminPage.selectOptionByValue('system', 'respiratory_circulation')
  await expect(await adminPage.getCheckbox('isUnavailable')).toBeVisible()
  await adminPage.page.getByText('Variable can be not feasible').click()

  await adminPage.nextStep()

  await adminPage.getByTestId('add-answer').click()
  await adminPage.fillInput(
    'answersAttributes[0].label',
    'Only label displayed'
  )
  await adminPage.fillInput(
    'answersAttributes[0].value',
    'Only label and value displayed'
  )

  await adminPage.nextStep()
  await adminPage.submitForm()
  await expect(
    await adminPage.page.getByText('Saved successfully')
  ).toBeVisible()
})

test('should create a variable with boolean answer type', async ({
  adminPage,
}) => {
  await adminPage.selectOptionByValue('type', 'ComplaintCategory')
  await adminPage.fillInput('label', 'variable with boolean answer type')

  await adminPage.nextStep()
  await adminPage.submitForm()
  await expect(
    await adminPage.page.getByText('Saved successfully')
  ).toBeVisible()
})

test('should create a variable with decimal answer type', async ({
  adminPage,
}) => {
  await adminPage.selectOptionByValue('type', 'Demographic')
  await adminPage.selectOptionByValue('answerTypeId', '4')
  await adminPage.fillInput('label', 'variable with decimal answer type')

  await adminPage.nextStep()

  await adminPage.getByTestId('add-answer').click()
  await adminPage.fillInput('answersAttributes[0].label', 'test')
  await adminPage.selectOptionByValue('answersAttributes[0].operator', 'less')
  await adminPage.fillInput('answersAttributes[0].value', '1')

  await adminPage.getByTestId('add-answer').click()
  await adminPage.fillInput('answersAttributes[1].label', 'test')
  await adminPage.selectOptionByValue(
    'answersAttributes[1].operator',
    'between'
  )
  await adminPage.fillInput('answersAttributes[1].startValue', '1')
  await adminPage.fillInput('answersAttributes[1].endValue', '8')

  await adminPage.getByTestId('add-answer').click()
  await adminPage.fillInput('answersAttributes[2].label', 'test')
  await adminPage.selectOptionByValue(
    'answersAttributes[2].operator',
    'more_or_equal'
  )
  await adminPage.fillInput('answersAttributes[2].value', '8')

  await adminPage.nextStep()

  await adminPage.submitForm()
  await expect(
    await adminPage.page.getByText('Saved successfully')
  ).toBeVisible()
})
