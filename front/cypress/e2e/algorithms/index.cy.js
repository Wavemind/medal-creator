/* eslint-disable no-undef */
Cypress.Cookies.debug(true)

describe('Algorithms page', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_algorithms').click()
  })

  it('should navigate to the algorithms page', () => {
    cy.get('h1').should('contain', 'Algorithms')
  })

  it('should search for an existing algorithm', () => {
    cy.getByForm('text', 'search')
      .clear()
      .type('First')
      .should('have.value', 'First')
    cy.getByDataCy('datatable_row_0').should('contain', 'First algo')
  })

  it('should search for an inexistant algorithm', () => {
    cy.getByForm('text', 'search')
      .clear()
      .type('toto')
      .should('have.value', 'toto')
    cy.wait(2000)
    cy.getByDataCy('datatable_row_0').should('not.exist')
  })
})
