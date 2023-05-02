/* eslint-disable no-undef */
describe('Variables page', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_library').click()
  })

  it('should navigate to the library variables page', () => {
    cy.get('h1').should('contain', 'Variables')
  })

  it('should search for an existing variable', () => {
    cy.getByForm('text', 'search')
      .clear()
      .type('Fever')
      .should('have.value', 'Fever')
    cy.getByDataCy('datatable_row').first().should('contain', 'Fever')
  })

  it('should search for an inexistant variable', () => {
    cy.getByForm('text', 'search')
      .clear()
      .type('toto')
      .should('have.value', 'toto')
    cy.wait(2000)
    cy.getByDataCy('datatable_row').should('not.exist')
  })

  it('should open the info modal for a variable', () => {
    cy.getByDataCy('datatable_menu').eq(0).click()
    cy.getByDataCy('datatable_info').eq(0).click()
    cy.getByDataCy('modal').within(() => {
      cy.contains('Fever').should('be.visible')
    })
  })
})
