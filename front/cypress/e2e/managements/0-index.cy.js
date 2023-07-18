/* eslint-disable no-undef */
describe('Management page', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_library').click()
    cy.getByDataCy('subMenu_managements').click()
  })

  it('should navigate to the managements page', () => {
    cy.get('h1').should('contain', 'Managements')
  })

  it('should search for an existing managements', () => {
    cy.wait(1000)
    cy.getByForm('text', 'search')
      .clear()
      .type('ref')
      .should('have.value', 'ref')
    cy.getByDataCy('datatable_row').first().should('contain', 'refer')
  })

  it('should search for an inexistant management', () => {
    cy.wait(1000)
    cy.getByForm('text', 'search')
      .clear()
      .type('toto')
      .should('have.value', 'toto')
    cy.wait(2000)
    cy.getByDataCy('datatable_row').should('not.exist')
  })
})
