import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { x: '-1', y: 8 },
        { x: '0', y: 3 },
        { x: '1', y: 0 },
        { x: '2', y: -1 },
        { x: '3', y: 0 },
        { x: '4', y: 3 },
        { x: '5', y: 8 }
      ]
    };
  }

  nextQuestion = () => {
    const selectedOption = document.querySelector('input[name="options"]:checked');
    if (selectedOption) {
      if (selectedOption.id === "option1") {
        console.log("Correct!");
      } else {
        console.log("Wrong!");
        
      }
    } else {
      console.log("Please select an option.");
    }
  };

  render() {
    return (
      <div inert className="container ">
        <h2>Math Question</h2>
        <hr />
        <div class="quest-card align-center">
        <div className="row">
          <div className="col-7 p-0">
            
            <LineChart width={600} height={300} data={this.state.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="x" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
            </div>
          </div>
          <div className="col-5">
            
              <p>What is the solution of x in this equation:</p>
              <p>(x^2 - 4x + 3 = 0)?</p>
              <form>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="options" id="option1" value="option1" />
                  <label className="form-check-label" htmlFor="option1">
                    a) (x = 1) and (x = 3)
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="options" id="option2" value="option2" />
                  <label className="form-check-label" htmlFor="option2">
                    b) (x = 2) and (x = 2)
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="options" id="option3" value="option3" />
                  <label className="form-check-label" htmlFor="option3">
                    c) (x = -1) and (x = -3)
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="options" id="option4" value="option4" />
                  <label className="form-check-label" htmlFor="option4">
                    d) (x = -2) and (x = -2)
                  </label>
                </div>
              </form>
              <button className="btn btn-primary mt-3" onClick={this.nextQuestion}>Next</button>
            
          </div>
        </div>
      </div>
    );
  }
}

export default Test;
