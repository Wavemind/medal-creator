describe('New password', () => {
  it('should contains password, password confirmation, submit button and sign in link', () => {
    cy.visit('/auth/new-password')

    cy.getByForm('input', 'password').should('be.visible')
    cy.getByForm('input', 'passwordConfirmation').should('be.visible')
    cy.getByDataCy('submit').should('be.visible')
    cy.getByDataCy('sign_in').should('be.visible')
  })

  it('should display an error message if form is empty', () => {
    cy.getByDataCy('submit').click()
    cy.getByDataCy('from_control_password').contains('is required')
    cy.getByDataCy('from_control_password_confirmation').contains('is required')
  })
})
