import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import Cookies from 'js-cookie';

export class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      currentQuestionIndex: 0,
      selectedOption: null,
      answeredCorrectly: null,
      error: null,
      isLoading: true
    };
  }

  componentDidMount() {
    this.fetchQuestions();
  }

  fetchQuestions = () => {
    // Fetch the Bearer token from cookie
    const firebaseToken = Cookies.get('firebaseToken');

    if (firebaseToken) {
      axios.get('http://localhost:5233/NewQuestion/GetQuestions', {
        headers: {
          'Authorization': `Bearer ${firebaseToken}`,
          'accept': '*/*'
        }
      })
      .then(response => {
        this.setState({ questions: response.data, error: null, isLoading: false });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        this.setState({ error: 'Failed to fetch data', isLoading: false });
        // Dummy data to show if fetch fails
        const dummyData = [{
          "questionID": "Q123",
          "text": "What is the derivative of f(x) = sin(x) + cos(x)?",
          "graph": {
            "lineDots": [
              {"name": "Point A", "data": {"x": "-1", "y": "8"}},
              {"name": "Point B", "data": {"x": "0", "y": "3"}},
              {"name": "Point C", "data": {"x": "1", "y": "0"}},
              {"name": "Point D", "data": {"x": "2", "y": "-1"}},
              {"name": "Point E", "data": {"x": "3", "y": "0"}},
              {"name": "Point F", "data": {"x": "4", "y": "3"}},
              {"name": "Point G", "data": {"x": "5", "y": "8"}}
            ],
            "title": "Graph of f(x) = sin(x) + cos(x)",
            "description": "The graph shows the function f(x) = sin(x) + cos(x) plotted over the interval [-2π, 2π].",
            "chartType": "line"
          },
          "options": [
            {"optionBullet": "A", "optionText": "cos(x) - sin(x)"},
            {"optionBullet": "B", "optionText": "-sin(x) - cos(x)"},
            {"optionBullet": "C", "optionText": "-cos(x) + sin(x)"},
            {"optionBullet": "D", "optionText": "sin(x) - cos(x)"}
          ],
          "producerID": "ZFusQUWa9nQ04fMkjDl9YhEUWqF3",
          "producerName": "Math Quiz Co."
        }];
        this.setState({ questions: dummyData, isLoading: false });
      });
    } else {
      console.error('Firebase token not found in cookies.');
    }
  };

  answer = (answerText) => {
    const { questions, currentQuestionIndex } = this.state;
    const question = questions[currentQuestionIndex];

    // Prepare the data to send
    const data = {
      UserId: "", // Replace with actual user ID if needed
      ExamId: "Exam1", // Replace with actual Exam ID
      QuestionId: question.questionID,
      AnswerText: answerText
    };

    // Fetch the Bearer token from cookie
    const firebaseToken = Cookies.get('firebaseToken');

    if (firebaseToken) {
      // Send POST request to API endpoint
      axios.post('http://api.testy-quest.nl/Answerwriter/ProduceAnswer', data, {
        headers: {
          'Authorization': `Bearer ${firebaseToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Answer submitted successfully:', response.data);
        // Move to the next question
        this.setState(prevState => ({
          currentQuestionIndex: prevState.currentQuestionIndex + 1,
          selectedOption: null,
          answeredCorrectly: null
        }));
      })
      .catch(error => {
        console.error('Error submitting answer:', error);
      });
    } else {
      console.error('Firebase token not found in cookies.');
    }
  };

  handleOptionChange = (event) => {
    this.setState({ selectedOption: event.target.value });
  };

  nextQuestion = () => {
    const { selectedOption } = this.state;
    if (!selectedOption) {
      alert("Please select an option.");
      return;
    }

    // Call answer function with selected option
    this.answer(selectedOption);
  };

  render() {
    const { questions, currentQuestionIndex, error, isLoading } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!questions || questions.length === 0) {
      return <div>Error: {error}</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="container bg-light">
        <h2>Math Question</h2>
        <hr />
        <div className="row">
          <div className="col-7 p-0">
            <LineChart width={600} height={300} data={currentQuestion.graph.lineDots.map(dot => dot.data)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="x" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </div>
          <div className="col-5">
            <p>{currentQuestion.text}</p>
            <form>
              {currentQuestion.options.map((option, index) => (
                <div className="form-check" key={index}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="options"
                    id={`option${index + 1}`}
                    value={option.optionBullet}
                    onChange={this.handleOptionChange}
                  />
                  <label className="form-check-label" htmlFor={`option${index + 1}`}>
                    {`${option.optionBullet}) ${option.optionText}`}
                  </label>
                </div>
              ))}
            </form>
            <button className="btn btn-primary mt-3" onClick={this.nextQuestion}>Next</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Test;
