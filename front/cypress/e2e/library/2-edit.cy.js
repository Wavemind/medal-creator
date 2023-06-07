/* eslint-disable no-undef */
describe('Edit variable functionality', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_library').click()
  })

  it('should display default input ', () => {
    cy.wait(2000)

    cy.getByDataCy('variable_edit_button').eq(0).click()

    cy.wait(1000)

    cy.getByDataCy('modal').within(() => {
      cy.contains('Variable').should('exist')

      cy.getSelect('type').should('have.attr', 'disabled')
      cy.getSelect('answerType').should('have.attr', 'disabled')

      cy.getByForm('text', 'label').clear().type('updated label')
      cy.getByDataCy('next').click()
      cy.getByDataCy('next').click()
      cy.getByDataCy('submit').click()
      cy.wait(2000)
    })

    cy.getByDataCy('datatable_row')
      .eq(0)
      .contains('updated label')
      .should('exist')
  })
})
