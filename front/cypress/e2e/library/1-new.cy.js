/* eslint-disable no-undef */
describe('Variables page', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_library').click()
  })

  // it('should open the create modal for a variable and display inputs', () => {
  //   cy.getByDataCy('create_variable').click()
  //   cy.getByDataCy('modal').within(() => {
  //     cy.contains('Variable').should('exist')
  //     cy.contains('Answers').should('exist')
  //     cy.contains('Medias').should('exist')

  //     cy.getSelect('type').should('exist').should('have.attr', 'required')
  //     cy.getSelect('answerType').should('exist').should('have.attr', 'required')
  //     cy.getSelect('stage').should('exist')
  //     cy.getSelect('emergencyStatus').should('exist')
  //     cy.getByForm('checkbox', 'isMandatory').should('exist')
  //     cy.getByForm('checkbox', 'isNeonat').should('exist')
  //     cy.getByForm('checkbox', 'isIdentifiable').should('exist')
  //     cy.getByForm('text', 'label')
  //       .should('exist')
  //       .should('have.attr', 'required')
  //     cy.getByDataCy('autocomplete').should('exist')
  //     cy.getTextArea('description').should('exist')

  //     // Update type and check display of new inputs
  //     cy.getSelect('type').select('Variables::AssessmentTest')
  //     cy.getByForm('checkbox', 'isUnavailable').should('exist')

  //     cy.getSelect('type').select('Variables::BackgroundCalculation')
  //     cy.getByForm('text', 'formula').should('exist')
  //     cy.getByDataCy('info-formula').should('exist')
  //     cy.getSelect('answerType').should('have.value', '5')
  //     cy.getByForm('checkbox', 'isUnavailable').should('not.exist')

  //     cy.getSelect('type').select('Variables::BasicDemographic')
  //     cy.getByForm('checkbox', 'isPreFill').should('exist')

  //     cy.getSelect('type').select('Variables::BasicMeasurement')
  //     cy.getSelect('answerType').should('have.value', '4')
  //     cy.getByForm('checkbox', 'isUnavailable').should('exist')
  //     cy.getByForm('checkbox', 'isEstimable').should('exist')
  //     cy.getByForm('text', 'placeholder').should('exist')
  //     cy.getSelect('round').should('exist')
  //     cy.getByForm('text', 'minValueWarning').clear().type('5')
  //     cy.getTextArea('minMessageWarning')
  //       .should('exist')
  //       .should('have.attr', 'required')
  //     cy.getByForm('text', 'minValueWarning').clear()
  //     cy.getTextArea('minMessageWarning').should('not.exist')
  //     cy.getByForm('text', 'maxValueWarning').clear().type('5')
  //     cy.getTextArea('maxMessageWarning')
  //       .should('exist')
  //       .should('have.attr', 'required')
  //     cy.getByForm('text', 'maxValueWarning').clear()
  //     cy.getTextArea('maxMessageWarning').should('not.exist')
  //     cy.getByForm('text', 'minValueError').clear().type('5')
  //     cy.getTextArea('minMessageError')
  //       .should('exist')
  //       .should('have.attr', 'required')
  //     cy.getByForm('text', 'minValueError').clear()
  //     cy.getTextArea('minMessageError').should('not.exist')
  //     cy.getByForm('text', 'maxValueError').clear().type('5')
  //     cy.getTextArea('maxMessageError')
  //       .should('exist')
  //       .should('have.attr', 'required')
  //     cy.getByForm('text', 'maxValueError').clear()
  //     cy.getTextArea('maxMessageError').should('not.exist')

  //     cy.getSelect('type').select('Variables::ComplaintCategory')
  //     cy.getSelect('answerType').should('have.value', '1')
  //     cy.getByForm('text', 'minValueWarning').should('not.exist')
  //     cy.getByForm('text', 'maxValueWarning').should('not.exist')
  //     cy.getByForm('text', 'minValueError').should('not.exist')
  //     cy.getByForm('text', 'maxValueError').should('not.exist')
  //     cy.getByForm('text', 'maxValueError').should('not.exist')
  //     cy.getByDataCy('autocomplete').should('not.exist')

  //     cy.getSelect('type').select('Variables::Exposure')
  //     cy.getSelect('system').should('exist').should('have.attr', 'required')
  //     cy.getSelect('system')
  //       .children('option')
  //       .then(options => {
  //         const actual = [...options].map(o => o.value)
  //         expect(actual).to.include('priority_sign')
  //       })

  //     cy.getSelect('type').select('Variables::PhysicalExam')
  //     cy.getSelect('system').should('exist').should('have.attr', 'required')
  //     cy.getSelect('system')
  //       .children('option')
  //       .then(options => {
  //         const actual = [...options].map(o => o.value)
  //         expect(actual).to.not.include('priority_sign')
  //       })
  //   })
  // })

  // it('should validate variable step', () => {
  //   cy.getByDataCy('create_variable').click()
  //   cy.getByDataCy('modal').within(() => {
  //     cy.getByDataCy('next').click()

  //     cy.contains('Category is required').should('exist')
  //     cy.contains('Label is required').should('exist')

  //     cy.getSelect('type').select('Variables::PhysicalExam')
  //     cy.getSelect('answerType').select('3')

  //     cy.getByForm('text', 'minValueWarning').clear().type('4')
  //     cy.getByForm('text', 'maxValueWarning').clear().type('3')
  //     cy.getByForm('text', 'minValueError').clear().type('2')
  //     cy.getByForm('text', 'maxValueError').clear().type('1')

  //     cy.getByDataCy('next').click()

  //     cy.contains('Warning message if below range is required').should('exist')
  //     cy.contains('System is required').should('exist')

  //     cy.getByForm('text', 'label').clear().type('test label')
  //     cy.getSelect('system').select('respiratory_circulation')

  //     cy.getTextArea('minMessageWarning').clear().type('test minMessageWarning')
  //     cy.getTextArea('maxMessageWarning').clear().type('test maxMessageWarning')
  //     cy.getTextArea('minMessageError').clear().type('test minMessageError')
  //     cy.getTextArea('maxMessageError').clear().type('test maxMessageError')

  //     cy.getByDataCy('next').click()

  //     cy.contains(
  //       'The values you entered in the validation ranges seem incorrect. Please check the values again.'
  //     ).should('exist')

  //     cy.getByForm('text', 'minValueWarning').clear().type('5')
  //     cy.getByForm('text', 'maxValueWarning').clear().type('5')
  //     cy.getByForm('text', 'minValueError').clear().type('5')
  //     cy.getByForm('text', 'maxValueError').clear().type('5')

  //     cy.getTextArea('minMessageWarning').clear().type('test minMessageWarning')
  //     cy.getTextArea('maxMessageWarning').clear().type('test maxMessageWarning')
  //     cy.getTextArea('minMessageError').clear().type('test minMessageError')
  //     cy.getTextArea('maxMessageError').clear().type('test maxMessageError')

  //     // Go to answers step
  //     cy.getByDataCy('next').click()

  //     // Trigger default answer validation
  //     cy.getByDataCy('next').click()
  //     cy.contains('Answers field must have at least 1 items').should('exist')

  //     cy.getByDataCy('add_answer').click()

  //     cy.getByForm('text', 'answersAttributes[0].label')
  //       .should('exist')
  //       .should('have.attr', 'required')

  //     cy.getSelect('answersAttributes[0].operator')
  //       .should('exist')
  //       .should('have.attr', 'required')

  //     cy.getByForm('text', 'answersAttributes[0].value')
  //       .should('exist')
  //       .should('have.attr', 'required')
  //   })

  it('should validate answers step', () => {
    cy.getByDataCy('create_variable').click()
    cy.getByDataCy('modal').within(() => {
      cy.getSelect('type').select('Variables::PhysicalExam')
      cy.getSelect('answerType').select('3')
      cy.getByForm('text', 'label').clear().type('test label')
      cy.getSelect('system').select('respiratory_circulation')

      cy.getByDataCy('next').click()

      // Trigger default answer validation
      cy.getByDataCy('next').click()
      cy.contains('Answers field must have at least 1 items').should('exist')

      cy.getByDataCy('add_answer').click()

      cy.getByForm('text', '"answersAttributes[0].label"')
        .should('exist')
        .should('have.attr', 'required')
      cy.getSelect('"answersAttributes[0].operator"')
        .should('exist')
        .should('have.attr', 'required')
      cy.getByForm('text', '"answersAttributes[0].value"')
        .should('exist')
        .should('have.attr', 'required')

      cy.getByDataCy('"delete_answer_0"').click()
      cy.getByForm('text', '"answersAttributes[0].label"').should('not.exist')
      cy.getSelect('"answersAttributes[0].operator"').should('not.exist')
      cy.getByForm('text', '"answersAttributes[0].value"').should('not.exist')

      cy.getByDataCy('add_answer').click()
      cy.getByForm('text', '"answersAttributes[0].label"').clear().type('test')
      cy.getSelect('"answersAttributes[0].operator"').select('less')
      cy.getByForm('text', '"answersAttributes[0].value"').clear().type('5')
      cy.getByDataCy('next').click()

      cy.contains(
        'One (and only one) answer required with the GREATER THAN OR EQUAL TO operator in order to close your range.'
      ).should('exist')

      // ADD TEST FOR GREATER THAN OR EQUAL TO
    })
  })
})
