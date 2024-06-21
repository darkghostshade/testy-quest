describe('test if i can login', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('.form-check-input').check({ multiple: true })
    cy.get('button:contains("Accept")').click()
    cy.get("#email.form-control").type("to.remco.b.pc@gmail.com")
    cy.get("#password.form-control").type("password123")
    cy.get('#accept-button').click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/Home')
    })
  })
})

describe('can i take a exam ', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('.form-check-input').check({ multiple: true })
    cy.get('button:contains("Accept")').click()
    cy.get("#email.form-control").type("to.remco.b.pc@gmail.com")
    cy.get("#password.form-control").type("password123")
    cy.get('#accept-button').click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/Home')
    })
    cy.get('button:contains("Start Quest")').first().click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/Test')
    })
    cy.get('h2').should('contain', 'Math Question')


  })
})

describe('exam submision', () => {
  it('passes', () => {
    cy.viewport(1366 , 768)
    cy.visit('/login')
    cy.get('.form-check-input').check({ multiple: true })
    cy.get('button:contains("Accept")').click()
    cy.get("#email.form-control").type("to.remco.b.pc@gmail.com")
    cy.get("#password.form-control").type("password123")
    cy.get('#accept-button').click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/Home')
    })
    cy.get('button:contains("Start Quest")').first().click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/Test')
    })
    cy.get('h2').should('contain', 'Math Question')
    cy.get('input.form-check-input').first().check()
    cy.get('button:contains("Next")').first().click()
    cy.intercept('POST', 'http://api.testy-quest.nl/Answerwriter/ProduceAnswer', (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.equal(200)
      })
    })
  })
})