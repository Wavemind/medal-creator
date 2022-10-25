describe('Forgot password', () => {
  it('sign-in page should contain "Forgot password ?"', () => {
    cy.visit('/auth/sign-in')
    cy.get('a').should('contain', 'Forgot your password ?')
  })

  it('should contains email, submit button and sign in link', () => {
    cy.visit('/auth/forgot-password')

    cy.getByForm('input', 'email').should('be.visible')
    cy.getByDataCy('submit').should('be.visible')
    cy.getByDataCy('sign_in').should('be.visible')
  })

  it('should display an error message if form is empty', () => {
    cy.getByDataCy('submit').click()
    cy.getByDataCy('from_control_email').contains('is required')
  })

  it("should display an error message if user doesn't exist", () => {
    cy.getByForm('input', 'email').type('test@test.com')

    cy.getByDataCy('submit').click()
    cy.getByDataCy('server_message').should('be.visible')
  })
})
