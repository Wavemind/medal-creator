/* eslint-disable no-undef */
describe('Modal functionality', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_algorithms').click()
  })
  it('should open the modal and test close functionality when clicked on close button', () => {
    cy.getByDataCy('create_algorithm').click()
    cy.get('header').should('contain', 'New algorithm')
    cy.getByDataCy('close_modal').click()
    cy.get('header').should('not.exist')
  })
  it('should open the modal and test close functionality when clicked outside the modal', () => {
    cy.getByDataCy('create_algorithm').click()
    cy.get('body').click(0, 0)
    cy.get('header').should('not.exist')
  })
})
