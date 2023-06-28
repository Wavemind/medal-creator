/* eslint-disable no-undef */
describe('Destroy drug', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_library').click()
    cy.getByDataCy('subMenu_drugs').click()
  })

  // TODO: Unncomment when create drug is implemented
  // it('should destroy a drug ', () => {
  //   cy.wait(2000)

  //   cy.getByDataCy('datatable_menu').eq(0).click()
  //   cy.getByDataCy('datatable_destroy').eq(0).click()

  //   cy.getByDataCy('dialog_accept').click()

  //   cy.wait(1000)

  //   cy.contains('Deleted successfully').should('be.visible')
  // })
})
