import React, { Component } from 'react';

export class AddQuestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questName: '',
      context: '',
      guildInstructors: '',
      tags: '',
      excludedTags: '',
      maxScore: '',
      checkPoints: '',
      aventureursParties: ''
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { questName, context, guildInstructors, tags, excludedTags, maxScore, checkPoints, aventureursParties } = this.state;
    // Send the form data to the server or perform further processing
    console.log('Form submitted:', { questName, context, guildInstructors, tags, excludedTags, maxScore, checkPoints, aventureursParties });
    // Optionally, you can also reset the form fields here
    this.setState({
      questName: '',
      context: '',
      guildInstructors: '',
      tags: '',
      excludedTags: '',
      maxScore: '',
      checkPoints: '',
      aventureursParties: ''
    });
  }

  render() {
    const { questName, context, guildInstructors, tags, excludedTags, maxScore, checkPoints, aventureursParties } = this.state;
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={this.handleSubmit}>
              <div className="mb-3">
                <label htmlFor="questName" className="form-label">Quest Name:</label>
                <input type="text" id="questName" name="questName" value={questName} onChange={this.handleInputChange} className="form-control" required />
              </div>

              <div className="mb-3">
                <label htmlFor="context" className="form-label">Context:</label>
                <textarea id="context" name="context" value={context} onChange={this.handleInputChange} className="form-control" rows="4" required></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="guildInstructors" className="form-label">Guild Instructors:</label>
                <input type="text" id="guildInstructors" name="guildInstructors" value={guildInstructors} onChange={this.handleInputChange} className="form-control" required />
              </div>

              <div className="mb-3">
                <label htmlFor="tags" className="form-label">Tags:</label>
                <input type="text" id="tags" name="tags" value={tags} onChange={this.handleInputChange} className="form-control" required />
              </div>

              <div className="mb-3">
                <label htmlFor="excludedTags" className="form-label">Excluded Tags:</label>
                <input type="text" id="excludedTags" name="excludedTags" value={excludedTags} onChange={this.handleInputChange} className="form-control" />
              </div>

              <div className="mb-3">
                <label htmlFor="maxScore" className="form-label">Max Score:</label>
                <input type="number" id="maxScore" name="maxScore" value={maxScore} onChange={this.handleInputChange} className="form-control" required />
              </div>

              <div className="mb-3">
                <label htmlFor="checkPoints" className="form-label">Check Points:</label>
                <input type="number" id="checkPoints" name="checkPoints" value={checkPoints} onChange={this.handleInputChange} className="form-control" />
              </div>

              <div className="mb-3">
                <label htmlFor="aventureursParties" className="form-label">Aventureurs Parties:</label>
                <input type="number" id="aventureursParties" name="aventureursParties" value={aventureursParties} onChange={this.handleInputChange} className="form-control" />
              </div>

              <button type="submit" className="btn btn-primary">Create Quest</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
