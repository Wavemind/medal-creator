/* eslint-disable no-undef */
describe('Navigation', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
  })

  it('should navigate to the home page', () => {
    // The new page should contain an h1 with "About page"
    cy.get('h2').should('contain', 'Projects')
  })
})
