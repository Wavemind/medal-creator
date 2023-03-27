/* eslint-disable no-undef */
describe('Duplicate a decision tree', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_algorithms').click()
    cy.getByDataCy('datatable_show').eq(-1).click()
  })

  it('should display a warning before duplicate and duplicate the decision tree', () => {
    cy.wait(2000)

    cy.getByDataCy('datatable_menu').eq(-1).click()
    cy.getByDataCy('datatable_duplicate').eq(-1).click()

    cy.getByDataCy('dialog_accept').click()

    cy.wait(2000)
    cy.get('tbody').find('tr').should('have.length', 3)
  })
})
