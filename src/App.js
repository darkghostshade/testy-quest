import { Route, Routes} from 'react-router-dom';
import { Home } from "./Home";
import { Login } from './Login';
import { Welcome } from './Welcome';
import { QuestBoardManager } from './QuestBoardManager';
import { AddQuestForm } from './AddQuestForm';
import { Test } from './Test';
import { AddQuestionForm }  from './AddQuestionForm';
import { FirebaseTokenGenerator } from './FirebaseTokenGenerator'
import { Register} from './Register'
import Cookies from 'js-cookie';

function App() {
   

    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />}/>
            {Cookies.get('firebaseToken') !== undefined && <Route path="/Home" element={<Home />} />}
            {Cookies.get('firebaseToken') !== undefined  && <Route path="/QuestBoardManager" element={<QuestBoardManager />} />}
            {Cookies.get('firebaseToken') !== undefined  && <Route path="/QuestBoardManager/AddQuestForm" element={<AddQuestForm />} />}
            {Cookies.get('firebaseToken') !== undefined  && <Route path="/Test" element={<Test />} />}
            {Cookies.get('firebaseToken')!== undefined  && <Route path="/QuestionForm" element={<AddQuestionForm />} />}
            {Cookies.get('firebaseToken')!== undefined  && <Route path="/GetLoginToken" element={<FirebaseTokenGenerator />} />}
            {Cookies.get('firebaseToken')!== undefined  && <Route path="/Register" element={<Register />} />}
        </Routes>
    );
}

export default App;
