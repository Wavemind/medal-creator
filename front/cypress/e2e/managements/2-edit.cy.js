/* eslint-disable no-undef */
describe('Edit management', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_library').click()
    cy.getByDataCy('subMenu_managements').click()
  })

  it('should display default input', () => {
    cy.wait(2000)

    cy.getByDataCy('management_edit_button').eq(0).click()

    cy.wait(1000)

    cy.getByDataCy('modal').within(() => {
      cy.contains('Edit management').should('exist')

      cy.getByForm('text', 'label').clear().type('updated management label')
      cy.getByForm('checkbox', 'isNeonat').check({ force: true })
      cy.getByDataCy('submit').click()
      cy.wait(2000)
    })

    cy.getByDataCy('datatable_row')
      .eq(0)
      .contains('updated management label')
      .should('exist')
  })
})
