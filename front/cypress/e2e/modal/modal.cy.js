/* eslint-disable no-undef */
describe('Modal functionality', () => {
  it('should navigate to the algorithms page', () => {
    cy.loginAsAdmin('/projects/1/algorithms')
    cy.get('h1').should('contain', 'Algorithms')
  })
  it('should open the modal and test close functionality when clicked on close button', () => {
    cy.getByDataCy('create_algorithm').click()
    cy.get('header').should('contain', 'Create algorithm')
    cy.getByDataCy('close_modal').click()
    cy.get('header').should('not.exist')
  })
  it('should open the modal and test close functionality when clicked outside the modal', () => {
    cy.getByDataCy('create_algorithm').click()
    cy.get('body').click(0, 0)
    cy.get('header').should('not.exist')
  })
})
