/* eslint-disable no-undef */
describe('Create project page', () => {
  it("should be redirect to '/' because he doesn't have access", () => {
    cy.login('/projects/new')
    cy.getByDataCy('new_project').should('not.exist')
    cy.get('h2').should('contain', 'Projects')
    cy.logout()
  })

  it('should navigate to projects/new', () => {
    cy.loginAsAdmin()
    cy.getByDataCy('new_project').click()
    cy.get('h2').should('contain', 'New project')
    cy.get('input').should('have.length', 10)
    cy.getByForm('text', 'name')
      .clear()
      .type('FerverTravel App 2')
      .should('have.value', 'FerverTravel App 2')
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
    cy.getByForm('text', 'users')
      .clear()
      .type('wavemind')
      .should('have.value', 'wavemind')
    cy.getByDataCy('find_users_1').click()
    cy.getByDataCy('allowed_users_1').should('exist')
    cy.getByDataCy('toggle_admin_allowed_users_1').click({ force: true })
    cy.getByDataCy('submit').click()
    cy.get('h2').should('contain', 'FerverTravel App 2')
  })
})
