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
    cy.getByDataCy('forgot-password').should('be.visible')
  })

  it('should display an error message if form is empty', () => {
    cy.visit('http://localhost:3001/auth/sign-in')

    cy.getByDataCy('submit').click()
    cy.getByDataCy('from-control-email').contains('is required')
    cy.getByDataCy('from-control-password').contains('is required')
  })

  it('should display an error message if user cannot connect', () => {
    cy.visit('http://localhost:3001/auth/sign-in')

    cy.getByForm('email').type('test@test.com')
    cy.getByForm('password').type('123456')

    cy.getByDataCy('submit').click()
    cy.getByDataCy('server-message').should('be.visible')
  })

  it('should redirect user after successful login', () => {
    cy.visit('http://localhost:3001/auth/sign-in')

    cy.getByForm('email').type('dev@wavemind.ch')
    cy.getByForm('password').type('123456')

    cy.getByDataCy('submit').click()
    cy.url().should('eq', 'http://localhost:3001/')
  })

  it('should be redirected to the page asked after successful connection', () => {
    cy.visit('http://localhost:3001/algorithms')
    cy.url().should('include', 'http://localhost:3001/auth/sign-in')

    cy.getByForm('email').type('dev@wavemind.ch')
    cy.getByForm('password').type('123456')

    cy.getByDataCy('submit').click()
    cy.url().should('include', 'http://localhost:3001/algorithms')
  })
})
