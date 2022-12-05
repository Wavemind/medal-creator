/* eslint-disable no-undef */
describe('Edit algorithm functionality', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_algorithms').click()
  })
  it('should test form functionality', () => {
    cy.getByDataCy('datatable_menu').eq(-1).click()
    cy.getByDataCy('datatable_edit').eq(-1).click()

    cy.getByDataCy('modal').within(() => {
      cy.get('input').should('have.length', 5)
      cy.get('select').should('have.length', 1)
      cy.get('textarea').should('have.length', 2)
      cy.getByForm('text', 'name')
<<<<<<< HEAD
        .focus()
=======
>>>>>>> feature/edit-algorithm
        .type('{selectall}{backspace}{selectall}{backspace}')
        .type('My test algorithm')
        .should('have.value', 'My test algorithm')
      cy.getByForm('text', 'ageLimit')
<<<<<<< HEAD
        .focus()
=======
>>>>>>> feature/edit-algorithm
        .type('{selectall}{backspace}{selectall}{backspace}')
        .type('6')
        .should('have.value', '6')
      cy.getTextArea('ageLimitMessage')
<<<<<<< HEAD
        .focus()
=======
>>>>>>> feature/edit-algorithm
        .type('{selectall}{backspace}{selectall}{backspace}')
        .type('This is another test age limit message')
        .should('have.value', 'This is another test age limit message')
      cy.getByForm('text', 'minimumAge')
<<<<<<< HEAD
        .focus()
=======
>>>>>>> feature/edit-algorithm
        .type('{selectall}{backspace}{selectall}{backspace}')
        .type('4')
        .should('have.value', '4')
      cy.getSelect('mode')
        .select('Intervention')
        .should('have.value', 'intervention')
      cy.getTextArea('description')
<<<<<<< HEAD
        .focus()
=======
>>>>>>> feature/edit-algorithm
        .type('{selectall}{backspace}{selectall}{backspace}')
        .type('This is another test description')
        .should('have.value', 'This is another test description')
      cy.getByDataCy('submit').click()
    })
    cy.wait(2000)
    cy.getByDataCy('datatable_row').should('have.length', 2)
    cy.getByDataCy('datatable_row')
      .eq(-1)
      .should('contain', 'My test algorithm')
      .should('contain', 'Draft')
      .should('contain', 'Intervention')
  })
})
