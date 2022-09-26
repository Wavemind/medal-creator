describe('Account pages', () => {
  beforeEach(() => {
    // Navigate to the home page
    cy.visit('/')
    // Click on the user menu
    cy.getByDataCy('user_menu').click()
  })

  it('should navigate to the account information page and test form functionality', () => {
    cy.getByDataCy('menu_information').should('contain', 'Information')
    cy.getByDataCy('menu_information').click()
    cy.get('h2').should('contain', 'Information')
    cy.get('button[data-cy=subMenu_information]')
      .should('be.visible')
      .should('contain', 'Information')
      .should('have.css', 'background-color')
      .and('be.colored', '#0A2141')
    cy.get('input').should('have.length', 3)
    cy.getByForm('firstName').type('Admin').should('have.value', 'Admin')
    cy.getByForm('lastName').type('Wavemind').should('have.value', 'Wavemind')
    cy.getByForm('email')
      .type('admin@wavemind.ch')
      .should('have.value', 'admin@wavemind.ch')
  })

  it('should navigate to the account password page and test form functionality', () => {
    cy.getByDataCy('menu_password').should('contain', 'Password')
    cy.getByDataCy('menu_password').click()
    cy.get('h2').should('contain', 'Password')
    cy.get('button[data-cy=subMenu_password]')
      .should('be.visible')
      .should('contain', 'Password')
      .should('have.css', 'background-color')
      .and('be.colored', '#0A2141')
    cy.get('input').should('have.length', 2)
    cy.getByForm('password').type('123456').should('have.value', '123456')
    cy.getByForm('confirmation').type('123456').should('have.value', '123456')
  })

  it('should navigate to the account projects page', () => {
    cy.getByDataCy('menu_projects').should('contain', 'Projects')
    cy.getByDataCy('menu_projects').click()
    cy.get('h2').should('contain', 'Projects')
    cy.get('button[data-cy=subMenu_projects]')
      .should('be.visible')
      .should('contain', 'Projects')
      .should('have.css', 'background-color')
      .and('be.colored', '#0A2141')
  })
})
