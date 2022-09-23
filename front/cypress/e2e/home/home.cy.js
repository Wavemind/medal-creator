describe('Navigation', () => {
  it('should navigate to the home page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')

    // The new page should contain an h1 with "About page"
    cy.get('h2').contains('Welcome to the app')
  })
})