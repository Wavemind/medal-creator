/* eslint-disable no-undef */
describe('Create drug', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_library').click()
    cy.getByDataCy('subMenu_drugs').click()
  })

  it('should open the create modal for a variable and display inputs', () => {
    cy.getByDataCy('create_drug').click()
    cy.getByDataCy('modal').within(() => {
      cy.contains('Drug').should('exist')
      cy.contains('Formulations').should('exist')

      cy.getByForm('text', 'label')
        .should('exist')
        .should('have.attr', 'required')
      cy.getTextArea('description').should('exist')
      cy.getByForm('checkbox', 'isNeonat').should('exist')
      cy.getByForm('checkbox', 'isAntiMalarial').should('exist')
      cy.getByForm('checkbox', 'isAntibiotic').should('exist')
      cy.getByDataCy('slider').should('exist')
    })
  })

  it('should validate drug form', () => {
    cy.getByDataCy('create_drug').click()
    cy.getByDataCy('modal').within(() => {
      cy.getByDataCy('next').click()
      cy.contains('Label is required').should('exist')

      cy.getByForm('text', 'label').clear().type('test label drug')
      cy.getByDataCy('next').click()

      cy.getByDataCy('submit').click()
      cy.contains('Formulations field must have at least 1 items').should(
        'exist'
      )

      cy.getSelect('medicationForm').select('tablet')
      cy.getByDataCy('add_medication_form').click()
      cy.getByDataCy('formulation-tablet').click()

      cy.getSelect('"formulationsAttributes[0].administrationRouteId"')
        .should('exist')
        .should('have.attr', 'required')
      cy.getByForm('text', '"formulationsAttributes[0].dosesPerDay"')
        .should('exist')
        .should('have.attr', 'required')
      cy.getByForm('checkbox', '"formulationsAttributes[0].byAge"').should(
        'exist'
      )
      cy.getSelect('"formulationsAttributes[0].breakable"')
        .should('exist')
        .should('have.attr', 'required')
      cy.getByForm('text', '"formulationsAttributes[0].uniqueDose"').should(
        'not.exist'
      )
      cy.getByForm(
        'text',
        '"formulationsAttributes[0].liquidConcentration"'
      ).should('not.exist')
      cy.getByForm('text', '"formulationsAttributes[0].doseForm"')
        .should('exist')
        .should('have.attr', 'required')
      cy.getByForm('text', '"formulationsAttributes[0].maximalDose"')
        .should('exist')
        .should('have.attr', 'required')
      cy.getByForm('text', '"formulationsAttributes[0].minimalDosePerKg"')
        .should('exist')
        .should('have.attr', 'required')
      cy.getByForm('text', '"formulationsAttributes[0].maximalDosePerKg"')
        .should('exist')
        .should('have.attr', 'required')

      cy.getTextArea('"formulationsAttributes[0].description"').should('exist')
      cy.getTextArea(
        '"formulationsAttributes[0].injectionInstructions"'
      ).should('not.exist')
      cy.getTextArea(
        '"formulationsAttributes[0].dispensingDescription"'
      ).should('exist')

      cy.getByDataCy('remove-formulations-tablet').click()

      cy.getSelect('medicationForm').select('syrup')
      cy.getByDataCy('add_medication_form').click()
      cy.getByDataCy('formulation-syrup').click()

      cy.getByForm('text', '"formulationsAttributes[0].liquidConcentration"')
        .should('exist')
        .should('have.attr', 'required')

      cy.getByForm('checkbox', '"formulationsAttributes[0].byAge"').check({
        force: true,
      })

      cy.getByForm('text', '"formulationsAttributes[0].uniqueDose"')
        .should('exist')
        .should('have.attr', 'required')

      cy.getByForm('text', '"formulationsAttributes[0].doseForm"').should(
        'not.exist'
      )
      cy.getByForm('text', '"formulationsAttributes[0].maximalDose"').should(
        'not.exist'
      )
      cy.getByForm(
        'text',
        '"formulationsAttributes[0].minimalDosePerKg"'
      ).should('not.exist')
      cy.getByForm(
        'text',
        '"formulationsAttributes[0].maximalDosePerKg"'
      ).should('not.exist')
    })
  })

  it('should create a drug with one tablet formulation', () => {
    cy.getByDataCy('create_drug').click()
    cy.getByDataCy('modal').within(() => {
      cy.getByForm('text', 'label').clear().type('test label drug')
      cy.getByDataCy('next').click()

      cy.getSelect('medicationForm').select('tablet')
      cy.getByDataCy('add_medication_form').click()
      cy.getByDataCy('formulation-tablet').click()

      cy.getSelect('"formulationsAttributes[0].administrationRouteId"').select(
        '1'
      )
      cy.getByForm('text', '"formulationsAttributes[0].dosesPerDay"')
        .clear()
        .type('22')
      cy.getSelect('"formulationsAttributes[0].breakable"').select('two')
      cy.getByForm('text', '"formulationsAttributes[0].doseForm"')
        .clear()
        .type('25')

      cy.getByForm('text', '"formulationsAttributes[0].maximalDose"')
        .clear()
        .type('10')
      cy.getByForm('text', '"formulationsAttributes[0].minimalDosePerKg"')
        .clear()
        .type('25')
      cy.getByForm('text', '"formulationsAttributes[0].maximalDosePerKg"')
        .clear()
        .type('25')

      cy.getByDataCy('submit').click()

      cy.contains('Must be less than maximal daily dose').should('exist')

      cy.getByForm('text', '"formulationsAttributes[0].maximalDosePerKg"')
        .clear()
        .type('10')

      cy.getByDataCy('submit').click()

      cy.contains('Must be less than maximal dose per kg').should('exist')

      cy.getByForm('text', '"formulationsAttributes[0].minimalDosePerKg"')
        .clear()
        .type('5')

      cy.getTextArea('"formulationsAttributes[0].description"')
        .clear()
        .type('one description')
      cy.getTextArea('"formulationsAttributes[0].dispensingDescription"')
        .clear()
        .type('one dispensing description')

      cy.getByDataCy('submit').click()
    })

    cy.contains('Created successfully').should('exist')
  })

  it('should create a drug with one syrup formulation', () => {
    cy.getByDataCy('create_drug').click()
    cy.getByDataCy('modal').within(() => {
      cy.getByForm('text', 'label').clear().type('test label drug')
      cy.getByDataCy('next').click()

      cy.getSelect('medicationForm').select('syrup')
      cy.getByDataCy('add_medication_form').click()
      cy.getByDataCy('formulation-syrup').click()

      cy.getSelect('"formulationsAttributes[0].administrationRouteId"').select(
        '4'
      )
      cy.getByForm('text', '"formulationsAttributes[0].dosesPerDay"')
        .clear()
        .type('22')
      cy.getByForm('text', '"formulationsAttributes[0].liquidConcentration"')
        .clear()
        .type('25')
      cy.getByForm('text', '"formulationsAttributes[0].doseForm"')
        .clear()
        .type('25')

      cy.getByForm('text', '"formulationsAttributes[0].maximalDose"')
        .clear()
        .type('10')

      cy.getByForm('text', '"formulationsAttributes[0].maximalDosePerKg"')
        .clear()
        .type('10')

      cy.getByForm('text', '"formulationsAttributes[0].minimalDosePerKg"')
        .clear()
        .type('5')

      cy.getTextArea('"formulationsAttributes[0].description"')
        .clear()
        .type('one description')
      cy.getTextArea('"formulationsAttributes[0].dispensingDescription"')
        .clear()
        .type('one dispensing description')

      cy.getTextArea('"formulationsAttributes[0].injectionInstructions"')
        .clear()
        .type('one injection instructions')

      cy.getByDataCy('submit').click()
    })

    cy.contains('Created successfully').should('exist')
  })
})
