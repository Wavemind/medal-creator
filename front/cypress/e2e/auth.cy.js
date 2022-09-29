describe('Authentication', () => {
  it('should be redirected to auth page', () => {
    cy.visit('http://localhost:3001/')
    cy.url().should('include', 'http://localhost:3001/auth/sign-in')
  })

  it('should contains email, password, submit button and forgot password link', () => {
    cy.visit('http://localhost:3001/auth/sign-in')

    cy.getByForm('email').should('be.visible')
    cy.getByForm('password').should('be.visible')
    cy.getByDataCy('submit').should('be.visible')
    cy.getByDataCy('forgot_password').should('be.visible')
  })

  it('should display an error message if form is empty', () => {
    cy.getByDataCy('submit').click()
    cy.getByDataCy('from_control_email').contains('is required')
    cy.getByDataCy('from_control_password').contains('is required')
  })

  it('should display an error message if user cannot connect', () => {
    cy.getByForm('email').type('test@test.com')
    cy.getByForm('password').type('123456')

    cy.getByDataCy('submit').click()
    cy.getByDataCy('server_message').should('be.visible')
  })

  it('should redirect user after successful login', () => {
    cy.getByForm('email').clear().type('dev@wavemind.ch')
    cy.getByForm('password').clear().type('123456')

    cy.getByDataCy('submit').click()
    cy.url().should('eq', 'http://localhost:3001/account/credentials')
  })

  it('should be redirected to the page asked after successful connection', () => {
    cy.visit('http://localhost:3001/algorithms')
    cy.url().should('include', 'http://localhost:3001/auth/sign-in')

    cy.getByForm('email').type('dev@wavemind.ch')
    cy.getByForm('password').type('123456')

    cy.getByDataCy('submit').click()
    cy.url().should('include', 'http://localhost:3001/algorithms')
  })

  it('should contains email, submit button and sign in link', () => {
    cy.visit('http://localhost:3001/auth/forgot-password')

    cy.getByForm('email').should('be.visible')
    cy.getByDataCy('submit').should('be.visible')
    cy.getByDataCy('sign_in').should('be.visible')
  })

  it('should display an error message if form is empty', () => {
    cy.getByDataCy('submit').click()
    cy.getByDataCy('from_control_email').contains('is required')
  })

  it('should contains password, password confirmation, submit button and sign in link', () => {
    cy.visit('http://localhost:3001/auth/new-password')

    cy.getByForm('password').should('be.visible')
    cy.getByForm('passwordConfirmation').should('be.visible')
    cy.getByDataCy('submit').should('be.visible')
    cy.getByDataCy('sign_in').should('be.visible')
  })

  it('should display an error message if form is empty', () => {
    cy.getByDataCy('submit').click()
    cy.getByDataCy('from_control_password').contains('is required')
    cy.getByDataCy('from_control_password_confirmation').contains('is required')
  })
})
