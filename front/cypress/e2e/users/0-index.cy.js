/* eslint-disable no-undef */
describe('Users page', () => {
  it('should not be able to navigate', () => {
    cy.login('/users')
    cy.get('h2').should('contain', 'Projects')
  })

  it('should navigate to users list', () => {
    cy.loginAsAdmin()
    cy.getByDataCy('user_menu').click()
    cy.getByDataCy('menu_users').should('contain', 'Users')
    cy.getByDataCy('menu_users').click()
    cy.get('h2').should('contain', 'Users')
  })

  it('should search for an existing users', () => {
    cy.loginAsAdmin('/users')
    cy.getByForm('text', 'search')
      .clear()
      .type('dev-admin@wavemind.ch')
      .should('have.value', 'dev-admin@wavemind.ch')
    cy.wait(2000)
    cy.getByDataCy('datatable_row').first().should('contain', 'Quentin Doe')
  })

  it('should search for an inexistant user', () => {
    cy.loginAsAdmin('/users')
    cy.getByForm('text', 'search')
      .clear()
      .type('toto')
      .should('have.value', 'toto')
    cy.wait(2000)
    cy.getByDataCy('datatable_row').should('not.exist')
  })

  it('should lock a user', () => {
    cy.loginAsAdmin('/users')
    cy.getByForm('text', 'search')
      .clear()
      .type('dev@wavemind.ch')
      .should('have.value', 'dev@wavemind.ch')
    cy.wait(2000)
    cy.getByDataCy('datatable_menu').eq(-1).click()
    cy.getByDataCy('datatable_lock').eq(-1).click()

    cy.getByDataCy('dialog_accept').click()
    cy.getByDataCy('datatable_menu').eq(-1).click()
    cy.getByDataCy('datatable_row_lock').should('exist')
  })

  it('should unlock a user', () => {
    cy.loginAsAdmin('/users')
    cy.getByForm('text', 'search')
      .clear()
      .type('dev@wavemind.ch')
      .should('have.value', 'dev@wavemind.ch')
    cy.wait(2000)
    cy.getByDataCy('datatable_menu').eq(-1).click()
    cy.getByDataCy('datatable_unlock').eq(-1).click()

    cy.getByDataCy('dialog_accept').click()
    cy.getByDataCy('datatable_menu').eq(-1).click()
    cy.getByDataCy('datatable_row')
      .first()
      .should('not.have.descendants', '[data-cy=datatable_row_lock]')
  })
})
