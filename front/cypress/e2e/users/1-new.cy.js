/* eslint-disable no-undef */
describe('Create user page', () => {
  it('should navigate to users and open the modal', () => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').should('exist')
    cy.getByDataCy('user_menu').click()
    cy.getByDataCy('menu_users').click()
    cy.getByDataCy('new_user').click()
    cy.get('header').should('contain', 'New user')
    cy.get('input').should('have.length', 5)
    cy.getSelect('role').should('have.length', '1')
    cy.getByForm('text', 'firstName')
      .clear()
      .type('Quentin')
      .should('have.value', 'Quentin')
    cy.getByForm('text', 'lastName')
      .clear()
      .type('Fresco')
      .should('have.value', 'Fresco')
    cy.getByForm('email', 'email')
      .clear()
      .type('quentin.fresco@wavemind.ch')
      .should('have.value', 'quentin.fresco@wavemind.ch')
    cy.getSelect('role').select('Clinician').should('have.value', 'clinician')
    cy.getByForm('text', 'projects')
      .clear()
      .type('Project')
      .should('have.value', 'Project')
    cy.getByDataCy('find_projects').first().click()
    cy.getByDataCy('allowed_projects').should('exist')
    cy.getByDataCy('toggle_admin_allowed_projects')
      .first()
      .click({ force: true })
    cy.getByDataCy('submit').click()
    cy.get('h2').should('contain', 'Users')
  })

  it("should be redirect to '/' because he doesn't have access", () => {
    cy.login('/users')
    cy.getByDataCy('new_user').should('not.exist')
    cy.get('h2').should('contain', 'Projects')
  })
})
