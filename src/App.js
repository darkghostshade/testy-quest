
import { Route, Routes,useNavigate } from 'react-router-dom';
import {Home} from "./Home"
import {Login} from './Login';
import {Welcome} from './Welcome'
import {Test} from './Test'
import { useSelector} from 'react-redux';
function App() {        
    const user = useSelector(state => state.User);
    const navigate = useNavigate();
    
    // if (!user.Loged_in && window.location.pathname !=="/Login") {
    //     navigate('/Login');
    // }
    return (
        <Routes>
            <Route path="/" element={<Welcome/>} />
            <Route path="/Login" element={<Login />} />
            {true ? <Route path="/Home" element={<Home />} /> : null}
            {true ? <Route path="/Test" element={<Test />} /> : null}
        </Routes>
    );
}

export default App;