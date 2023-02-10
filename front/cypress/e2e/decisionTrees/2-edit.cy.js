/* eslint-disable no-undef */
describe('Edit decision tree functionality', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_algorithms').click()
    cy.getByDataCy('datatable_show').eq(-1).click()
  })

  it('should test form functionality', () => {
    cy.wait(2000)

    cy.getByDataCy('datatable_menu').eq(-1).click()
    cy.getByDataCy('datatable_edit').eq(-1).click()

    cy.getByDataCy('modal').within(() => {
      cy.contains('Edit decision tree').should('be.visible')

      cy.get('input').should('have.length', 3)
      cy.get('select').should('have.length', 2)
      cy.getByForm('text', 'label')
        .wait(1000)
        .clear()
        .type('Renamed decision tree')
        .should('have.value', 'Renamed decision tree')
      cy.getSelect('nodeId').select('General').should('have.value', '1')
      cy.getByForm('text', 'cutOffStart')
        .clear()
        .type('12')
        .should('have.value', '12')
      cy.getByForm('text', 'cutOffEnd')
        .clear()
        .type('56')
        .should('have.value', '56')
      cy.getByDataCy('submit').click()
      cy.wait(2000)
    })
    cy.getByDataCy('datatable_row')
      .eq(-1)
      .contains('Renamed decision tree')
      .should('be.visible')
  })
})
