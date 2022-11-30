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

  // it('should search for an existing algorithm', () => {
  //   cy.getByForm('text', 'search')
  //     .clear()
  //     .type('Epoct+')
  //     .should('have.value', 'Epoct+')
  //   cy.getByDataCy('datatable_row_0').should('contain', 'ePOCT+_DYN_TZ_V2.0')
  // })

  // it('should search for an inexistant algorithm', () => {
  //   cy.getByForm('text', 'search')
  //     .clear()
  //     .type('toto')
  //     .should('have.value', 'toto')
  //   cy.wait(2000)
  //   cy.getByDataCy('datatable_row_0').should('not.exist')
  // })
})
