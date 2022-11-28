/* eslint-disable no-undef */
describe('Custom error pages', () => {
  it('should navigate to the 404 page if the url does not exist', () => {
    // Start from the index page
    cy.visit('/abcdefg')

    cy.getByForm('email', 'email').type('dev@wavemind.ch')
    cy.getByForm('password', 'password').type(Cypress.env('ADMIN_PASSWORD'))

    cy.getByDataCy('submit').click()

    // The new page should contain an h1 with "404 | Page not found"
    cy.get('h1').should('contain', '404 | Page not found')

    cy.getByDataCy('go_home').click()

    cy.get('h2').should('contain', 'Projects')
  })
})
