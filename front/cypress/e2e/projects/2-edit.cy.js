/* eslint-disable no-undef */
describe('Update project page', () => {
  it('should navigate to projects/1/edit', () => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_menu').first().click()
    cy.getByDataCy('project_edit').first().click()
    cy.get('h2').should('contain', 'Edit')
    cy.getByForm('text', 'name')
      .wait(1000)
      .clear()
      .type('Renamed project')
      .should('have.value', 'Renamed project')
    cy.getByForm('checkbox', 'consentManagement').check({ force: true })
    cy.getTextArea('description')
      .clear()
      .type(
        'Practice Guidelines for Evaluation of Fever in returning Travelers or Migrants'
      )
      .should(
        'have.value',
        'Practice Guidelines for Evaluation of Fever in returning Travelers or Migrants'
      )
    cy.getByForm('file', 'villages').selectFile(
      'cypress/fixtures/example.json',
      { force: true }
    )
    cy.getSelect('languageId').select('English').should('have.value', '1')
    cy.getByDataCy('submit').click()
    cy.get('h2').should('contain', 'Renamed project')
  })

  it("should be redirect to '/' because he doesn't have access", () => {
    cy.login('/projects/2/edit')
    cy.get('h1').should('contain', '404')
    cy.logout()
  })
})
