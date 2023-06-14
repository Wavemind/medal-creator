/* eslint-disable no-undef */
describe('Drug page', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_library').click()
    cy.getByDataCy('subMenu_drugs').click()
  })

  it('should navigate to the drugs page', () => {
    cy.get('h1').should('contain', 'Drugs')
  })

  it('should search for an existing drugs', () => {
    cy.wait(1000)
    cy.getByForm('text', 'search')
      .clear()
      .type('pana')
      .should('have.value', 'pana')
    cy.getByDataCy('datatable_row').first().should('contain', 'Panadol')
  })

  it('should search for an inexistant drug', () => {
    cy.wait(1000)
    cy.getByForm('text', 'search')
      .clear()
      .type('toto')
      .should('have.value', 'toto')
    cy.wait(2000)
    cy.getByDataCy('datatable_row').should('not.exist')
  })
})
