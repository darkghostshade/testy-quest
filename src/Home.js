import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/QuestStyles.css'; // Import the CSS file
import chest from "./image/chest.png";
import DungeonExam from "./image/DungeonExam.png";
import { QuestionApiConnectionReplacement } from '../src/Enviromental Variables/APIConnection';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const HomePage = () => {
  const [quests, setQuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const token = Cookies.get('firebaseToken');
    
    axios.get(`${QuestionApiConnectionReplacement()}/NewQuestion/Quests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setQuests(response.data);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching quests:', error);
      setIsLoading(false);
    });
  }, []);

  const renderTestorExamImage = (progress) => {
    if (progress < 100) {
      return <img src={chest} alt="chest" />;
    } else {
      return <img src={DungeonExam} alt="DungeonDoor" />;
    }
  };

  const renderTestorExamButton = (progress, questName) => {
    if (progress < 100) {
      return <button className="quest-button" onClick={() => startQuest(questName)}>Start Quest</button>;
    } else {
      return <button className="quest-button" onClick={() => startDungeon(questName)}>Start Dungeon</button>;
    }
  };

  const renderQuestCards = () => {
    return quests.map((quest, index) => (
      <div key={index} className="quest-card">
        <div className="row">
          <div className="col-4">
            {renderTestorExamImage(quest.progress)}
          </div>
          <div className="col-8">
            <h5 className="quest-title">
              {quest.questName} {quest.tags.map((tag, index) => (<span key={index} className="badge text-bg-primary m-1">{tag.tagName}</span>))}
            </h5>
            <p className="quest-description">{quest.context}</p>
            <div className="progress">
              <div className={`progress-bar ${getProgressColor(quest.progress)} rounded-pill`} role="progressbar" style={{ width: `${quest.progress}%` }} aria-valuenow={quest.progress} aria-valuemin="0" aria-valuemax="100">
                {quest.progress.toFixed(0)}%
              </div>
            </div>
            <p className="quest-good-questions">{quest.gatheredScore} / {quest.neededScore} Good Questions</p>
            {renderTestorExamButton(quest.progress, quest.questName)}
          </div>
        </div>
      </div>
    ));
  };

  const startQuest = (questName) => {
    console.log("Starting quest:", questName);
    navigate('/Test');
  };

  const startDungeon = (questName) => {
    console.log("Starting Dungeon:", questName);
    navigate('/Test');
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) {
      return "bg-success";
    } else if (progress >= 50) {
      return "bg-warning";
    } else {
      return "bg-danger";
    }
  };

  return (
    <div className="container mt-4">
      <div className="quest-banner rounded">
        <h2 className="text-center gold-text">Welcome to the Quest Program</h2>
        <p className="text-center gold-text">Here, adventurers can embark on various quests to explore the world.</p>
      </div>
      {isLoading ? (
        <p>Loading quests...</p>
      ) : (
        <div className="quest-container">
          {renderQuestCards()}
        </div>
      )}
    </div>
  );
};

export class Home extends React.Component {
  render() {
    return <HomePage />;
  }
}

export default Home;

