/* eslint-disable no-undef */
// TODO: WAITING SEEDS
// describe('Algorithm pages', () => {
//   beforeEach(() => {
//     cy.login()
//     cy.getByDataCy('sidebar_algorithms').click()
//   })

//   it('should navigate to the algorithms page', () => {
//     cy.get('h1').should('contain', 'Algorithms')
//     cy.getByDataCy('create_algorithm').should('be.visible')
//   })

//   it('should open the modal and test close functionality when clicked on close', () => {
//     cy.getByDataCy('create_algorithm').click()
//     cy.get('header').should('contain', 'Create algorithm')
//     cy.getByDataCy('close_modal').click()
//     cy.get('header').should('not.exist')
//   })

//   it('should open the modal and test close functionality when clicked outside the modal', () => {
//     cy.getByDataCy('create_algorithm').click()
//     cy.get('body').click(0, 0)
//     cy.get('header').should('not.exist')
//   })

//   it('should test form functionality', () => {
//     cy.getByDataCy('create_algorithm').click()
//     cy.getByForm('input', 'name')
//       .type('Test name')
//       .should('have.value', 'Test name')
//     cy.getByForm('textarea', 'description')
//       .type('This is a test description')
//       .should('have.value', 'This is a test description')
//     cy.getByForm('select', 'type')
//       .select('option2')
//       .should('have.value', 'option2')
//   })
// })
