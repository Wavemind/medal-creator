/* eslint-disable no-undef */
// describe('New password', () => {
// it('should contains password, password confirmation, submit button and sign in link', () => {
//   cy.visit('/auth/new-password')

//   cy.getByForm('password', 'password').should('be.visible')
//   cy.getByForm('password', 'passwordConfirmation').should('be.visible')
//   cy.getByDataCy('submit').should('be.visible')
//   cy.getByDataCy('sign_in').should('be.visible')
// })

// it('should display an error message if form is empty', () => {
//   cy.getByDataCy('submit').click()
//   cy.getByForm('password', 'password').then($input => {
//     expect($input[0].validationMessage).to.contain('Please fill')
//   })
//   cy.getByForm('password', 'passwordConfirmation').then($input => {
//     expect($input[0].validationMessage).to.contain('Please fill')
//   })
// })
// })
