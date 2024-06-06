import React, { useState } from 'react';
import {useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginUser } from './userSlice';
import Cookies from 'js-cookie'; // Import Cookies

const LoginPage = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password })); // Dispatching the Login action with email and password
  };

  if (Cookies.get('firebaseToken') !== undefined) {
    return <Navigate to="/Home" />;
  } else {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header text-center">
                <h3>Login</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block mt-3">Login</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
              <h5>Firebase Token:</h5>
              <p>{Cookies.get('firebaseToken')}</p>
            </div>
      </div>
    )
    
  }
  
};

export class Login extends React.Component {
  render() {
    return <LoginPage />;
  }
}

export default Login;