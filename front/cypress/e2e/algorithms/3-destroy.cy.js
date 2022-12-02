import { first } from "lodash"

/* eslint-disable no-undef */
describe('Edit algorithm functionality', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.getByDataCy('project_show').first().click()
    cy.getByDataCy('sidebar_algorithms').click()
  })
  it('should test form functionality', () => {
    cy.getByDataCy('datatable_menu').eq(-1).click()
    cy.getByDataCy('datatable_destroy').eq(-1).click()

    cy.getByDataCy('dialog_accept').click()
    cy.getByDataCy('datatable_row')
      .should('have.length', 1)
      .first()
      .should('not.contain', 'My test algorithm')
  })
})
