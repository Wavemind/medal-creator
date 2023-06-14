/* eslint-disable no-undef */
describe('Destroy management', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_library').click()
    cy.getByDataCy('subMenu_managements').click()
  })

  it('should destroy a management ', () => {
    cy.wait(2000)

    cy.getByDataCy('datatable_menu').eq(0).click()
    cy.getByDataCy('datatable_destroy').eq(0).click()

    cy.getByDataCy('dialog_accept').click()

    cy.wait(1000)

    cy.contains('Deleted successfully').should('be.visible')
  })
})