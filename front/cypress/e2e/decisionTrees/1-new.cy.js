/* eslint-disable no-undef */
describe('Create algorithm functionality', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_algorithms').click()
    cy.getByDataCy('datatable_menu').eq(-1).click()
    cy.getByDataCy('datatable_show').eq(-1).click()
  })
  it('should test form functionality', () => {
    cy.getByDataCy('create_decision_tree').click()
    cy.getByDataCy('modal').within(() => {
      cy.contains('New decision tree').should('be.visible')
      cy.contains('New diagnosis').should('be.visible')
      cy.contains('Summary').should('be.visible')

      // New decision tree step
      cy.get('input').should('have.length', 3)
      cy.get('select').should('have.length', 2)
      cy.getByForm('text', 'label')
        .type('Test decision tree')
        .should('have.value', 'Test decision tree')
      cy.getSelect('nodeId').select('General').should('have.value', '1')
      cy.getByForm('text', 'cutOffStart')
        .clear()
        .type('1')
        .should('have.value', '1')
      cy.getByForm('text', 'cutOffEnd')
        .clear()
        .type('5')
        .should('have.value', '5')
      cy.getByDataCy('submit').click()
      cy.wait(2000)

      // New diagnosis step
      // One hidden input in the slider component
      cy.get('input').should('have.length', 2)
      cy.get('textarea').should('have.length', 1)
      cy.getByDataCy('slider').should('be.visible')
      cy.getByForm('text', 'label')
        .type('Test diagnosis')
        .should('have.value', 'Test diagnosis')
      cy.getTextArea('description')
        .type('This is a description message')
        .should('have.value', 'This is a description message')
      cy.getByDataCy('slider_mark_5').click({ force: true })
      cy.getByDataCy('submit').click()
      cy.wait(2000)

      // Summary page
      cy.contains('Test diagnosis').should('be.visible')
      cy.getByDataCy('edit_diagnosis').should('be.visible').eq(-1).click()
      cy.getByForm('text', 'label')
        .should('have.value', 'Test diagnosis')
        .clear()
        .type('Another test diagnosis')
      cy.getTextArea('description')
        .should('have.value', 'This is a description message')
        .clear()
        .type('This is another description message')
      cy.getByDataCy('slider_mark_7').click({ force: true })
      cy.getByDataCy('submit').click()
      cy.wait(2000)
      cy.contains('Another test diagnosis').should('be.visible')

      cy.getByDataCy('add_diagnosis').should('be.visible').click()
      cy.getByForm('text', 'label')
        .type('Test diagnosis 2')
        .should('have.value', 'Test diagnosis 2')
      cy.getTextArea('description')
        .type('This is a description message 2')
        .should('have.value', 'This is a description message 2')
      cy.getByDataCy('slider_mark_2').click({ force: true })
      cy.getByDataCy('submit').click()
      cy.wait(2000)
      cy.contains('Test diagnosis 2').should('be.visible')
    })
  })
})
