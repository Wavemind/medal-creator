/* eslint-disable no-undef */
describe('New diagnosis functionality', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_algorithms').click()
    cy.getByDataCy('datatable_show').eq(-1).click()
  })

  it('Should open create a diagnosis without the stepper', () => {
    cy.wait(2000)

    cy.getByDataCy('datatable_menu').eq(-1).click()
    cy.getByDataCy('datatable_new').eq(-1).click()

    cy.getByDataCy('modal').within(() => {
      cy.contains('New diagnosis').should('be.visible')

      cy.get('input').should('have.length', 2)
      cy.get('textarea').should('have.length', 1)
      cy.getByDataCy('slider').should('be.visible')
      cy.getByForm('text', 'label')
        .type('Test diagnosis without stepper')
        .should('have.value', 'Test diagnosis without stepper')
      cy.getTextArea('description')
        .type('This is a description message without stepper')
        .should('have.value', 'This is a description message without stepper')
      cy.getByDataCy('slider_mark_2').click({ force: true })
      cy.getByDataCy('submit').click()
      cy.wait(2000)
    })
    cy.getByDataCy('datatable_open_diagnosis').eq(-1).click()
    cy.contains('Test diagnosis without stepper').should('be.visible')
  })
})
