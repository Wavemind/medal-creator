/* eslint-disable no-undef */
describe('Decision trees page', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_algorithms').click()
    cy.getByDataCy('datatable_menu').eq(-1).click()
    cy.getByDataCy('datatable_show').eq(-1).click()
  })

  it('should navigate to the decision trees page', () => {
    cy.get('h1').should('contain', 'Decision trees')
  })

  it('should search for an existing decision tree', () => {
    cy.wait(2000)
    cy.getByForm('text', 'search')
      .clear()
      .type('Malaria')
      .should('have.value', 'Malaria')
    cy.wait(2000)
    cy.getByDataCy('datatable_row').first().should('contain', 'Malaria')
  })

  it('should search for an inexistant decision tree', () => {
    cy.wait(2000)
    cy.getByForm('text', 'search')
      .clear()
      .type('toto')
      .should('have.value', 'toto')
    cy.wait(2000)
    cy.getByDataCy('datatable_row').should('not.exist')
  })
})
