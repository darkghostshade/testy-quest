describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get("#email.form-control").type("to.remco.b.pc@gmail.com")
    cy.get("#password.form-control").type("password123")
    cy.get('#accept-button').click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/Home')
    })
  })
})