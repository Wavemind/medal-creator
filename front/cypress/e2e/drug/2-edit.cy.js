/* eslint-disable no-undef */
describe('Update drug', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_library').click()
    cy.getByDataCy('subMenu_drugs').click()
  })

  it('should display default input ', () => {
    cy.wait(2000)
    cy.getByDataCy('datatable_menu').eq(0).click()
    cy.getByDataCy('datatable_edit').eq(0).click()

    cy.wait(1000)

    cy.getByDataCy('modal').within(() => {
      cy.contains('Drug').should('exist')
      cy.contains('Formulations').should('exist')

      cy.getByForm('text', 'label').clear().type('updated label')
      cy.getByDataCy('next').click()

      cy.getSelect('medicationForm').select('solution')
      cy.getByDataCy('add_medication_form').click()
      cy.getByDataCy('formulation-solution').click()

      cy.getSelect('"formulationsAttributes[1].administrationRouteId"').select(
        '4'
      )
      cy.getByForm('text', '"formulationsAttributes[1].dosesPerDay"')
        .clear()
        .type('22')
      cy.getByForm('text', '"formulationsAttributes[1].liquidConcentration"')
        .clear()
        .type('25')
      cy.getByForm('text', '"formulationsAttributes[1].doseForm"')
        .clear()
        .type('25')

      cy.getByForm('text', '"formulationsAttributes[1].maximalDose"')
        .clear()
        .type('10')

      cy.getByForm('text', '"formulationsAttributes[1].maximalDosePerKg"')
        .clear()
        .type('10')

      cy.getByForm('text', '"formulationsAttributes[1].minimalDosePerKg"')
        .clear()
        .type('5')

      cy.getTextArea('"formulationsAttributes[1].description"')
        .clear()
        .type('one description')
      cy.getTextArea('"formulationsAttributes[1].dispensingDescription"')
        .clear()
        .type('one dispensing description')

      cy.getTextArea('"formulationsAttributes[1].injectionInstructions"')
        .clear()
        .type('one injection instructions')

      cy.getByDataCy('submit').click()

      cy.wait(2000)
    })

    cy.getByDataCy('datatable_row')
      .eq(0)
      .contains('updated label')
      .should('exist')
  })
})
