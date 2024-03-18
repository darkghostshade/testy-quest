import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginUser } from './userSlice';

const LoginPage = () => {

  const user = useSelector(state => state.User);
  const dispatch = useDispatch(); // Getting the dispatch function
  
  const handleLogin = (e) => {
    console.log(user.Loged_in)
    e.preventDefault();
    dispatch(LoginUser()); // Dispatching the Login action
  };

  if (user.Loged_in) {
    return <Navigate to="/Home" />;
  } else {
    return(
      <div>
      <p>Not logged in</p>
      <button onClick={handleLogin} type="button" class="btn btn-outline-dark">Dark</button>
      </div>
    ) ;
    
  }
};

export class Login extends React.Component {
  render() {
    return <LoginPage />;
  }
}

export default Login;
