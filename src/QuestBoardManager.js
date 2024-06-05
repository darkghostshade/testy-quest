import React, { Component } from 'react';
import axios from 'axios';
import './css/QuestStyles.css'; // Import the CSS file
import { ApiConnectionReplacement } from '../src/Enviromental Variables/APIConnection';

export class QuestBoardManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quests: [],
      isLoading: true
    };
  }

  componentDidMount() {
    // Fetch quests data from dummy API using Axios
    axios.get(ApiConnectionReplacement() + '/TestManager')
      .then(response => {
        this.setState({ quests: response.data, isLoading: false });
      })
      .catch(error => {
        console.error('Error fetching quests:', error);
        this.setState({ isLoading: false });
      });
  }

  renderQuestCards = () => {
    return this.state.quests.map((quest, index) => (
      <div key={index} className="col-md-4 mb-3 d-flex">
        <div className="sm-quest-card">
          <div className="row">
            <div className="col-12">
              <h6 className="quest-title">{quest.questName} {quest.tags.map((tag, index) => (<span key={index} className="badge text-bg-primary m-1">{tag.tagName}</span>))}</h6>
              <p className="quest-description">{quest.context}</p>
              <div className="mt-5">
              <h3>Quest Completion Status</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Quest Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Render table rows here */}
                </tbody>
              </table>
            </div>

             
            </div>
          </div>
        </div>
      </div>
    ));
  }


  render() {
    return (
      <div className="container mt-4">
        <div className="quest-banner rounded ">
          <h2 className="text-center gold-text ">this is you quilds board</h2>
          <p className="text-center gold-text ">Here, as guild instructor you are premited to add  </p>
        </div>

        {this.state.isLoading ? (
          <p>Loading quests...</p>
        ) : (
          <div>
            <div className="row">
              {this.renderQuestCards()}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default QuestBoardManager;
