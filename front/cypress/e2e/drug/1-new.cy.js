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

      // TODO VALIDATE DRUG STEP
    })
  })
})
