import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginUser } from './userSlice';
import Cookies from 'js-cookie'; // Import Cookies
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      var hello =await dispatch(LoginUser({ email, password }));
      if(hello.error.message === "Rejected" ){
      setError('Email or password is incorrect');
      }
      else{
        navigate('/Home');
      } 
    } catch (err) {
        setError('An error occurred. Please try again later.');
    }
    
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
                {error && <div className="alert alert-danger">{error}</div>}
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
                  <button type="submit" id="accept-button"className="btn btn-primary btn-block mt-3">Login</button>
                </form>
              </div>
            </div>
          </div>
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
