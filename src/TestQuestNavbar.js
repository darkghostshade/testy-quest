import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Logout } from './userSlice';


const Navs = () => {

  const user = useSelector(state => state.User);
  const dispatch = useDispatch(); // Getting the dispatch function
  
  const handleLogOut = (e) => {
    console.log('logedout')
    e.preventDefault();
    dispatch(Logout()); // Dispatching the Login action
  };
  console.log(user.Loged_in)
  if (user.Loged_in) {
    return( 
        <li class="nav-item">
          <p class="nav-link" onClick={handleLogOut}>Logout</p>
        </li>
    ) ;
  }
  else{
    return( 
        <li class="nav-item">
          <p class="nav-link" onClick={handleLogOut}>Logout</p>
        </li>
    ) ;
    
  } 
};

export class TestQuestNavbar extends React.Component {
  render() {
    
    return (
    <nav class=" quest-banner navbar navbar-expand-lg navbar-dark  mb-1">
        <a class=" ms-1 navbar-brand" href="./Home">Testy Quest</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" href="./Home">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="./Login">About</a>
            </li>
            <Navs/>
           
        </ul>
        </div>
      </nav>
    );
  }
}

export default TestQuestNavbar;