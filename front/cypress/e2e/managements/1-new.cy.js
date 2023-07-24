/* eslint-disable no-undef */
describe('New management', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_library').click()
    cy.getByDataCy('subMenu_managements').click()
  })

  it('should open the create modal for a management and display inputs', () => {
    cy.getByDataCy('create_management').click()
    cy.getByDataCy('modal').within(() => {
      cy.contains('New management').should('exist')

      cy.getByForm('text', 'label').should('exist')
      cy.getByForm('checkbox', 'isReferral').should('exist')
      cy.getByForm('checkbox', 'isNeonat').should('exist')
      cy.getTextArea('description').should('exist')
      cy.getByDataCy('slider').should('exist')

      cy.getByDataCy('submit').click()

      cy.getByForm('text', 'label').then($input => {
        expect($input[0].validationMessage).to.contain('Please fill')
      })
    })
  })

  it('should a create management', () => {
    cy.getByDataCy('create_management').click()
    cy.getByDataCy('modal').within(() => {
      cy.contains('New management').should('exist')

      cy.getByForm('text', 'label').clear().type('New management')
      cy.getByForm('checkbox', 'isReferral').check({ force: true })
      cy.getByForm('checkbox', 'isNeonat').check({ force: true })
      cy.getTextArea('description').clear().type('A nice description')
      cy.getByDataCy('slider_mark_2').click({ force: true })

      cy.getByDataCy('submit').click()
    })
    cy.contains('Created successfully').should('exist')
  })
})
