/* eslint-disable no-undef */
describe('Edit user modal', () => {
  it('should navigate to users and open the modal', () => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').should('exist')
    cy.getByDataCy('user_menu').click()
    cy.getByDataCy('menu_users').click()
    cy.getByDataCy('datatable_menu').last().click()
    cy.getByDataCy('datatable_edit').last().click()
    cy.get('header').should('contain', 'Edit user')
    cy.get('input').should('have.length', 5)
    cy.getSelect('role').should('have.length', 1)
    cy.getByForm('text', 'firstName')
      .should('have.value', 'Quentin')
      .clear()
      .type('Alain')
      .should('have.value', 'Alain')
    cy.getByForm('text', 'lastName')
      .should('have.value', 'Fresco')
      .clear()
      .type('Girard')
      .should('have.value', 'Girard')
    cy.getByForm('email', 'email')
      .should('have.value', 'quentin.fresco@wavemind.ch')
      .clear()
      .type('alain.girard@wavemind.ch')
    cy.getSelect('role')
      .select('Deployment Manager')
      .should('have.value', 'deployment_manager')
    cy.getByDataCy('remove_projects').first().click()
    cy.getByDataCy('find_projects').should('exist')
    cy.getByDataCy('submit').click()
    cy.get('h2').should('contain', 'Users')
  })

  it("should be redirect to '/' because he doesn't have access", () => {
    cy.login('/users')
    cy.getByDataCy('new_user').should('not.exist')
    cy.get('h2').should('contain', 'Projects')
  })
})
