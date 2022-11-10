/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// This command will automatically search using the "data-cy" data attribute
Cypress.Commands.add('getByDataCy', (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args)
})

Cypress.Commands.add('getByForm', (inputType, selector, ...args) => {
  return cy.get(`[type="${inputType}"][name=${selector}]`, ...args)
})

Cypress.Commands.add('getTextArea', (selector, ...args) => {
  return cy.get(`textarea[name=${selector}]`, ...args)
})

Cypress.Commands.add('getSelect', (selector, ...args) => {
  return cy.get(`select[name=${selector}]`, ...args)
})

Cypress.Commands.add('login', (url = '/') => {
  cy.visit(url)
  cy.getByForm('email', 'email').type('dev@wavemind.ch')
  cy.getByForm('password', 'password').type('123456')

  cy.getByDataCy('submit').click()
})

Cypress.Commands.add('logout', () => {
  cy.clearCookies()
  cy.visit('/')

  cy.getByDataCy('submit').click()
})

Cypress.Commands.add('loginAsAdmin', (url = '/') => {
  cy.visit(url)
  cy.getByForm('email', 'email').type('quentin.girard@wavemind.ch')
  cy.getByForm('password', 'password').type('123456')

  cy.getByDataCy('submit').click()
})
