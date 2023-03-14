/* eslint-disable no-undef */
describe('Destroy a diagnosis', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_algorithms').click()
    cy.getByDataCy('datatable_show').eq(-1).click()
  })

  it('should test form functionality', () => {
    cy.wait(2000)

    cy.getByDataCy('datatable_open_diagnosis').eq(-1).click()

    cy.wait(4000)

    cy.getByDataCy('datatable_menu').eq(-1).click()
    cy.getByDataCy('datatable_destroy').eq(-1).click()

    cy.getByDataCy('dialog_accept').click()

    cy.wait(1000)
    cy.getByDataCy('diagnoses_row').find('tr').should('have.length', 2)
  })
})
