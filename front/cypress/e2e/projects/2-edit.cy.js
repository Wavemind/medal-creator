/* eslint-disable no-undef */
describe('Update a project page', () => {
  it("should be redirect to '/' because he doesn't have access", () => {
    cy.login('/projects/1/edit')
    cy.get('h2').should('contain', 'Projects')
    cy.logout()
  })

  it('should navigate to projects/1/edit', () => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_menu').first().click()
    cy.getByDataCy('project_edit').first().click()
    cy.get('h2').should('contain', 'Edit')
    cy.getByForm('text', 'name')
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
})
