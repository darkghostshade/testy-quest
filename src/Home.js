import React, { Component } from 'react';
import axios from 'axios';
import './css/QuestStyles.css'; // Import the CSS file
import chest from "./image/chest.png"
import DungeonExam from "./image/DungeonExam.png"
import { QuestionApiConnectionReplacement } from '../src/Enviromental Variables/APIConnection';
import Cookies from 'js-cookie';

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quests: [],
      isLoading: true
    };
  }

  componentDidMount() {
    const token = Cookies.get('firebaseToken');
    
    axios.get(`${QuestionApiConnectionReplacement}/NewQuestion/Quests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      this.setState({ quests: response.data, isLoading: false });
    })
    .catch(error => {
      console.error('Error fetching quests:', error);
      this.setState({ isLoading: false, error: 'Failed to fetch data' });
    });
  }

  renderTestorExamImage=(progress)=>{
    if(progress < 100){
      return <img src={chest} alt="chest" ></img>;
    }
    else{
      return <img src={DungeonExam} alt="DungeonDoor" ></img>
    }
  }
  renderTestorExamButton=(progress,questName)=>{
    if(progress < 100){
      return<button className="quest-button" onClick={() => this.startQuest(questName)}>Start Quest</button>;
    }
    else{
      return <button className="quest-button" onClick={() => this.startDungeon(questName)}>Start Dungeon</button>;
    }
  }
  

  renderQuestCards = () => {
    return this.state.quests.map((quest, index) => (
      <div key={index} className="quest-card ">
        <div class = "row">
        <div class="col-4">
          {this.renderTestorExamImage(quest.progress)}
        
        </div>
        <div class="col-8">
        <h5 className="quest-title">{quest.questName} {quest.tags.map((tag, index) => (<span class="badge text-bg-primary m-1">{tag.tagName}</span>))} </h5>
        <p className="quest-description">{quest.context} </p>
        <div className="progress">
              <div className={`progress-bar ${this.getProgressColor(quest.progress)} rounded-pill`} role="progressbar" style={{ width: `${quest.progress}%` }} aria-valuenow={quest.progress} aria-valuemin="0" aria-valuemax="100">{quest.progress.toFixed(0)}%</div>
            </div>
        <p className="quest-good-questions">{quest.gatheredScore} / {quest.neededScore} Good Questions</p>
        {this.renderTestorExamButton(quest.progress,quest.questName)}
        </div>
        </div>
      </div>
      
    ));
  }

  startQuest = (questName) => {
    console.log("Starting quest:", questName);
    // Implement logic to start the quest here
  }
  startDungeon = (questName) => {
    console.log("Starting Dungeon:", questName);
    // Implement logic to start the quest here
  }

  getProgressColor = (progress) => {
    if (progress >= 80) {
      return "bg-success";
    } else if (progress >= 50) {
      return "bg-warning";
    } else {
      return "bg-danger";
    }
  }

  render() {
    return (
      <div className="container mt-4">
        <div class="quest-banner rounded ">
        <h2 class="text-center gold-text ">Welcome to the Quest Program</h2>
        <p class="text-center gold-text ">Here, adventurers can embark on various quests to explore the world.</p>
        </div>
        

        {this.state.isLoading ? (
          <p>Loading quests...</p>
        ) : (
          <div className="quest-container">
            {this.renderQuestCards()}
          </div>
        )}
      </div>
    );
  }
}

export default Home;







// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// export class Home extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       tests: [
//         { 
//           title: "Test 1", 
//           description: "This is test 1 description.", 
//           progress: 20,
//           goodQuestions: 10,
//           goal: 50
//         }, 
//         { 
//           title: "Test 2", 
//           description: "This is test 2 description.", 
//           progress: 70,
//           goodQuestions: 35,
//           goal: 50
//         },
//         { 
//           title: "Test 3", 
//           description: "This is test 3 description.", 
//           progress: 100,
//           goodQuestions: 50,
//           goal: 50
//         }
//       ]
//     };
//   }

//   startTest = (testTitle) => {
//     window.location="./Test "
//     console.log("Starting test:", testTitle);
//     // Implement logic to start the test here
//   }

//   startExam = (examTitle) => {
//     console.log("Starting exam:", examTitle);
//     // Implement logic to start the exam here
//   }

//   getProgressColor = (progress) => {
//     if (progress >= 80) {
//       return "bg-success";
//     } else if (progress >= 50) {
//       return "bg-warning";
//     } else {
//       return "bg-danger";
//     }
//   }

//   renderTestCards = () => {
//     return this.state.tests.map((test, index) => (
//       <div key={index} className="col-md-4 mb-3">
//         <div className="card">
//           <div className="card-body">
//             <h5 className="card-title">{test.title}</h5>
//             <p className="card-text">{test.description}</p>
//             <div className="progress">
//               <div className={`progress-bar ${this.getProgressColor(test.progress)} rounded-pill`} role="progressbar" style={{ width: `${test.progress}%` }} aria-valuenow={test.progress} aria-valuemin="0" aria-valuemax="100">{test.progress}%</div>
//             </div>
//             <p className="mt-2">{test.goodQuestions} / {test.goal} Good Questions</p>
//             <button className="btn btn-primary mt-2" onClick={() => this.startTest(test.title)}>Start Test</button>
//           </div>
//         </div>
//       </div>
//     ));
//   }

//   render() {
//     return (
//       <div className="container mt-4">
//         <h2>Welcome to the Examination Program</h2>
//         <p>Here, businesses can create tests and users can take those tests.</p>
//         <hr />

//         <ul className="nav nav-tabs" id="myTab" role="tablist">
//           <li className="nav-item">
//             <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
//           </li>
//           <li className="nav-item">
//             <a className="nav-link" id="exams-tab" data-toggle="tab" href="#exams" role="tab" aria-controls="exams" aria-selected="false">Exams</a>
//           </li>
//           <li className="nav-item">
//             <a className="nav-link" id="completed-tab" data-toggle="tab" href="#completed" role="tab" aria-controls="completed" aria-selected="false">Completed</a>
//           </li>
//         </ul>

//         <div className="tab-content mt-4" id="myTabContent">
//           <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
//             <div id="testList">
//               <h3>Available Tests</h3>
//               <div className="row" id="testCards">
//                 {this.renderTestCards()}
//               </div>
//             </div>
//           </div>
//           <div className="tab-pane fade" id="exams" role="tabpanel" aria-labelledby="exams-tab">
//             <div className="row">
//               {this.state.tests.length > 2 &&
//                 <div className="col-md-4 mb-3">
//                   <div className="card">
//                     <div className="card-body">
//                       <h5 className="card-title">{this.state.tests[2].title}</h5>
//                       <p className="card-text">{this.state.tests[2].description}</p>
//                       <div className="progress">
//                         <div className={`progress-bar ${this.getProgressColor(this.state.tests[2].progress)} rounded-pill`} role="progressbar" style={{ width: `${this.state.tests[2].progress}%` }} aria-valuenow={this.state.tests[2].progress} aria-valuemin="0" aria-valuemax="100">{this.state.tests[2].progress}%</div>
//                       </div>
//                       <p className="mt-2">{this.state.tests[2].goodQuestions} / {this.state.tests[2].goal} Good Questions</p>
//                       <button className="btn btn-primary mt-2" onClick={() => this.startExam(this.state.tests[2].title)}>Start Exam</button>
//                     </div>
//                   </div>
//                 </div>
//               }
//             </div>
//           </div>
//           <div className="tab-pane fade" id="completed" role="tabpanel" aria-labelledby="completed-tab">
//             <h3>Completed</h3>
//             <div className="row" id="completedCards">
//               {/* Completed cards will be dynamically added here */}
//             </div>
//           </div>
//         </div>

//         <hr />

//         <div id="testTakingSection" style={{ display: 'none' }}>
//           <h3>Take Test</h3>
//           {/* Test questions and options will be displayed here */}
//         </div>
//       </div>
//     );
//   }
// }

// export default Home;
