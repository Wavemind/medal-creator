/* eslint-disable no-undef */
describe('Algorithms page', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_algorithms').click()
  })
  it('should test form functionality', () => {
    cy.getByDataCy('create_algorithm').click()
    cy.getByDataCy('modal').within(() => {
      cy.get('input').should('have.length', 5)
      cy.get('select').should('have.length', 1)
      cy.get('textarea').should('have.length', 2)
      cy.getByForm('text', 'name')
        .type('Test algorithm')
        .should('have.value', 'Test algorithm')
      cy.getByForm('text', 'ageLimit')
        .clear()
        .type('4')
        .should('have.value', '4')
      cy.getTextArea('ageLimitMessage')
        .type('This is a test age limit message')
        .should('have.value', 'This is a test age limit message')
      cy.getByForm('text', 'minimumAge')
        .clear()
        .type('3')
        .should('have.value', '3')
      cy.getSelect('mode').select('1').should('have.value', '1')
      cy.getTextArea('description')
        .type('This is a test description')
        .should('have.value', 'This is a test description')
      cy.getByDataCy('checkbox_group_option').eq(1).click()
      cy.getByDataCy('submit').click()
    })
    cy.getByDataCy('datatable_row').eq(-1).should('contain', 'Test algorithm')
  })
})
