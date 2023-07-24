/* eslint-disable no-undef */
describe('Archive an algorithm', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_algorithms').click()
  })

  it('should archive an algorithm', () => {
    cy.getByDataCy('datatable_menu').eq(-1).click()
    cy.getByDataCy('datatable_archive').eq(-1).click()

    cy.getByDataCy('dialog_accept').click()
    cy.getByDataCy('datatable_menu').eq(-1).click()
    cy.getByDataCy('datatable_row').first().should('contain', 'Archived')
  })
})
