/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminContext }) => {
  await adminContext.page.goto('/projects/1/library')
  await adminContext.page
    .getByRole('button', { name: 'Create variable' })
    .click()
})

test('should check inputs displayed in variable step', async ({
  adminContext,
}) => {
  await expect(
    await adminContext.page.getByText('Variable', { exact: true })
  ).toBeVisible()
  await expect(
    await adminContext.page.getByRole('heading', { name: 'Answers' })
  ).toBeVisible()
  await expect(await adminContext.page.getByText('Medias')).toBeVisible()
  await expect(await adminContext.getSelect('type')).toBeVisible()
  await adminContext.nextStep()
  await expect(
    await adminContext.page.getByText('Category is required')
  ).toBeVisible()

  await expect(await adminContext.getSelect('answerTypeId')).toBeVisible()
  await expect(
    await adminContext.page.getByText('Answer type is required')
  ).toBeVisible()
  await expect(await adminContext.getSelect('stage')).toBeVisible()
  await expect(await adminContext.getSelect('emergencyStatus')).toBeVisible()
  await expect(await adminContext.getCheckbox('isMandatory')).toBeVisible()
  await expect(await adminContext.getCheckbox('isNeonat')).toBeVisible()
  await expect(await adminContext.getCheckbox('isIdentifiable')).toBeVisible()

  await expect(await adminContext.getInput('label')).toBeVisible()
  await expect(
    await adminContext.page.getByText('Label is required')
  ).toBeVisible()
  await expect(await adminContext.getByTestId('autocomplete')).toBeVisible()
  await expect(await adminContext.getTextarea('description')).toBeVisible()

  // Update type and check display of new inputs
  await adminContext.selectOptionByValue('type', 'AssessmentTest')
  await expect(await adminContext.getCheckbox('isUnavailable')).toBeVisible()

  // BackgroundCalculation
  await adminContext.selectOptionByValue('type', 'BackgroundCalculation')
  await expect(await adminContext.getInput('formula')).toBeVisible()
  await expect(await adminContext.getByTestId('info-formula')).toBeVisible()
  await expect(await adminContext.getSelect('answerTypeId').inputValue()).toBe(
    '5'
  )
  await expect(
    await adminContext.getCheckbox('isUnavailable')
  ).not.toBeVisible()

  // Basic demographic
  await adminContext.selectOptionByValue('type', 'BasicDemographic')
  await expect(await adminContext.getCheckbox('isPreFill')).toBeVisible()

  // Basic measurement
  await adminContext.selectOptionByValue('type', 'BasicMeasurement')
  await expect(await adminContext.getSelect('answerTypeId').inputValue()).toBe(
    '4'
  )
  await expect(await adminContext.getCheckbox('isUnavailable')).toBeVisible()
  await expect(await adminContext.getCheckbox('isEstimable')).toBeVisible()
  await expect(await adminContext.getInput('placeholder')).toBeVisible()
  await expect(await adminContext.getSelect('round')).toBeVisible()
  await adminContext.fillInput('minValueWarning', '5')
  await adminContext.fillInput('maxValueWarning', '5')
  await adminContext.fillInput('minValueError', '5')
  await adminContext.fillInput('maxValueError', '5')
  await adminContext.nextStep()
  await expect(
    await adminContext.page.getByText(
      'Warning message if below range is required'
    )
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText(
      'Warning message if above range is required'
    )
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText(
      'Error message if below range is required'
    )
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText(
      'Error message if above range is required'
    )
  ).toBeVisible()

  await expect(
    await adminContext.getTextarea('minMessageWarning')
  ).toBeVisible()

  await adminContext.fillInput('minValueWarning', '')
  await expect(
    await adminContext.getTextarea('minMessageWarning')
  ).not.toBeVisible()

  await expect(
    await adminContext.getTextarea('maxMessageWarning')
  ).toBeVisible()
  await adminContext.fillInput('maxValueWarning', '')
  await expect(
    await adminContext.getTextarea('maxMessageWarning')
  ).not.toBeVisible()

  await expect(await adminContext.getTextarea('minMessageError')).toBeVisible()
  await adminContext.fillInput('minValueError', '')
  await expect(
    await adminContext.getTextarea('minMessageError')
  ).not.toBeVisible()
  await expect(await adminContext.getTextarea('maxMessageError')).toBeVisible()
  await adminContext.fillInput('maxValueError', '')
  await expect(
    await adminContext.getTextarea('maxMessageError')
  ).not.toBeVisible()

  // Complaint category
  await adminContext.selectOptionByValue('type', 'ComplaintCategory')
  await expect(await adminContext.getSelect('answerTypeId').inputValue()).toBe(
    '1'
  )
  await expect(await adminContext.getInput('minValueWarning')).not.toBeVisible()
  await expect(await adminContext.getInput('maxValueWarning')).not.toBeVisible()
  await expect(await adminContext.getInput('minValueError')).not.toBeVisible()
  await expect(await adminContext.getInput('maxValueError')).not.toBeVisible()
  await expect(await adminContext.getByTestId('autocomplete')).not.toBeVisible()

  // Exposure
  await adminContext.selectOptionByValue('type', 'Exposure')
  await expect(await adminContext.getSelect('system')).toBeVisible()

  await adminContext.nextStep()
  await expect(
    await adminContext.page.getByText('System is required')
  ).toBeVisible()

  await expect(
    await adminContext.optionExistsInSelect('system', 'priority_sign')
  ).toBeTruthy()
})

test('should validate variable step', async ({ adminContext }) => {
  await adminContext.nextStep()
  await expect(
    adminContext.page.getByText('Category is required')
  ).toBeVisible()
  await expect(adminContext.page.getByText('Label is required')).toBeVisible()

  await adminContext.selectOptionByValue('type', 'PhysicalExam')
  await adminContext.selectOptionByValue('answerTypeId', '3')

  await adminContext.fillInput('minValueWarning', '4')
  await adminContext.fillInput('maxValueWarning', '3')
  await adminContext.fillInput('minValueError', '2')
  await adminContext.fillInput('maxValueError', '1')

  await adminContext.nextStep()

  await expect(
    adminContext.page.getByText('Warning message if below range is required')
  ).toBeVisible()
  await expect(adminContext.page.getByText('System is required')).toBeVisible()

  await adminContext.fillInput('label', 'test label')
  await adminContext.selectOptionByValue('system', 'respiratory_circulation')

  await adminContext.fillTextarea('minMessageWarning', 'test minMessageWarning')
  await adminContext.fillTextarea('maxMessageWarning', 'test maxMessageWarning')
  await adminContext.fillTextarea('minMessageError', 'test minMessageError')
  await adminContext.fillTextarea('maxMessageError', 'test maxMessageError')

  await adminContext.nextStep()

  await expect(
    await adminContext.page.getByText(
      'The values you entered in the validation ranges seem incorrect. Please check the values again.'
    )
  ).toBeVisible()

  await adminContext.fillInput('minValueWarning', '5')
  await adminContext.fillInput('maxValueWarning', '5')
  await adminContext.fillInput('minValueError', '5')
  await adminContext.fillInput('maxValueError', '5')

  await adminContext.fillTextarea('minMessageWarning', 'test minMessageWarning')
  await adminContext.fillTextarea('maxMessageWarning', 'test maxMessageWarning')
  await adminContext.fillTextarea('minMessageError', 'test minMessageError')
  await adminContext.fillTextarea('maxMessageError', 'test maxMessageError')

  // Go to answers step
  await adminContext.nextStep()
})

test('should validate answer step', async ({ adminContext }) => {
  await adminContext.selectOptionByValue('type', 'PhysicalExam')
  await adminContext.selectOptionByValue('answerTypeId', '3')

  await adminContext.fillInput('label', 'test variable')
  await adminContext.selectOptionByValue('system', 'respiratory_circulation')

  await adminContext.nextStep()

  // Trigger default answer validation
  await adminContext.nextStep()

  await expect(
    await adminContext.page.getByText(
      'Answers field must have at least 1 items'
    )
  ).toBeVisible()

  await adminContext.getByTestId('add-answer').click()

  await expect(
    await adminContext.getInput('answersAttributes[0].label')
  ).toBeVisible()

  await expect(
    await adminContext.getSelect('answersAttributes[0].operator')
  ).toBeVisible()

  await expect(
    await adminContext.getInput('answersAttributes[0].value')
  ).toBeVisible()

  await adminContext.nextStep()

  await expect(
    await adminContext.page.getByText('Label is required')
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText('Operator is required')
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText('Value is required')
  ).toBeVisible()

  await adminContext.getByTestId('delete-answer-0').click()
  await expect(
    await adminContext.getInput('answersAttributes[0].label')
  ).not.toBeVisible()
  await expect(
    await adminContext.getSelect('answersAttributes[0].operator')
  ).not.toBeVisible()
  await expect(
    await adminContext.getInput('answersAttributes[0].value')
  ).not.toBeVisible()

  await adminContext.getByTestId('add-answer').click()
  await adminContext.fillInput('answersAttributes[0].label', 'test')
  await adminContext.selectOptionByValue(
    'answersAttributes[0].operator',
    'less'
  )
  await adminContext.fillInput('answersAttributes[0].value', '5')
  await adminContext.nextStep()
  await expect(
    await adminContext.page.getByText(
      'One (and only one) answer required with the GREATER THAN OR EQUAL TO operator in order to close your range.'
    )
  ).toBeVisible()

  await adminContext.getByTestId('add-answer').click()
  await adminContext.fillInput('answersAttributes[1].label', 'test')
  await adminContext.selectOptionByValue(
    'answersAttributes[1].operator',
    'more_or_equal'
  )
  await adminContext.fillInput('answersAttributes[1].value', '6')
  await adminContext.nextStep()
  await expect(
    await adminContext.page.getByText(
      'The value for the LESS THAN operator must be equal to the value for the GREATER THAN OR EQUAL operator.'
    )
  ).toBeVisible()

  await adminContext.getByTestId('add-answer').click()
  await adminContext.fillInput('answersAttributes[2].label', 'test')
  await adminContext.selectOptionByValue(
    'answersAttributes[2].operator',
    'between'
  )
  await adminContext.fillInput('answersAttributes[2].startValue', '6')
  await adminContext.fillInput('answersAttributes[2].endValue', '6')
  await adminContext.nextStep()
  await expect(
    await adminContext.page.getByText(
      'The smallest value in your answers with the BETWEEN operator has to be equal to the answer with the LESS THAN operator.'
    )
  ).toBeVisible()

  await adminContext.fillInput('answersAttributes[1].value', '2')

  await adminContext.nextStep()
  await expect(
    await adminContext.page.getByText(
      "Your answer with the LESS THAN operator can't be greater than your answer with the GREATER THAN OR EQUAL operator."
    )
  ).toBeVisible()

  await adminContext.previousStep()
  await adminContext.selectOptionByValue('answerTypeId', '4')

  await adminContext.nextStep()
  await adminContext.nextStep()

  await expect(
    await adminContext.page.getByText(
      'Answers field must have at least 1 items'
    )
  ).toBeVisible()
})

test('should skip answer step', async ({ adminContext }) => {
  await adminContext.selectOptionByValue('type', 'PhysicalExam')
  await adminContext.selectOptionByValue('answerTypeId', '7')
  await adminContext.fillInput('label', 'test label')
  await adminContext.selectOptionByValue('system', 'respiratory_circulation')

  await adminContext.nextStep()
  await expect(await adminContext.page.getByText('Media upload')).toBeVisible()
  await expect(
    await adminContext.page.getByText(
      'Drag and drop your files, or click to select a file'
    )
  ).toBeVisible()
})

test('should create a variable with label as answers', async ({
  adminContext,
}) => {
  await adminContext.selectOptionByValue('type', 'PhysicalExam')
  await adminContext.selectOptionByValue('answerTypeId', '2')
  await adminContext.fillInput('label', 'riable with label as answers')
  await adminContext.selectOptionByValue('system', 'respiratory_circulation')

  await adminContext.nextStep()

  await adminContext.getByTestId('add-answer').click()
  await adminContext.fillInput(
    'answersAttributes[0].label',
    'Only label displayed'
  )

  await adminContext.nextStep()
  await adminContext.submitForm()
  await expect(
    await adminContext.page.getByText('Saved successfully')
  ).toBeVisible()
})

test('should create a variable with label and value as answers', async ({
  adminContext,
}) => {
  await adminContext.selectOptionByValue('type', 'VitalSignAnthropometric')
  await adminContext.fillInput(
    'label',
    'variable with label and value as answers'
  )
  await adminContext.selectOptionByValue('system', 'respiratory_circulation')
  await expect(await adminContext.getCheckbox('isUnavailable')).toBeVisible()
  await adminContext.page.getByText('Variable can be not feasible').click()

  await adminContext.nextStep()

  await adminContext.getByTestId('add-answer').click()
  await adminContext.fillInput(
    'answersAttributes[0].label',
    'Only label displayed'
  )
  await adminContext.fillInput(
    'answersAttributes[0].value',
    'Only label and value displayed'
  )

  await adminContext.nextStep()
  await adminContext.submitForm()
  await expect(
    await adminContext.page.getByText('Saved successfully')
  ).toBeVisible()
})

test('should create a variable with boolean answer type', async ({
  adminContext,
}) => {
  await adminContext.selectOptionByValue('type', 'ComplaintCategory')
  await adminContext.fillInput('label', 'variable with boolean answer type')

  await adminContext.nextStep()
  await adminContext.submitForm()
  await expect(
    await adminContext.page.getByText('Saved successfully')
  ).toBeVisible()
})

test('should create a variable with decimal answer type', async ({
  adminContext,
}) => {
  await adminContext.selectOptionByValue('type', 'Demographic')
  await adminContext.selectOptionByValue('answerTypeId', '4')
  await adminContext.fillInput('label', 'variable with decimal answer type')

  await adminContext.nextStep()

  await adminContext.getByTestId('add-answer').click()
  await adminContext.fillInput('answersAttributes[0].label', 'test')
  await adminContext.selectOptionByValue(
    'answersAttributes[0].operator',
    'less'
  )
  await adminContext.fillInput('answersAttributes[0].value', '1')

  await adminContext.getByTestId('add-answer').click()
  await adminContext.fillInput('answersAttributes[1].label', 'test')
  await adminContext.selectOptionByValue(
    'answersAttributes[1].operator',
    'between'
  )
  await adminContext.fillInput('answersAttributes[1].startValue', '1')
  await adminContext.fillInput('answersAttributes[1].endValue', '8')

  await adminContext.getByTestId('add-answer').click()
  await adminContext.fillInput('answersAttributes[2].label', 'test')
  await adminContext.selectOptionByValue(
    'answersAttributes[2].operator',
    'more_or_equal'
  )
  await adminContext.fillInput('answersAttributes[2].value', '8')

  await adminContext.nextStep()

  await adminContext.submitForm()
  await expect(
    await adminContext.page.getByText('Saved successfully')
  ).toBeVisible()
})
