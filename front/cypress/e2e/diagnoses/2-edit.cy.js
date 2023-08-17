/* eslint-disable no-undef */
describe('Edit diagnosis functionality', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_algorithms').click()
    cy.getByDataCy('datatable_show').eq(-1).click()
  })

  it('should test form functionality', () => {
    cy.wait(2000)

    cy.getByDataCy('datatable_open_diagnosis').eq(0).click()

    cy.wait(1000)
    cy.getByDataCy('datatable_menu').eq(1).click()
    cy.getByDataCy('datatable_edit').eq(1).click()

    cy.getByDataCy('modal').within(() => {
      cy.contains('Edit diagnosis').should('be.visible')

      cy.get('input').should('have.length', 3)
      cy.get('textarea').should('have.length', 1)
      cy.getByDataCy('slider').should('be.visible')
      cy.getByForm('text', 'label')
        .wait(1000)
        .clear()
        .type('Edit test diagnosis without stepper')
        .should('have.value', 'Edit test diagnosis without stepper')
      cy.getTextArea('description')
        .clear()
        .type('This is a description message without stepper number 2')
        .should(
          'have.value',
          'This is a description message without stepper number 2'
        )
      cy.getByDataCy('slider_mark_3').click({ force: true })
      cy.getByDataCy('submit').click()
      cy.wait(2000)
    })
    cy.contains('Edit test diagnosis without stepper').should('be.visible')
  })
})
