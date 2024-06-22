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


describe('Add Question Form', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('.form-check-input').check({ multiple: true })
    cy.get('button:contains("Accept")').click()
    cy.get("#email.form-control").type("to.remco.b.pc@gmail.com")
    cy.get("#password.form-control").type("password123")
    cy.get('#accept-button').click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/Home')
    })
    cy.visit('/QuestionForm')
  });

  it('should fill out the form and submit', () => {
    
      // Fill out the form inputs
      cy.get('input[name="text"]').type('What is the derivative of f(x) = x^2 * e^x');
      cy.get('input[name="title"]').type('Graph of f(x) = x^2 * e^x');
      cy.get('input[name="description"]').type('The graph shows the function f(x) = x^2 * e^x plotted over the interval [-2, 2].');

      // Add line dots
      cy.get('button:contains("Add Line Dot")').click();
      cy.get('input').each(($el, index, $list) => {
        const fieldName = $el.attr('name')
        let value
        let dot = true
        switch (fieldName) {
          case 'name':
            value = `Value ${index + 1}`
            break
          case 'x':
            value = `${index + 4}`
            break
          case 'y':
            value = `${index + 1}`
            break
          default:
            dot = false
        }
        if(dot === true){
          cy.wrap($el).type(value)
        }
        
      })
      // Add options
      cy.get('button:contains("Add Option")').click();
      cy.get('input[name="optionText"]').each(($el, index, $list) => {
        cy.wrap($el).type(`Value ${index + 1}`)
      })

      // Select correct answer
      cy.get('select[name="correctAnswer"]').select('A');
      cy.scrollTo('bottom')
      // Submit the form
      cy.get('button[type="submit"]').click();
      cy.intercept('POST', 'http://api.question.testy-quest.nl/NewQuestion/ProduceQuestion', (req) => {
        expect(req.body).to.deep.equal({
          "questionID": "",
          "text": "What is the derivative of f(x) = x^2 * e^x",
          "graph": {
            "title": "Graph of f(x) = x^2 * e^x",
            "description": "The graph shows the function f(x) = x^2 * e^x plotted over the interval [-2, 2].",
            "chartType": "line",
            "lineDots": [
              {"name": "Value 4", "data": {"x": "8", "y": "6"}},
              {"name": "Value 7", "data": {"x": "11", "y": "9"}}
            ]
          },
          "options": [
            {"optionBullet": "A", "optionText": "Value 1"},
            {"optionBullet": "B", "optionText": "Value 2"},
            {"optionBullet": "C", "optionText": "Value 3"}
          ],
          "correctAnswer": "",
          "id": "",
          "producerID": "",
          "producerName": ""
        })
        req.reply((res) => {
          expect(res.statusCode).to.equal(200)
        })
      })
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').click();
      
  });

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
    cy.intercept('POST', 'http://api.question.testy-quest.nl/NewQuestion/ProduceQuestion', (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.equal(200)
      })
    })

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