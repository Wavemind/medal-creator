/* eslint-disable no-undef */
describe('Duplicate variable functionality', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_library').click()
  })

  it('should duplicate a variable ', () => {
    cy.wait(2000)

    cy.getByDataCy('datatable_menu').eq(0).click()
    cy.getByDataCy('datatable_duplicate').eq(0).click()

    cy.getByDataCy('dialog_accept').click()

    cy.wait(1000)

    cy.getByDataCy('datatable_row')
      .eq(0)
      .contains('updated label')
      .should('exist')
  })
})
