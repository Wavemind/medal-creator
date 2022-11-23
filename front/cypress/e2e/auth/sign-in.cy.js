/* eslint-disable no-undef */
describe('Authentication', () => {
  it('should be redirected to auth page', () => {
    cy.visit('/')
    cy.url().should('include', '/auth/sign-in')
  })

  it('should contains email, password, submit button and forgot password link', () => {
    cy.visit('/auth/sign-in')

    cy.getByForm('email', 'email').should('be.visible')
    cy.getByForm('password', 'password').should('be.visible')
    cy.getByDataCy('submit').should('be.visible')
    cy.getByDataCy('forgot_password').should('be.visible')
  })

  it('should display an error message if form is empty', () => {
    cy.getByDataCy('submit').click()
    cy.getByForm('email', 'email').then($input => {
      expect($input[0].validationMessage).to.contain('Please fill')
    })
    cy.getByForm('password', 'password').then($input => {
      expect($input[0].validationMessage).to.contain('Please fill')
    })
  })

  it('should display an error message if user cannot connect', () => {
    cy.getByForm('email', 'email').type('test@test.com')
    cy.getByForm('password', 'password').type('123456')

    cy.getByDataCy('submit').click()
    cy.getByDataCy('server_message').should('be.visible')
  })

  it('should redirect user after successful login', () => {
    cy.getByForm('email', 'email').clear().type('dev@wavemind.ch')
    cy.getByForm('password', 'password').clear().type('123456')

    cy.getByDataCy('submit').click()
    cy.url().should('include', '/account/credentials')
  })

  it('should be redirected to the page asked after successful connection', () => {
    cy.visit('/account/credentials')
    cy.url().should('include', '/auth/sign-in')

    cy.getByForm('email', 'email').type('dev@wavemind.ch')
    cy.getByForm('password', 'password').type('123456')

    cy.getByDataCy('submit').click()
    cy.url().should('include', '/account/credentials')
  })
})
