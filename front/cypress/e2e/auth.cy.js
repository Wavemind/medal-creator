describe('Authentication', () => {
  it('should be redirected to auth page', () => {
    cy.visit('/')
    cy.url().should('include', '/auth/sign-in')
  })

  it('should contains email, password, submit button and forgot password link', () => {
    cy.visit('/auth/sign-in')

    cy.getByForm('input', 'email').should('be.visible')
    cy.getByForm('input', 'password').should('be.visible')
    cy.getByDataCy('submit').should('be.visible')
    cy.getByDataCy('forgot_password').should('be.visible')
  })

  it('should display an error message if form is empty', () => {
    cy.getByDataCy('submit').click()
    cy.getByDataCy('from_control_email').contains('is required')
    cy.getByDataCy('from_control_password').contains('is required')
  })

  it('should display an error message if user cannot connect', () => {
    cy.getByForm('input', 'email').type('test@test.com')
    cy.getByForm('input', 'password').type('123456')

    cy.getByDataCy('submit').click()
    cy.getByDataCy('server_message').should('be.visible')
  })

  it('should redirect user after successful login', () => {
    cy.getByForm('input', 'email').clear().type('dev@wavemind.ch')
    cy.getByForm('input', 'password').clear().type('123456')

    cy.getByDataCy('submit').click()
    cy.url().should('include', '/account/credentials')
  })

  it('should be redirected to the page asked after successful connection', () => {
    cy.visit('/algorithms')
    cy.url().should('include', '/auth/sign-in')

    cy.getByForm('input', 'email').type('dev@wavemind.ch')
    cy.getByForm('input', 'password').type('123456')

    cy.getByDataCy('submit').click()
    cy.url().should('include', '/algorithms')
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
