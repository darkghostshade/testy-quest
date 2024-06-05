import { Route, Routes, useNavigate } from 'react-router-dom';
import { Home } from "./Home";
import { Login } from './Login';
import { Welcome } from './Welcome';
import { QuestBoardManager } from './QuestBoardManager';
import { AddQuestForm } from './AddQuestForm';
import { Test } from './Test';
import Cookies from 'js-cookie';

function App() {
    const navigate = useNavigate();

    // Check if the user is not logged in and the token is not available in the cookie
    if (!Cookies.get('firebaseToken') && window.location.pathname !== "/Login") {
        navigate('/Login');
    }

    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/Login" element={<Login />} />
            {Cookies.get('firebaseToken') !== undefined && <Route path="/Home" element={<Home />} />}
            {Cookies.get('firebaseToken') !== undefined  && <Route path="/QuestBoardManager" element={<QuestBoardManager />} />}
            {Cookies.get('firebaseToken') !== undefined  && <Route path="/QuestBoardManager/AddQuestForm" element={<AddQuestForm />} />}
            {Cookies.get('firebaseToken') !== undefined  && <Route path="/Test" element={<Test />} />}
        </Routes>
    );
}

export default App;
